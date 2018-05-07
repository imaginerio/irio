--
-- PostgreSQL database dump
--

-- Dumped from database version 9.6.6
-- Dumped by pg_dump version 9.6.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


--
-- Name: postgis; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA public;


--
-- Name: EXTENSION postgis; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION postgis IS 'PostGIS geometry, geography, and raster spatial types and functions';


SET search_path = public, pg_catalog;

--
-- Name: baseline_gid_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE baseline_gid_seq
    START WITH 691964
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: baseline; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE baseline (
    gid integer DEFAULT nextval('baseline_gid_seq'::regclass) NOT NULL,
    namecomple character varying(50),
    featuretyp character varying(50),
    nameshort character varying(50),
    yearfirstd smallint,
    yearlastdo smallint,
    firstdispl smallint,
    lastdispla smallint,
    source character varying(50),
    folder character varying(50),
    geodatabas character varying(50),
    layer character varying(50),
    tablename character varying(50),
    globalid character varying(50) NOT NULL,
    geom geometry,
    uploaddate integer,
    notes character varying(255),
    nameabbrev character varying(50),
    creator text,
    firstowner text,
    owner text,
    occupant text,
    address text,
    scalerank smallint,
    stylename character varying(50)
);


--
-- Name: baseline_dev; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE baseline_dev (
    gid integer DEFAULT nextval('baseline_gid_seq'::regclass) NOT NULL,
    namecomple character varying(50),
    featuretyp character varying(50),
    nameshort character varying(50),
    yearfirstd smallint,
    yearlastdo smallint,
    firstdispl smallint,
    lastdispla smallint,
    source character varying(50),
    folder character varying(50),
    geodatabas character varying(50),
    layer character varying(50),
    tablename character varying(50),
    globalid character varying(50) NOT NULL,
    geom geometry,
    uploaddate integer,
    notes character varying(255),
    nameabbrev character varying(50),
    creator text,
    firstowner text,
    owner text,
    occupant text,
    address text,
    scalerank smallint,
    stylename character varying(50)
);


--
-- Name: basepoint_gid_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE basepoint_gid_seq
    START WITH 17454
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: basepoint; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE basepoint (
    gid integer DEFAULT nextval('basepoint_gid_seq'::regclass) NOT NULL,
    namecomple character varying(50),
    nameshort character varying(50),
    yearfirstd smallint,
    yearlastdo smallint,
    firstdispl smallint,
    lastdispla smallint,
    source character varying(50),
    folder character varying(50),
    geodatabas character varying(50),
    layer character varying(50),
    featuretyp character varying(50),
    globalid character varying(50) NOT NULL,
    tablename character varying(50),
    geom geometry,
    uploaddate integer,
    notes character varying(255),
    nameabbrev character varying(50),
    creator text,
    firstowner text,
    owner text,
    occupant text,
    address text,
    scalerank smallint,
    stylename character varying(50)
);


--
-- Name: basepoint_dev; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE basepoint_dev (
    gid integer DEFAULT nextval('basepoint_gid_seq'::regclass) NOT NULL,
    namecomple character varying(50),
    nameshort character varying(50),
    yearfirstd smallint,
    yearlastdo smallint,
    firstdispl smallint,
    lastdispla smallint,
    source character varying(50),
    folder character varying(50),
    geodatabas character varying(50),
    layer character varying(50),
    featuretyp character varying(50),
    globalid character varying(50) NOT NULL,
    tablename character varying(50),
    geom geometry,
    uploaddate integer,
    notes character varying(255),
    nameabbrev character varying(50),
    creator text,
    firstowner text,
    owner text,
    occupant text,
    address text,
    scalerank smallint,
    stylename character varying(50)
);


--
-- Name: basepoly_gid_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE basepoly_gid_seq
    START WITH 410833
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: basepoly; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE basepoly (
    gid integer DEFAULT nextval('basepoly_gid_seq'::regclass) NOT NULL,
    featuretyp character varying(50),
    namecomple character varying(100),
    nameshort character varying(100),
    yearfirstd smallint,
    yearlastdo smallint,
    firstdispl smallint,
    lastdispla smallint,
    layer character varying(50),
    tablename character varying(50),
    globalid character varying(50) NOT NULL,
    geom geometry,
    uploaddate integer,
    notes character varying(255),
    nameabbrev character varying(50),
    creator text,
    firstowner text,
    owner text,
    occupant text,
    address text,
    scalerank smallint,
    stylename character varying(100)
);


