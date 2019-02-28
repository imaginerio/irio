var express = require( 'express' ),
    path = require('path'),
	  bodyParser = require( 'body-parser' ),
	  http = require( 'http' ),
    meta = require( './meta' ),
    geo = require( './geo' ),
    download = require( './mapnik/export' ),
    tilelive = require( './mapnik/tilelive' );

const session = require('express-session');
const { ExpressOIDC } = require('@okta/oidc-middleware');

var app = express();

app.use(session({
  secret: 'beirut diverse levant',
  resave: true,
  saveUninitialized: false
}));

const oidc = new ExpressOIDC({
  issuer: 'https://dev-389509.oktapreview.com/oauth2/default',
  client_id: process.env.client_id,
  client_secret: process.env.client_secret,
  redirect_uri: `https://beirut.axismaps.io/authorization-code/callback`,
  scope: 'openid profile'
});

app.use(oidc.router);

app.use( function( req, res, next )
{

    // Website you wish to allow to connect
    res.setHeader( 'Access-Control-Allow-Origin', '*' );

    // Request methods you wish to allow
    //res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    //res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.use( function(err, req, res, next) {
  console.error(err.stack);
  next(err);
});

app.use( function(err, req, res, next) {
  if (req.xhr) {
    res.send(500, { error: 'Something blew up!' });
  } else {
    next(err);
  }
});

app.use( function(err, req, res, next) {
  res.status(500);
  res.send(err);
});

app.use(bodyParser.json());

app.use('/collector', oidc.ensureAuthenticated(), express.static(path.join(__dirname, 'collector')));

app.get( '/timeline', meta.timeline );
app.get( '/layers/:year', meta.layers );
app.get( '/search/:year/:word', meta.search );
app.get( '/probe/:year/:radius/:coords/:layers?', geo.probe );
app.get( '/draw/:year/:id', geo.draw );
app.get( '/visual/:year', geo.visual );
app.get( '/raster/:year', meta.raster );
app.get( '/plans/:year', meta.plans );
app.get( '/plan/:name', geo.plan );
app.get( '/details/:id', meta.details );
app.get( '/names/:lang', meta.names );
app.get( '/feature/:year/:id', geo.feature );
app.get( '/export/:lang/:year/:layer/:raster/:bounds/', download.exportMap );
app.get( '/tiles/:year/:layer/:z/:x/:y.*', tilelive.tiles );
app.get( '/raster/:id/:z/:x/:y.*', tilelive.raster );
app.post( '/memory', meta.memory );
app.post( '/collector', oidc.ensureAuthenticated(), meta.collector );

oidc.on('ready', () => {
  app.listen(8080, () => console.log(`Started!`));
});

oidc.on('error', err => {
  console.log('Unable to configure ExpressOIDC', err);
});
