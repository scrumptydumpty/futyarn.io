-- CREATE SCHEMA fyschme
-- Explicit schema not necessary since we only have single user (app server)
  
  DROP TABLE IF EXISTS players

  CREATE TABLE players (
      user_id      INTEGER AUTO_INCREMENT PRIMARY KEY,
      username     VARCHAR(255) NOT NULL UNIQUE,
      password     VARCHAR(255) NOT NULL,
      wins         INTEGER NOT NULL,
      losses       INTEGER NOT NULL,
      games_played INTEGER NOT NULL,
      goals        INTEGER NOT NULL, 
      CHECK ((wins + losses) = games_played)
  )
  
  DROP TABLE IF EXISTS games

  CREATE TABLE games ( 
      game_id            INTEGER AUTO_INCREMENT PRIMARY KEY,
      team_one_one       INTEGER REFERENCES players(user_id),
      team_one_two       INTEGER REFERENCES players(user_id),
      team_one_three     INTEGER REFERENCES players(user_id),
      team_one_four      INTEGER REFERENCES players(user_id),
      team_one_five      INTEGER REFERENCES players(user_id),
      team_two_one       INTEGER REFERENCES players(user_id),
      team_two_two       INTEGER REFERENCES players(user_id),
      team_two_three     INTEGER REFERENCES players(user_id),
      team_two_four      INTEGER REFERENCES players(user_id),
      team_two_five      INTEGER REFERENCES players(user_id),
      team_one_score     INTEGER NOT NULL,
      team_two_score     INTEGER NOT NULL,
      winning_team       VARCHAR(10) NOT NULL,
      losing team        VARCHAR(10) NOT NULL,
      cat_of_the_game    INTEGER REFERENCES players(user_id)
  )
