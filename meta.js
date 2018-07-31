var pg = require('pg'),
	_ = require('underscore'),
	db = require('./db'),
	dev = require('./dev');

_.mixin({
	// ### _.objMap
	// _.map for objects, keeps key/value associations
	objMap: function (input, mapper, context) {
		return _.reduce(input, function (obj, v, k) {
			obj[k] = mapper.call(context, v, k, input);
			return obj;
		}, {}, context);
	},
	// ### _.objFilter
	// _.filter for objects, keeps key/value associations
	// but only includes the properties that pass test().
	objFilter: function (input, test, context) {
		return _.reduce(input, function (obj, v, k) {
			if (test.call(context, v, k, input)) {
				obj[k] = v;
			}
			return obj;
		}, {}, context);
	}
});

exports.timeline = function (req, res) {
	var client = new pg.Client(db.conn);
	client.connect();

	var years = [],
		q = dev.checkQuery(
			`SELECT * FROM ( 
					SELECT firstdispl AS year FROM basepoint
					UNION SELECT lastdispla AS year FROM basepoint
					UNION SELECT firstdispl AS year FROM baseline
					UNION SELECT lastdispla AS year FROM baseline
					UNION SELECT firstdispl AS year FROM basepoly
					UNION SELECT lastdispla AS year FROM basepoly
					UNION SELECT firstdispl AS year FROM mapsplans
					UNION SELECT lastdispla AS year FROM mapsplans
					UNION SELECT firstdispl AS year FROM viewsheds
					UNION SELECT lastdispla AS year FROM viewsheds
				) as q
				ORDER BY year`, req);

	client.query(q, function (err, result) {
		years = _.map(result.rows, r => r.year);
		years.pop();
		res.send(years);
		client.end();
	});
}

exports.layers = function (req, res) {
	var client = new pg.Client(db.conn);
	client.connect();

	var year = req.params.year,
		arr = [],
		layers = {},
		q = dev.checkQuery(
			`SELECT
					folder,
					geo.layer,
					geo.featuretyp,
					geo.stylename,
					layername,
					fill,
					stroke,
					shape
				FROM (
					SELECT layer, featuretyp, stylename
					FROM baseline
					WHERE firstdispl <= $1 AND lastdispla >= $1
					GROUP BY layer, featuretyp, stylename
					UNION SELECT layer, featuretyp, stylename
					FROM basepoint
					WHERE firstdispl <= $1 AND lastdispla >= $1
					GROUP BY layer, featuretyp, stylename
					UNION SELECT layer, featuretyp, stylename
					FROM basepoly
					WHERE firstdispl <= $1 AND lastdispla >= $1
					GROUP BY layer, featuretyp, stylename 
				) AS geo
				INNER JOIN legend AS le
					ON geo.stylename = le.stylename
				INNER JOIN layers AS la
					ON geo.layer = la.layer AND geo.featuretyp = la.featuretyp
				WHERE geo.featuretyp IS NOT NULL
				ORDER BY sort`, req);

	client.query(q, [year], function (err, arr) {
		var styles = _.indexBy(arr.rows, 'stylename');
		var layers = _.objMap(_.groupBy(arr.rows, 'folder'), function (f) {
			return _.objMap(_.groupBy(f, 'layer'), function (l, name) {
				let layer = {};
				if (_.uniq(_.pluck(l, 'stylename')).length === 1) {
					layer.id = l[0].stylename;
					layer.features = _.pluck(l, 'featuretyp');
					layer.style = _.pick(l[0], 'fill', 'stroke', 'shape');
				} else {
					layer.features = {};
					_.each(l, function (f) {
						layer.features[f.featuretyp] = {
							id: f.stylename,
							style: _.pick(f, 'fill', 'stroke', 'shape')
						};
					});
				}
				return layer;
			});
		});

		res.send(layers);
		client.end();
	});
}

exports.raster = function (req, res) {
	var client = new pg.Client(db.conn);
	client.connect();

	var year = req.params.year,
		max = req.query.max || year,
		arr = [],
		q = dev.checkQuery(
			`SELECT
					imageid AS id,
					'SSID' || globalid AS file,
					firstdispl AS date,
					creator,
					title AS description,
					notes AS credits,
					layer,
					ST_AsText(ST_Envelope(geom)) AS bbox
				FROM mapsplans
				WHERE firstdispl <= $1 AND lastdispla >= $2
				UNION SELECT
					imageid AS id,
					'SSID' || globalid AS file,
					firstdispl AS date,
					creator,
					title AS description,
					notes AS credits,
					layer, ST_AsText(ST_Envelope(geom)) AS bbox
				FROM viewsheds
				WHERE firstdispl <= $1 AND lastdispla >= $2
				ORDER BY layer`, req);

	client.query(q, [max, year], function (err, arr) {
		res.send(arr.rows);
		client.end();
	});
}

