var url = require( 'url' );

module.exports.parseXYZ = function( req, TMS_SCHEME, callback )
{
	var matches = req.url.match( /(\d+)/g );
    if( matches && matches.length == 4 )
    {
		try
		{
			var x = parseInt( matches[ 2 ], 10 );
			var y = parseInt( matches[ 3 ], 10 );
			var z = parseInt( matches[ 1 ], 10 );
			var year = parseInt( matches[ 0 ], 10 );
            
            if( TMS_SCHEME ) y = ( Math.pow( 2, z ) - 1 ) - y;
            callback( null, { year : year, z : z, x : x, y : y } );
		}
		catch( err )
		{
			callback( err, null );
		}
	}
	else
	{
		try
		{
			var query = url.parse( req.url, true ).query;
			if( query && query.year !== undefined && query.x !== undefined && query.y !== undefined && query.z !== undefined )
			{
				try
				{
					callback( null, { year : parseInt( query.year, 10 ), z : parseInt( query.z, 10 ), x : parseInt( query.x, 10 ), y : parseInt( query.y, 10 ) } );
				}
				catch( err )
				{
					callback( err, null );
				}
			}
			else
			{
				callback( new Error( 'no x,y,z provided' ), null );
			}
		}
		catch( err )
		{
			callback(err, null);
		}
	}
};