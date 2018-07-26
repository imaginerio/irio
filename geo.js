var pg = require('pg'),
	dbgeo = require('dbgeo'),
	_ = require('underscore'),
	db = require('./db'),
	dev = require('./dev');

exports.probe = function (req, res) {
	var client = new pg.Client(db.conn);
	client.connect();

	var year = req.params.year,
		coords = req.params.coords,
		radius = req.params.radius / 1000,
		layers = req.params.layers,
		q = dev.checkQuery(
			`SELECT array_agg( id ) AS id, name, layer, featuretyp
				FROM (
					SELECT globalid AS id, namecomple AS name, layer, featuretyp, geom
					FROM baseline
					WHERE namecomple IS NOT NULL AND firstdispl <= $1 AND lastdispla >= $1
					UNION SELECT globalid AS id, namecomple AS name, layer, featuretyp, geom
					FROM basepoly
					WHERE namecomple IS NOT NULL AND firstdispl <= $1 AND lastdispla >= $1
					UNION SELECT globalid AS id, namecomple AS name, layer, featuretyp, geom
					FROM basepoint
					WHERE namecomple IS NOT NULL AND firstdispl <= $1 AND lastdispla >= $1
					ORDER BY layer
				) as q
				WHERE ST_DWithin( geom, ST_SetSRID( ST_MakePoint( ${coords} ), 4326 ), $2 )
				GROUP BY name, layer, featuretyp
				ORDER BY layer, featuretyp`, req);

	client.query(q, [year, radius], function (err, result) {
		var results = sendSearchResults(result, layers);
		res.send(results);
		client.end();
	});
}

exports.box = function (req, res) {
	var client = new pg.Client(db.conn);
	client.connect();

	var year = req.params.year,
		c1 = req.params.c1,
		c2 = req.params.c2,
		layers = req.params.layers,
		q = dev.checkQuery(
			`SELECT
					array_agg( id ) AS id,
					name,
					array_agg( file ) AS file,
					layer,
					featuretyp
				FROM (
					SELECT
						globalid AS id,
						namecomple AS name,
						layer,
						featuretyp,
						NULL AS file,
						geom
					FROM baseline
					WHERE namecomple IS NOT NULL AND firstdispl <= $1 AND lastdispla >= $1
					UNION SELECT
						globalid AS id,
						namecomple AS name,
						layer,
						featuretyp,
						NULL AS file,
						geom
					FROM basepoly
					WHERE namecomple IS NOT NULL AND firstdispl <= $1 AND lastdispla >= $1
					UNION SELECT
						globalid AS id,
						namecomple AS name,
						layer,
						featuretyp,
						NULL AS file,
						geom
					FROM basepoint
					WHERE namecomple IS NOT NULL AND firstdispl <= $1 AND lastdispla >= $1
					UNION SELECT
						imageid AS id,
						title AS name,
						layer,
						NULL AS featuretyp,
						'SSID' || globalid AS file,
						geom
					FROM viewsheds
					WHERE firstdispl <= $1 AND lastdispla >= $1
					ORDER BY layer
				) as q
				WHERE geom && ST_MakeEnvelope( $2, $3, 4326 )
				GROUP BY name, layer, featuretyp
				ORDER BY layer, featuretyp`, req);

	var query = client.query(q, [year, c1, c2], function (err, results) {
		var results = sendSearchResults(result, layers);
		res.send(results);
		client.end();
	});
}

function sendSearchResults(result, layers) {
	var results = [];
	_.each(result.rows, function (r) {
		if (layers === undefined || layers.indexOf(r.grouping) == -1) results.push(_.omit(r, 'grouping'));
	});

	return results;
}

