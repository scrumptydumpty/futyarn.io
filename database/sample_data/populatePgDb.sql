-- Paste the following into PG terminal to create and populate tables

-- Create players table
CREATE TABLE players (
  user_id      SERIAL PRIMARY KEY,
  username     VARCHAR(255) NOT NULL UNIQUE,
  password     VARCHAR(255) NOT NULL,
  wins         INTEGER NOT NULL,
  losses       INTEGER NOT NULL,
  games_played INTEGER NOT NULL,
  goals_made        INTEGER NOT NULL, 
  CHECK ((wins + losses) = games_played)
);

-- Add sample player data
INSERT INTO players (username, password, wins, losses, games_played, goals_made) VALUES
    ('good kitty', 'password', 5, 0, 5, 40),
    ('bad kitty', 'password', 5, 0, 5, 10),
    ('fat kitty', 'password', 5, 0, 5, 20),
    ('crass kitty', 'password', 5, 0, 5, 15),
    ('meow kitty', 'password', 5, 0, 5, 13),
    ('fuzzy kitty', 'password', 0, 5, 5, 5),
    ('bald kitty', 'password', 0, 5, 5, 20),
    ('dirty kitty', 'password', 0, 5, 5, 30),
    ('smelly kitty', 'password', 0, 3, 3, 10),
    ('sucky kitty', 'password', 0, 3, 3, 0);



-- Create users table
CREATE TABLE games ( 
    game_id            SERIAL PRIMARY KEY,
    team_one_one       INTEGER REFERENCES players(user_id) NULL,
    team_one_two       INTEGER REFERENCES players(user_id) NULL,
    team_one_three     INTEGER REFERENCES players(user_id) NULL,
    team_one_four      INTEGER REFERENCES players(user_id) NULL,
    team_one_five      INTEGER REFERENCES players(user_id) NULL,
    team_two_one       INTEGER REFERENCES players(user_id) NULL,
    team_two_two       INTEGER REFERENCES players(user_id) NULL,
    team_two_three     INTEGER REFERENCES players(user_id) NULL,
    team_two_four      INTEGER REFERENCES players(user_id) NULL,
    team_two_five      INTEGER REFERENCES players(user_id) NULL,
    team_one_score     INTEGER NOT NULL,
    team_two_score     INTEGER NOT NULL,
    winning_team       VARCHAR(255) NOT NULL,
    losing_team        VARCHAR(255) NOT NULL,
    cat_of_the_game    INTEGER REFERENCES players(user_id)
);

-- Add sample game data
INSERT INTO games (
    team_one_one, team_one_two, team_one_three, team_one_four, team_one_five,
    team_two_one, team_two_two, team_two_three, team_two_four, team_two_five,
    team_one_score, team_two_score, winning_team, losing_team, cat_of_the_game) 
    VALUES
    (1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 50, 30, 'team_one', 'team_two', 1),
    (1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 50, 30, 'team_one', 'team_two', 1),
    (1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 50, 30, 'team_one', 'team_two', 1),
    (1, 2, 3, 4, 5, 6, 7, 8, NULL, NULL, 50, 30, 'team_one', 'team_two', 1),
    (1, 2, 3, 4, 5, 6, 7, 8, NULL, NULL, 50, 30, 'team_one', 'team_two', 1);



