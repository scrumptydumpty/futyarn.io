-- CREATE SCHEMA fyschme
-- Explicit schema not necessary since we only have single user (app server)
-- Use the default Public shema

CREATE DATABASE futyarn.io;

USE futyarn.io;

-- DROP TABLE IF EXISTS players

-- Postgres uses SERIAL instead of AUTO_INCREMENT. If using SERIAL, do not have to use INTERGER.
-- PG does not need FOREIGN KEY property. Using REFERENCES is all that is required.
-- CHECK establishes a constraint. If condition not met, throws error.

CREATE TABLE players (
    user_id          SERIAL PRIMARY KEY,
    username         VARCHAR(255) NOT NULL UNIQUE,
    hash             VARCHAR(255), -- hash not required if doing google oauth
    google_id        VARCHAR(255) NULL,
    -- last_signed_in   DATETIME NOT NULL,  -- stretch feature: sign in time stamps
    wins             INTEGER NOT NULL,
    losses           INTEGER NOT NULL,
    games_played     INTEGER NOT NULL,
    goals_made       INTEGER NOT NULL, 
    CHECK ((wins + losses) = games_played)
);

-- DROP TABLE IF EXISTS games

CREATE TABLE games ( 
    game_id                SERIAL PRIMARY KEY,
    team_one_one           INTEGER REFERENCES players(user_id) NULL,
    team_one_two           INTEGER REFERENCES players(user_id) NULL,
    team_two_one           INTEGER REFERENCES players(user_id) NULL,
    team_two_two           INTEGER REFERENCES players(user_id) NULL,
    team_one_score         INTEGER NOT NULL,
    team_one_one_score     INTEGER NOT NULL,
    team_one_two_score     INTEGER NOT NULL,
    team_two_score         INTEGER NOT NULL,
    team_two_one_score     INTEGER NOT NULL,
    team_two_two_score     INTEGER NOT NULL,
    winning_team           VARCHAR(10) NOT NULL,
    losing_team            VARCHAR(10) NOT NULL,
    cat_of_the_game        INTEGER REFERENCES players(user_id)
);

CREATE TABLE sessions ( 
    session_id             SERIAL PRIMARY KEY,
    session                VARCHAR(255) NOT NULL,
    user_id                INTEGER REFERENCES players(user_id) NULL,
    username               VARCHAR(255) NOT NULL
);