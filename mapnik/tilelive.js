var tilelive = require('tilelive'),
    fs = require( 'fs' ),
    xml = require( 'libxmljs' ),
    _ = require( 'underscore' ),
    pg = require( 'pg' ),
    AWS = require( 'aws-sdk' ),
    cache,
    db = require( '../db' ),
    cloudfront = "https://d1nxja8ugt29ju.cloudfront.net/",
    hillshade = [
      { year : 1960, file : '/data/raster/Hillshade_1960_8888_New.tif' },
      { year : 1924, file : '/data/raster/Hillshade_1924_1959_New.tif' },
      { year : 1923, file : '/data/raster/Hillshade_1923_1923_New.tif' },
      { year : 1922, file : '/data/raster/Hillshade_1922_1922_New.tif' },
      { year : 1910, file : '/data/raster/Hillshade_1910_1921_New.tif' },
      { year : 1905, file : '/data/raster/Hillshade_1905_1909_New.tif' },
      { year : 1880, file : '/data/raster/Hillshade_1880_1904_New.tif' },
      { year : 1500, file : '/data/raster/Hillshade_1500_1879_New.tif' }
    ];

require('tilelive-mapnik').registerProtocols(tilelive);

//loading AWS config
AWS.config.loadFromPath( __dirname + '/aws-config.json' );
var s3 = new AWS.S3();

//postgres connect
var client = new pg.Client( db.conn );
client.connect();

exports.tiles = function( req, res ){
  var dev = req.headers.host.match( /-dev/ ) ? true : false;
  cache = req.query.cache == undefined;
  var png = "cache/png/" + req.params.year + "/" + req.params.layer + "/" + req.params.z + "/" + req.params.x + "/" + req.params.y + ".png";
  
  client.query( "SELECT id FROM cache WHERE year = $1 AND layer = $2 AND z = $3 AND x = $4 AND y = $5", [req.params.year, req.params.layer, req.params.z, req.params.x, req.params.y], function (err, result) {
    if (err) {
      console.log( err );
      res.status( 500 ).send( 'Error checking cache' );
    } else if( result.rowCount && dev === false && cache === true ){
      res.redirect( cloudfront + png );
    }
    else{
      parseXML( req, res, renderTile );
    }
  });
};

exports.raster = function( req, res ){
  var dev = req.headers.host.match( /-dev/ ) ? true : false;
  cache = req.query.cache == undefined;
  var png = "cache/png/null/" + req.params.id + "/" + req.params.z + "/" + req.params.x + "/" + req.params.y + ".png";
  
  client.query( "SELECT id FROM cache WHERE year IS NULL AND layer = $1 AND z = $2 AND x = $3 AND y = $4", [req.params.id, req.params.z, req.params.x, req.params.y], function (err, result) {
    if (err) {
      console.log( err );
      res.status( 500 ).send( 'Error checking cache' );
    } else if( result.rowCount && cache === true ){
      res.redirect( cloudfront + png );
    }
    else{
      req.params.year = null;
      req.params.layer = req.params.id;
      parseRasterXML( req, res, renderTile );
    }
  });
};

