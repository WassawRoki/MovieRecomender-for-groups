const mysql = require("mysql");

const host = "localhost";
const user = "root";
const password = "";

//returns recommended movies from specific session
async function SQLMovieCollector(sessionId) {
  let db = mysql.createConnection({
    host: `${host}`,
    user: `${user}`,
    password: `${password}`,
    database: sessionId,
  });
  const response = await new Promise(async (resolve) => {
    db.query(
      "SELECT * FROM `movies` WHERE `IMDB_TITLE_ID` IS NOT NULL",
      function (err, result) {
        if (err) throw err;
        resolve(result);
      }
    );
  });
  db.end();
  return response;
}

// creates session database from sessionId
async function dbCreator(sessionId) {
  let db = mysql.createConnection({
    host: `${host}`,
    user: `${user}`,
    password: `${password}`,
  });
  return new Promise((resolve, reject) => {
    db.connect(function (err) {
      if (err) throw err;
      db.query(`CREATE DATABASE ${sessionId};`, function (err, result) {
        if (err) throw err;
        resolve(result);
      });
    });
  });
}

// Creates user table for specific session database
async function sessionLayoutCreator(sessionId) {
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
        `CREATE TABLE users ( 
                    username varchar(30) NOT NULL,
                    isHost int(1) NOT NULL,
                    includeSelectedMovies int(1) NOT NULL,
                    movieSelect varchar(300) NOT NULL)
                    ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,
        function (err, result) {
          if (err) throw err;
          resolve(result);
        }
      );
    });
  });
}

//inserts user information into user table for user's session
function sessionPopulator(receivedUser) {
  let db = mysql.createConnection({
    host: `${host}`,
    user: `${user}`,
    password: `${password}`,
    database: receivedUser.sessionId,
    multipleStatements: true,
  });
  return new Promise((resolve, reject) => {
    db.connect(function (err) {
      if (err) throw err;
      db.query(
        `INSERT INTO users (username, isHost, includeSelectedMovies, movieSelect) VALUES ("${receivedUser.name}", ${receivedUser.isHost}, ${receivedUser.includeSelectedMovies}, "${receivedUser.selectedMovies}");`,
        function (err, result) {
          if (err) throw err;
          resolve(result);
        }
      );
    });
  });
}

//creates constraints table and inserts constraints
async function sessionConstraintCreator(
  sessionId,
  actors,
  genre,
  directors,
  earliestYear,
  latestYear,
  lowestRating
) {
  let db = mysql.createConnection({
    host: `${host}`,
    user: `${user}`,
    password: `${password}`,
    database: sessionId,
    multipleStatements: true,
  });
  return new Promise((resolve) => {
    db.connect(function (err) {
      if (err) throw err;
      db.query(
        `CREATE TABLE constraints ( 
                ACTORS varchar(300) NOT NULL,
                DIRECTOR varchar(300) NOT NULL,
                GENRE varchar(150) NOT NULL, 
                startYear int(4) NOT NULL, 
                endYear int(4) NOT NULL, 
                RATING int(2) NOT NULL ) 
                ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
            INSERT INTO constraints (ACTORS, DIRECTOR, GENRE, startYear, endYear,RATING ) VALUES ("${actors}","${directors}","${genre}",${earliestYear},${latestYear},${lowestRating});`,
        function (err, result) {
          if (err) throw err;
          resolve(result);
        }
      );
    });
  });
}

function sessionSetupDeletionTime(sessionId, deletionTime) {
  let dateTime = addDeletionTimeToCurrentTime(deletionTime);
  return new Promise((resolve, reject) => {
    let db = mysql.createConnection({
      host: `${host}`,
      user: `${user}`,
      password: `${password}`,
      database: sessionId,
    });
    db.connect(function (err) {
      if (err) throw err;
      db.query(
        `CREATE EVENT cleanup ON SCHEDULE AT '${dateTime}' ON COMPLETION NOT PRESERVE ENABLE DO DROP DATABASE ${sessionId};`,
        function (err, result) {
          if (err) throw err;
          console.log(`DB Deletion time: ${dateTime}`);
          resolve(result);
        }
      );
    });
  });
}

async function movieAvailabilityChecker(movieArray, searchResult, i) {
  let db = mysql.createConnection({
    host: `${host}`,
    user: `${user}`,
    password: `${password}`,
    database: "p2_db",
  });
  try {
    return new Promise((resolve) => {
      db.connect((error) => {
        if (error) throw error;
        if (movieArray[i] === "") {
          searchResult[i] = movieArray[i];
          resolve(searchResult);
        } else {
          db.query(
            `SELECT IMDB_TITLE_ID
                        FROM movie_db
                        WHERE ORIGINAL_TITLE= "${movieArray[i]}";`,
            (error, result) => {
              //if no movie was selected, the movie will be '0'
              if (result[0] == undefined) searchResult[i] = "0";
              else searchResult[i] = result[0].IMDB_TITLE_ID;
              resolve(searchResult);
            }
          );
        }
      });
    });
  } catch (error) {
    console.log(error);
  }
}

function addDeletionTimeToCurrentTime(deletionTime) {
  deletionTime *= 60; // Convert delete time to seconds

  let secondsPrDay = 86400;
  let secondsPrHour = 3600;
  let secondsPrMinute = 60;
  let daysToAdd = 0;
  let hoursToAdd = 0;
  let minutesToAdd = 0;

  // Get current time
  let date = new Date();

  seconds = date.getSeconds();
  minutes = date.getMinutes();
  hours = date.getHours();
  days = date.getDate();
  months = date.getMonth() + 1; // getMonth is 0-indexed, so we add 1 to get the correct month
  years = date.getFullYear();

  // Convert delete time from minutes to days, hours and minutes
  if (deletionTime > secondsPrDay) {
    daysToAdd = Math.floor(deletionTime / secondsPrDay);
    deletionTime = deletionTime % secondsPrDay;
  }
  if (deletionTime > secondsPrHour) {
    hoursToAdd = Math.floor(deletionTime / secondsPrHour);
    deletionTime = deletionTime % secondsPrHour;
  }
  if (deletionTime > secondsPrMinute) {
    minutesToAdd = Math.floor(deletionTime / secondsPrMinute);
  }

  // Add delete time to current time
  minutes = minutes + daysToAdd;
  hours = hours + hoursToAdd;
  days = days + daysToAdd;

  // Maintain date and time properties (so that 23:30 + 1 becomes 00:30 and not 24:30 for example)
  if (minutes >= 60) {
    hoursToAdd = Math.round(minutes / 60);
    minutes = minutes % 60;
    minutes = minutes < 0 ? 60 + minutes : +minutes;
    hours += hoursToAdd;
  }
  if (hours >= 24) {
    daysToAdd = Math.round(hours / 24);
    hours = hours % 24;
    hours = hours < 0 ? 24 + hours : +hours;
    days += daysToAdd;
  }
  if (days >= 28) {
    let monthsToAdd = Math.round(days / 28);
    days = days % 28;
    days = days < 0 ? 28 + days : +days;
    months += monthsToAdd;
  }
  if (months >= 12) {
    let yearsToAdd = Math.round(months / 12);
    months = months % 12;
    months = months < 0 ? 12 + months : +months;
    years += yearsToAdd;
  }

  // Make sure that 1 hour is written as 01 hour and so on.
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  if (hours < 10) {
    hours = "0" + hours;
  }
  if (days < 10) {
    days = "0" + days;
  }
  if (months < 10) {
    months = "0" + months;
  }

  // Setup correct date/time syntax
  let newTime = hours + ":" + minutes + ":" + seconds;
  let newDate = years + "-" + months + "-" + days;
  let dateTime = newDate + " " + newTime;

  return dateTime;
}

// Modules that are exported
module.exports = {
  SQLMovieCollector,
  sessionPopulator,
  dbCreator,
  sessionLayoutCreator,
  sessionConstraintCreator,
  sessionSetupDeletionTime,
  movieAvailabilityChecker,
};