--
-- Name: basepoly_dev; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE basepoly_dev (
    gid integer DEFAULT nextval('basepoly_gid_seq'::regclass) NOT NULL,
    featuretyp character varying(50),
    namecomple character varying(100),
    nameshort character varying(100),
    yearfirstd smallint,
    yearlastdo smallint,
    firstdispl smallint,
    lastdispla smallint,
    layer character varying(50),
    tablename character varying(50),
    globalid character varying(50) NOT NULL,
    geom geometry,
    uploaddate integer,
    notes character varying(255),
    nameabbrev character varying(50),
    creator text,
    firstowner text,
    owner text,
    occupant text,
    address text,
    scalerank smallint,
    stylename character varying(100)
);


--
-- Name: cache; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE cache (
    id integer NOT NULL,
    year smallint,
    layer character varying(255),
    z smallint,
    x integer,
    y integer
);


--
-- Name: cache_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE cache_id_seq
    START WITH 3279920
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: cache_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE cache_id_seq OWNED BY cache.id;


--
-- Name: details; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE details (
    creator character varying(150),
    firstowner character varying(50),
    owner character varying(255),
    occupant character varying(150),
    routename character varying(50),
    nameabbrev character varying(50),
    globalid character varying(50) NOT NULL
);


--
-- Name: layers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE layers (
    sort character varying(255),
    folder character varying(255),
    layer character varying(255),
    featuretyp character varying(255),
    stylename character varying(255)
);


--
-- Name: layers_dev; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE layers_dev (
    sort character varying(255),
    folder character varying(255),
    layer character varying(255),
    featuretyp character varying(255),
    stylename character varying(255)
);


--
-- Name: legend_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE legend_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: legend; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE legend (
    id integer DEFAULT nextval('legend_id_seq'::regclass) NOT NULL,
    layername character varying(255),
    stylename character varying(255),
    fill character varying(255),
    stroke character varying(255),
    shape character varying(255)
);


--
-- Name: legend_dev; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE legend_dev (
    id integer DEFAULT nextval('legend_id_seq'::regclass) NOT NULL,
    layername character varying(255),
    stylename character varying(255),
    fill character varying(255),
    stroke character varying(255),
    shape character varying(255)
);


--
-- Name: visualpoly_gid_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE visualpoly_gid_seq
    START WITH 4883
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: mapsplans; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE mapsplans (
    gid integer DEFAULT nextval('visualpoly_gid_seq'::regclass) NOT NULL,
    layer character varying(50),
    globalid character varying(50) NOT NULL,
    creator character varying(100),
    repository character varying(100),
    firstdispl smallint,
    lastdispla smallint,
    imageid character varying(50),
    geom geometry,
    uploaddate integer,
    latitude double precision,
    longitude double precision,
    notes text,
    title text
);


--
-- Name: mapsplans_dev; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE mapsplans_dev (
    gid integer DEFAULT nextval('visualpoly_gid_seq'::regclass) NOT NULL,
    layer character varying(50),
    globalid character varying(50) NOT NULL,
    creator character varying(100),
    repository character varying(100),
    firstdispl smallint,
    lastdispla smallint,
    imageid character varying(50),
    geom geometry,
    uploaddate integer,
    latitude double precision,
    longitude double precision,
    notes text,
    title text
);


--
-- Name: names; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE names (
    text character varying(50),
    name_en character varying(255),
    layer character varying(255),
    name_pr character varying
);


--
-- Name: names_dev; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE names_dev (
    text character varying(50),
    name_en character varying(255),
    layer character varying(255),
    name_pr character varying
);


--
-- Name: plannedline_gid_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE plannedline_gid_seq
    START WITH 2863
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: plannedline; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE plannedline (
    gid integer DEFAULT nextval('plannedline_gid_seq'::regclass),
    featuretyp character varying(254),
    planyear character varying(50),
    firstdispl integer,
    lastdispla integer,
    planname text,
    nameshort character varying(50),
    namecomple character varying(50),
    layer character varying(50),
    geom geometry,
    uploaddate integer,
    globalid character varying(50)
);


--
-- Name: plannedline_dev; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE plannedline_dev (
    gid integer DEFAULT nextval('plannedline_gid_seq'::regclass),
    featuretyp character varying(254),
    planyear character varying(50),
    firstdispl integer,
    lastdispla integer,
    planname text,
    nameshort character varying(50),
    namecomple character varying(50),
    layer character varying(50),
    geom geometry,
    uploaddate integer,
    globalid character varying(50)
);


--
-- Name: plannedpoly_gid_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE plannedpoly_gid_seq
    START WITH 296
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: plannedpoly; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE plannedpoly (
    gid integer DEFAULT nextval('plannedpoly_gid_seq'::regclass) NOT NULL,
    planyear character varying(50),
    planname text,
    featuretyp character varying(50),
    layer character varying(50),
    namecomple character varying(50),
    nameshort character varying(50),
    globalid character varying(50),
    geom geometry,
    firstdispl integer,
    lastdispla integer,
    uploaddate integer
);