exports.draw = function (req, res) {
	var client = new pg.Client(db.conn);
	client.connect();

	var id = req.params.id,
		year = req.params.year,
		q = dev.checkQuery(
			`SELECT name, ST_Union( geom ) AS geom
				FROM (
					SELECT namecomple AS name, geom
					FROM baseline
					WHERE namecomple = $1 AND firstdispl <= $2 AND lastdispla >= $2
					UNION SELECT namecomple AS name, geom
					FROM basepoly
					WHERE namecomple = $1 AND firstdispl <= $2 AND lastdispla >= $2
					UNION SELECT namecomple AS name, geom
					FROM basepoint
					WHERE namecomple = $1 AND firstdispl <= $2 AND lastdispla >= $2
				) AS q
				GROUP BY name`, req);

	client.query(q, [id, year], function (err, result) {
		if (result.rows.length) {
			dbgeo.parse(result.rows, { outputFormat: 'geojson' }, function(error, data) {
				if (data.features[0].geometry.type == "Point") {
					var coords = data.features[0].geometry.coordinates.join(" "),
						id = data.features[0].properties.id;

					client.query(`SELECT $1 AS id, ST_Buffer( ST_GeomFromText( 'POINT(${coords})' ), 0.0005 ) AS geometry`, [id], function (err, result2) {
						dbgeo.parse(result2.rows, { outputFormat: 'geojson' }, function(error, data) {
							res.send(data);
							client.end();
						});
					});
				} else if (data.features[0].geometry.type == "MultiLineString") {
					client.query("SELECT ST_AsGeoJSON( ST_LineMerge( ST_GeomFromGeoJSON( $1 ) ) ) AS geom", [JSON.stringify(data.features[0].geometry)], function (err, result) {
						_.each(result.rows, function (r) {
							data.features[0].geometry = JSON.parse(r.geom);
						});
						
						res.send(data);
						client.end();
					});
				} else {
					res.send(data);
					client.end();
				}
			});
		} else {
			res.send([]);
			client.end();
		}
	});
}

exports.visual = function( req, res ){
	postgeo.connect( db.conn );
	
	var year = req.params.year,
			max = req.query.max || year,
			q = dev.checkQuery( "SELECT imageid AS id, firstdispl || ' - ' || lastdispla AS date, creator, title AS description, notes AS credits, ST_AsGeoJSON( ST_Collect( ST_SetSRID( ST_MakePoint( longitude, latitude ), 4326 ), geom ) ) AS geometry FROM viewsheds WHERE firstdispl <= " + max + " AND lastdispla >= " + year, req );
	
	postgeo.query( q, "geojson", function( data ){
		res.send( data );
	});
}

exports.plan = function (req, res) {
	var client = new pg.Client(db.conn);
	client.connect();

	var plan = decodeURI(req.params.name);

	var q = dev.checkQuery(
		`SELECT
			globalid AS id,
			namecomple AS name,
			geom
		FROM plannedline
		WHERE planname = $1
		UNION SELECT
			globalid AS id,
			namecomple AS name,
			geom
		FROM plannedpoly
		WHERE planname = $1`, req);

	client.query(q, [plan], function (err, result) {
		if (result.rows.length) {
			dbgeo.parse(result.rows, { outputFormat: 'geojson' }, function(error, data) {
				res.send(data);
				client.end();
			});
		} else {
			res.send([]);
			client.end();
		}
	});
}

exports.feature = function( req, res ){
	postgeo.connect( db.conn );
	
	var year = req.params.year,
			id = req.params.id,
			q = dev.checkQuery( "SELECT ST_AsGeoJSON( geom ) AS geometry FROM ( SELECT geom FROM baseline WHERE featuretyp = '" + id + "' AND firstdispl <= " + year + " AND lastdispla >= " + year + " UNION SELECT geom FROM basepoly WHERE featuretyp = '" + id + "' AND firstdispl <= " + year + " AND lastdispla >= " + year + " UNION SELECT geom FROM basepoint WHERE featuretyp = '" + id + "' AND firstdispl <= " + year + " AND lastdispla >= " + year + " ) AS q", req );
	
	postgeo.query( q, "geojson", function( data ){
		res.send( data );
	});
}