function parseXML( req, res, callback ){
	var dev = req.headers.host.match( /-dev/ ) ? true : false,
			file = dev ? "/data/cache/xml/" + req.params.year + "/" + req.params.layer + "-dev.xml" : "/data/cache/xml/" + req.params.year + "/" + req.params.layer + ".xml";
		
	if( fs.existsSync( file ) ){
		callback( file, req, res );
	}
	else{
		var data = fs.readFileSync( __dirname + "/stylesheet.xml", 'utf8' );	
    var xmlDoc = xml.parseXml( data );
    var sources = xmlDoc.find( "//Parameter[@name='table']" ),
        pghost = xmlDoc.find( "//Parameter[@name='host']" ),
        pguser = xmlDoc.find( "//Parameter[@name='user']" ),
        passwords = xmlDoc.find( "//Parameter[@name='password']" );
			
		_.each( sources, function( item ){
			var t = item.text().replace( /99999999/g, req.params.year );
			if( dev ){
				t = t.replace( /FROM (.*?) WHERE/g, 'FROM \$1_dev WHERE' );
			}
			item.text( t );
		});
		
		_.each( pghost, function( item ){
  		item.text( db.conn.replace( /.*@(.*)\/.*/, "$1" ) );
		});
		
		_.each( pguser, function( item ){
  		item.text( db.conn.replace( /.*\/\/(.*):.*/, "$1" ) );
		});
		
		_.each( passwords, function( item ){
  		item.text( db.conn.replace( /.*:(.*)@.*/g, "$1" ) );
		});

		var off = req.params.layer.split( "," );
		off = off.concat( _.map( off, function( val ){ return val + "_labels" } ) );
		_.each( off, function( l ){
			sources = xmlDoc.find( "//Layer[@name='" + l + "']" );
			_.each( sources, function( item ){
				item.attr( { "status" : "off" } );
			})
		});
			
		var hs = xmlDoc.find( "//Parameter[@name='file']" );
		_.each( hs, function( item ){
			if( item.text().match( /hillshade/ ) ) item.text( _.find( hillshade, function( h ){ return h.year <= req.params.year } ).file );
		});
			
    mkdir( "/data/cache/xml/" + req.params.year );
			
    fs.writeFileSync( file, xmlDoc.toString() );
    callback( file, req, res );
  }
}

function parseRasterXML( req, res, callback ){
  var file = "/data/cache/raster/" + req.params.id + "/raster.xml";
  
  if( fs.existsSync( file ) ){
		callback( file, req, res );
	}
	else{
  	  var data = fs.readFileSync( __dirname + "/raster.xml", 'utf8' );
  	  var xmlDoc = xml.parseXml( data );
  	  var sources = xmlDoc.find( "//Parameter[@name='file']" );
				
    sources[ 0 ].text( "/data/raster/" + req.params.id + ".tif" );
		mkdir( "/data/cache/raster/" + req.params.id );
		
		fs.writeFileSync( file, xmlDoc.toString() );
    callback( file, req, res );
	}
}

function mkdir( path, root ) {
  var dirs = path.split('/'), dir = dirs.shift(), root = (root||'')+dir+'/';
  try { fs.mkdirSync(root); }
  catch (e) {
    //dir wasn't made, something went wrong
    if(!fs.statSync(root).isDirectory()) throw new Error(e);
  }
  return !dirs.length||mkdir(dirs.join('/'), root);
}

function renderTile( filename, req, res ){			
  var dev = req.headers.host.match( /-dev/ ) ? true : false;
	
  tilelive.load('mapnik://' + filename, function( err, source ){
    if( err  ){
      console.log( err );
      res.status( 500 ).send( 'Error reading XML' );
    }
    else {
	    source.getTile( req.params.z, req.params.x, req.params.y, function( err, tile, headers ){
	      if( err ){
		      console.log( err );
	        res.status( 500 ).send( 'Error writing tile' );
	      }
	      else {
	        res.send( tile );
	        if( dev === false ) saveTile( req, tile, res );
	      }
	    });
	  }
  });
}

function saveTile( req, tile, res ){
	var dev = req.headers.host.match( /-dev/ ) ? true : false;
	
  if( cache === false || dev === true ) return false;
  var png = "cache/png/" + req.params.year + "/" + req.params.layer + "/" + req.params.z + "/" + req.params.x + "/" + req.params.y + ".png";
  var p = { Bucket : 'imaginerio', Key : png, Body : tile, ACL : 'public-read' };
  s3.putObject( p, function( err, data ){
    if( err ){
      console.log( err );
    } else {
      client.query( "INSERT INTO cache ( year, layer, z, x, y ) VALUES ( $1, $2, $3, $4, $5 )", [req.params.year, req.params.layer, req.params.z, req.params.x, req.params.y], function (err, result) {
        if (err) console.log(err);
        else console.log( png + " uploaded to S3" );
      });
    }
  });
}