--
-- Name: plannedpoly_dev; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE plannedpoly_dev (
    gid integer DEFAULT nextval('plannedpoly_gid_seq'::regclass) NOT NULL,
    planyear character varying(50),
    planname text,
    featuretyp character varying(50),
    layer character varying(50),
    namecomple character varying(50),
    nameshort character varying(50),
    globalid character varying(50),
    geom geometry,
    firstdispl integer,
    lastdispla integer,
    uploaddate integer
);


--
-- Name: uploads; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE uploads (
    uploaddate integer NOT NULL
);


--
-- Name: viewsheds; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE viewsheds (
    gid integer DEFAULT nextval('visualpoly_gid_seq'::regclass) NOT NULL,
    layer character varying(50),
    globalid character varying(50) NOT NULL,
    creator character varying(100),
    repository character varying(100),
    firstdispl smallint,
    lastdispla smallint,
    imageviewd character varying(200),
    imageid character varying(50),
    geom geometry,
    uploaddate integer,
    latitude double precision,
    longitude double precision,
    notes text,
    title text
);


--
-- Name: viewsheds_dev; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE viewsheds_dev (
    gid integer DEFAULT nextval('visualpoly_gid_seq'::regclass) NOT NULL,
    layer character varying(50),
    globalid character varying(50) NOT NULL,
    creator character varying(100),
    repository character varying(100),
    firstdispl smallint,
    lastdispla smallint,
    imageviewd character varying(200),
    imageid character varying(50),
    geom geometry,
    uploaddate integer,
    latitude double precision,
    longitude double precision,
    notes text,
    title text
);


--
-- Name: cache id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY cache ALTER COLUMN id SET DEFAULT nextval('cache_id_seq'::regclass);


--
-- Name: baseline_dev baseline_dev_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY baseline_dev
    ADD CONSTRAINT baseline_dev_pkey PRIMARY KEY (gid, globalid);


--
-- Name: baseline baseline_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY baseline
    ADD CONSTRAINT baseline_pkey PRIMARY KEY (gid, globalid);


--
-- Name: basepoint_dev basepoint_dev_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY basepoint_dev
    ADD CONSTRAINT basepoint_dev_pkey PRIMARY KEY (gid, globalid);


--
-- Name: basepoint basepoint_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY basepoint
    ADD CONSTRAINT basepoint_pkey PRIMARY KEY (gid, globalid);


--
-- Name: basepoly_dev basepoly_dev_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY basepoly_dev
    ADD CONSTRAINT basepoly_dev_pkey PRIMARY KEY (gid, globalid);


--
-- Name: basepoly basepoly_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY basepoly
    ADD CONSTRAINT basepoly_pkey PRIMARY KEY (gid, globalid);


--
-- Name: cache cache_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY cache
    ADD CONSTRAINT cache_pkey PRIMARY KEY (id);


--
-- Name: details details_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY details
    ADD CONSTRAINT details_pkey PRIMARY KEY (globalid);


--
-- Name: legend_dev legend_dev_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY legend_dev
    ADD CONSTRAINT legend_dev_pkey PRIMARY KEY (id);


--
-- Name: legend legend_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY legend
    ADD CONSTRAINT legend_pkey PRIMARY KEY (id);


--
-- Name: mapsplans_dev mapsplans_dev_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY mapsplans_dev
    ADD CONSTRAINT mapsplans_dev_pkey PRIMARY KEY (gid, globalid);


--
-- Name: mapsplans mapsplans_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY mapsplans
    ADD CONSTRAINT mapsplans_pkey PRIMARY KEY (gid, globalid);


--
-- Name: plannedpoly_dev plannedpoly_dev_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY plannedpoly_dev
    ADD CONSTRAINT plannedpoly_dev_pkey PRIMARY KEY (gid);


--
-- Name: plannedpoly plannedpoly_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY plannedpoly
    ADD CONSTRAINT plannedpoly_pkey PRIMARY KEY (gid);


--
-- Name: uploads uploads_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY uploads
    ADD CONSTRAINT uploads_pkey PRIMARY KEY (uploaddate);


--
-- Name: viewsheds_dev viewsheds_dev_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY viewsheds_dev
    ADD CONSTRAINT viewsheds_dev_pkey PRIMARY KEY (gid, globalid);


--
-- Name: viewsheds viewsheds_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY viewsheds
    ADD CONSTRAINT viewsheds_pkey PRIMARY KEY (gid, globalid);


--
-- Name: png; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX png ON cache USING btree (year, layer, z, x, y);


--
-- PostgreSQL database dump complete
--

