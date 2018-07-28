-- Paste the following into PG terminal to create and populate tables

-- Create players table
CREATE TABLE players (
  user_id          SERIAL PRIMARY KEY,
  username         VARCHAR(255) NOT NULL UNIQUE,
  hash             VARCHAR(255),
  google_id        VARCHAR(255),
  wins             INTEGER NOT NULL,
  losses           INTEGER NOT NULL,
  games_played     INTEGER NOT NULL,
  goals_made        INTEGER NOT NULL, 
  CHECK ((wins + losses) = games_played)
);

-- Add sample player data
INSERT INTO players (username, hash, wins, losses, games_played, goals_made) VALUES
    ('good kitty', NULL, NULL, 5, 0, 5, 40),
    ('bad kitty', NULL, NULL,, 5, 0, 5, 10),
    ('fat kitty', NULL, NULL,, 5, 0, 5, 20),
    ('crass kitty', NULL, NULL,, 5, 0, 5, 15),
    ('meow kitty', NULL, NULL,, 5, 0, 5, 13),
    ('fuzzy kitty', NULL, NULL,, 0, 5, 5, 5),
    ('bald kitty', NULL, NULL,, 0, 5, 5, 20),
    ('dirty kitty', NULL, NULL,, 0, 5, 5, 30),
    ('smelly kitty', NULL, NULL,, 0, 3, 3, 10),
    ('sucky kitty', NULL, NULL,, 0, 3, 3, 0);



-- Create users table
CREATE TABLE games ( 
    game_id                SERIAL PRIMARY KEY,
    team_one_one           INTEGER REFERENCES players(user_id) NULL,
    team_one_two           INTEGER REFERENCES players(user_id) NULL,
    team_one_three         INTEGER REFERENCES players(user_id) NULL,
    team_one_four          INTEGER REFERENCES players(user_id) NULL,
    team_one_five          INTEGER REFERENCES players(user_id) NULL,
    team_two_one           INTEGER REFERENCES players(user_id) NULL,
    team_two_two           INTEGER REFERENCES players(user_id) NULL,
    team_two_three         INTEGER REFERENCES players(user_id) NULL,
    team_two_four          INTEGER REFERENCES players(user_id) NULL,
    team_two_five          INTEGER REFERENCES players(user_id) NULL,
    team_one_score         INTEGER NOT NULL,
    team_two_score         INTEGER NOT NULL,
    team_one_one_score     INTEGER NOT NULL,
    team_one_two_score     INTEGER NOT NULL,
    team_one_three_score   INTEGER NOT NULL,
    team_one_four_score    INTEGER NOT NULL,
    team_one_five_score    INTEGER NOT NULL,
    team_two_one_score     INTEGER NOT NULL,
    team_two_two_score     INTEGER NOT NULL,
    team_two_three_score   INTEGER NOT NULL,
    team_two_four_score    INTEGER NOT NULL,
    team_two_five_score    INTEGER NOT NULL,
    winning_team           VARCHAR(255) NOT NULL,
    losing_team            VARCHAR(255) NOT NULL,
    cat_of_the_game        INTEGER REFERENCES players(user_id)
);

-- Add sample game data
INSERT INTO games (
    team_one_one, team_one_two, team_one_three, team_one_four, team_one_five,
    team_two_one, team_two_two, team_two_three, team_two_four, team_two_five,
    team_one_score, team_two_score, 
    team_one_one_score, team_one_two_score, team_one_three_score, team_one_four_score, team_one_five_score,    
    team_two_one_score, team_two_two_score, team_two_three_score, team_two_four_score, team_two_five_score,
    winning_team, losing_team, cat_of_the_game) 
    VALUES
    (1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 50, 30, 10, 10, 10, 10, 10, 6, 6, 6, 6, 6, 'team_one', 'team_two', 1),
    (1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 50, 30, 50, 0, 0, 0, 0, 30, 0, 0, 0, 0, 'team_one', 'team_two', 1),
    (1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 50, 30, 10, 10, 10, 10, 10, 6, 6, 6, 6, 6, 'team_one', 'team_two', 1),
    (1, 2, 3, 4, 5, 6, 7, 8, NULL, NULL, 50, 30, 20, 20, 10, 0, 0, 20, 10, 0, 0, 0, 'team_one', 'team_two', 1),
    (1, 2, 3, 4, 5, 6, 7, 8, NULL, NULL, 50, 30, 50, 0, 0, 0, 0, 15, 15, 0, 0, 0, 'team_one', 'team_two', 1);

-- Create sessions table
CREATE TABLE sessions ( 
    session_id             SERIAL PRIMARY KEY,
    session                VARCHAR(255) NOT NULL,
    user_id                INTEGER REFERENCES players(user_id) NULL,
    username               VARCHAR(255) NOT NULL
);

