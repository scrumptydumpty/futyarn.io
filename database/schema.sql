CREATE SCHEMA fyschme
  
  DROP TABLE IF EXISTS players
  CREATE TABLE players (
    userid INTEGER PRIMARY KEY,
    username VARCHAR(20),
    password VARCHAR(255),
    wins INTEGER,
    losses INTEGER,
    goals INTEGER,
    games_played INTEGER 
    )
  
  DROP TABLE IF EXISTS games
  CREATE TABLE games ( 
    game_id INTEGER AUTO_INCREMENT PRIMARY KEY ,
    win_team_one   INTEGER FOREIGN KEY REFERENCES players(userid),
    win_team_two   INTEGER FOREIGN KEY REFERENCES players(userid),
    win_team_three INTEGER FOREIGN KEY REFERENCES players(userid),
    win_team_four  INTEGER FOREIGN KEY REFERENCES players(userid),
    win_team_five  INTEGER FOREIGN KEY REFERENCES players(userid),
    lose_team_one   INTEGER FOREIGN KEY REFERENCES players(userid),
    lose_team_two   INTEGER FOREIGN KEY REFERENCES players(userid),
    lose_team_three INTEGER FOREIGN KEY REFERENCES players(userid),
    lose_team_four  INTEGER FOREIGN KEY REFERENCES players(userid),
    lose_team_five  INTEGER FOREIGN KEY REFERENCES players(userid),
    team_one_score INTEGER,
    team_two_score INTEGER
    cat_of_the_game INTEGER FOREIGN KEY REFERENCES players(userid)
    )
