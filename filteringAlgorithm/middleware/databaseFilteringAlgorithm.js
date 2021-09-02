const mysql = require("mysql");

const host = "localhost";
const user = "root";
const password = "";
const p2_db = "p2_db";

async function getAllMovieData() {
  const db = mysql.createConnection({
    host: host,
    user: user,
    password: password,
    database: p2_db,
  });

  db.connect((err) => {
    if (err) {
      console.log(err.message);
    }
    console.log("db " + db.state);
  });

  try {
    const response = await new Promise((resolve, reject) => {
      db.query("SELECT * FROM movie_db", (err, result) => {
        if (err) {
          reject(new Error(err.message));
        }
        resolve(result);
      });
    });
    db.end();

    return response;
  } catch (error) {
    console.log(error);
  }
}

async function getAllUsersData(sessionId) {
  const db = mysql.createConnection({
    host: host,
    user: user,
    password: password,
    database: sessionId,
  });

  db.connect((err) => {
    if (err) {
      console.log(err.message);
    }
    console.log("db " + db.state);
  });

  try {
    const response = await new Promise((resolve, reject) => {
      db.query("SELECT * FROM `users`", (err, result) => {
        if (err) {
          reject(new Error(err.message));
        }
        resolve(result);
      });
    });
    db.end();

    return response;
  } catch (error) {
    console.log(error);
  }
}

async function getAllConstraints(sessionId) {
  const db = mysql.createConnection({
    host: host,
    user: user,
    password: password,
    database: sessionId,
  });

  db.connect((err) => {
    if (err) {
      console.log(err.message);
    }
    console.log("db " + db.state);
  });

  try {
    const response = await new Promise((resolve, reject) => {
      db.query("SELECT * FROM `constraints`", (err, result) => {
        if (err) {
          console.error;
        }
        resolve(result);
      });
    });
    db.end();
    if (response === undefined) {
      return [
        {
          ACTORS: "0",
          DIRECTOR: "0",
          GENRE: "0",
          startYear: 0,
          endYear: 0,
          RATING: 0,
          constraintsTrue: 1,
        },
      ];
    } else {
      return response;
    }
  } catch (error) {
    console.log(error);
  }
}

async function sessionLayoutCreator(sessionId, mysql) {
  let db = mysql.createConnection({
    host: `${host}`,
    user: `${user}`,
    password: `${password}`,
    database: sessionId,
    multipleStatements: true,
  });
  return new Promise((resolve, reject) => {
    db.connect(function (err) {
      if (err) throw err;
      db.query(
        `CREATE TABLE  movies ( 
                IMDB_TITLE_ID varchar(13) NULL,
                ORIGINAL_TITLE varchar(196) NULL,
                YEAR varchar(13) NULL,
				GENRE varchar(14) NULL,
				COUNTRY varchar(225) NULL,
				ACTORS varchar(415) NULL,
				IMDB_SCORE varchar(50) NULL,
				BORDA varchar(50) NULL, 
				SCORE varchar(50) NULL, 
				DESCRIPTION varchar(402) NULL,
				POSTER varchar(900) NULL)
                ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,
        function (err, result) {
          if (err) throw err;
          resolve(result);
        }
      );
    });
  });
}

async function populateMovieDB(
  sessionId,
  mysql,
  imdbId,
  title,
  year,
  genre,
  country,
  actors,
  imdb,
  borda,
  score,
  description,
  poster
) {
  let db = mysql.createConnection({
    host: `${host}`,
    user: `${user}`,
    password: `${password}`,
    database: sessionId,
    multipleStatements: true,
  });
  return new Promise((resolve, reject) => {
    db.connect(function (err) {
      if (err) throw err;
      db.query(
        `INSERT INTO movies(IMDB_TITLE_ID, ORIGINAL_TITLE, 
        YEAR, GENRE, COUNTRY, ACTORS, IMDB_SCORE, BORDA, 
        SCORE, DESCRIPTION, POSTER)
				VALUES ('${imdbId}',"${title}",'${year}','${genre}',
        '${country}',"${actors}",'${imdb}','${borda}',
        '${score}',"${description}",'${poster}')`,

        function (err, result) {
          if (err) throw err;
          resolve(result);
        }
      );
    });
  });
}
exports.getAllMovieData = getAllMovieData;
exports.getAllUsersData = getAllUsersData;
exports.getAllConstraints = getAllConstraints;
exports.sessionLayoutCreator = sessionLayoutCreator;
exports.populateMovieDB = populateMovieDB;