exports.search = function (req, res) {
	var client = new pg.Client(db.conn);
	client.connect();

	var year = req.params.year,
		word = `%${req.params.word}%`,
		names = {},
		q = dev.checkQuery(
			`SELECT
					array_agg( id ) as gid,
					namecomple,
					array_agg( file ) AS file,
					layer,
					featuretyp
				FROM (
					SELECT
						globalid AS id,
						namecomple,
						NULL AS file,
						layer,
						featuretyp
					FROM basepoint
					WHERE namecomple ILIKE $1 AND firstdispl <= $2 AND lastdispla >= $2
					UNION SELECT
						globalid AS id,
						namecomple,
						NULL AS file,
						layer,
						featuretyp
					FROM baseline
					WHERE namecomple ILIKE $1 AND firstdispl <= $2 AND lastdispla >= $2
					UNION SELECT
						globalid AS id,
						namecomple,
						NULL AS file,
						layer,
						featuretyp
					FROM basepoly
					WHERE namecomple ILIKE $1 AND firstdispl <= $2 AND lastdispla >= $2
					UNION SELECT
						imageid AS ID,
						title AS namecomple,
						'SSID' || globalid AS file,
						layer,
						NULL AS featuretyp
					FROM viewsheds
					WHERE title ILIKE $1 AND firstdispl <= $2 AND lastdispla >= $2
					UNION SELECT
						imageid AS ID,
						title AS namecomple,
						'SSID' || globalid AS file,
						layer,
						NULL AS featuretyp
					FROM mapsplans
					WHERE title ILIKE $1 AND firstdispl <= $2 AND lastdispla >= $2
				) as q
				GROUP BY namecomple, layer, featuretyp
				ORDER BY layer, featuretyp`, req);

	client.query(q, [word, year], function (err, result) {
		_.each(result.rows, (r) => {
			names[r.namecomple] = { id: r.gid, layer: r.layer, featuretyp: r.featuretyp };
			if (r.file[0]) names[r.namecomple].file = r.file;
		});

		res.send(names);
		client.end();
	});
}

exports.plans = function (req, res) {
	var client = new pg.Client(db.conn);
	client.connect();

	var plans = [],
		q = dev.checkQuery("SELECT planyear, planname FROM plannedpoly UNION SELECT planyear, planname FROM plannedline ORDER BY planyear, planname", req);

	client.query(q, function (err, plans) {
		res.send(plans.rows);
		client.end();
	});
}

exports.details = function (req, res) {
	var client = new pg.Client(db.conn);
	client.connect();

	var id = _.reduce(req.params.id.split(","), function (memo, i) { return memo += "'" + i + "',"; }, "ANY(ARRAY[").replace(/,$/, "])"),
		details = [],
		q = dev.checkQuery(
			`SELECT creator, firstowner, owner, occupant, address, firstdispl, lastdispla, globalid
				FROM basepoint
				WHERE globalid = ${id}
				UNION SELECT creator, firstowner, owner, occupant, address, firstdispl, lastdispla, globalid
				FROM baseline
				WHERE globalid = ${id}
				UNION SELECT creator, firstowner, owner, occupant, address, firstdispl, lastdispla, globalid
				FROM basepoly
				WHERE globalid = ${id}`, req);

	client.query(q, function (err, result) {
		_.each(result.rows, function (r) {
			if (r.lastdispla == 8888) r.lastdispla = 'Present';
			r.year = r.firstdispl + " - " + r.lastdispla;
			r = _.objFilter(_.omit(r, ["globalid", "firstdispl", "lastdispla",]), function (value) {
				return value != null;
			});
			details.push(r);
		});

		res.send(details);
		client.end();
	});
}
exports.names = function (req, res) {
	var client = new pg.Client(db.conn);
	client.connect();

	var names = {},
		lang = req.params.lang,
		q = dev.checkQuery("SELECT LOWER( text ) AS text, name_en, name_pr FROM names", req);

	client.query(q, function (err, result) {
		_.each(result.rows, function (r) {
			names[r.text] = r["name_" + lang];
		});

		res.send(names);
		client.end();
	});
}

exports.collector = function (req, res) {
	var client = new pg.Client(db.conn);
	client.connect();

	var data = req.body;
	var geo = JSON.parse(data.polygon);
	var q = "INSERT INTO viewsheds_dev ( layer, globalid, creator, repository, firstdispl, lastdispla, imageid, title, geom, uploaddate, latitude, longitude ) VALUES ( 'viewsheds', " + data.id + ", '" + data.creator + "', '" + data.repository + "', " + data.firstdisplay + ", " + data.lastdisplay + ", '" + data.ssid + "', '" + data.title + "', ST_GeomFromGeoJSON('" + JSON.stringify(geo.geometry) + "'), 9999, " + data.lat + ", " + data.lon + ")";

	client.query(q);
	query.on('end', function () {
		res.status(200).send('Successfully added ' + data.id);
	});
	query.on('error', function (err) {
		res.status(500).send(err);
	});
}
