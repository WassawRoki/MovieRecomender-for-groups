const { readFile } = require("fs");
const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const database = require("./js-Files/database");
const webSocketFile = require("./js-Files/webSocket");
const movieRecommendations = require("./js-Files/movieRecommendations.js");
const { runAlgorithm } = require("./filteringAlgorithm/filteringAlgorithm");

const PORT = 3000;
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public")); // Makes the "public" folder static

let currentlySavedSessionId = "";

server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server opened on: http://localhost:${PORT}\n`);
});

const webSocketServer = new WebSocket.Server({ server });

// Runs every time a new websocket connection is established, and then continues to listen for messages
webSocketServer.on("connection", (webSocket) => {
  //The variable "webSocket" will always be the currently connected websocket
  // Call the appropriate function when receiving messages
  webSocket.on("message", (message) => {
    /*converts received message string to array of individual messages, 
		where the first item is unique message identifier*/
    let messageArray = [];
    if (message.includes("checkMovieAvailabilty")) {
      messageArray = message.split("\\"); // We split on \ to avoid splitting up movie titles that include ","
    } else {
      messageArray = message.split(",");
    }
    switch (messageArray[0]) {
      case "addToQueue":
        webSocketFile.addToQueue(webSocket);
        break;
      case "checkIfSessionExists":
        webSocketFile.checkIfSessionExists(messageArray[1], webSocket);
        break;
      case "sessionStarter":
        webSocketFile.createSession(messageArray[1]);
        webSocketFile.createUser(
          messageArray[0],
          messageArray[1],
          true,
          webSocket
        );
        break;
      case "sessionJoin":
        webSocketFile.createUser(messageArray[0], undefined, false, webSocket);
        /*The session id is undefined at creation for non-hosts */ break;
      case "userWebsocketOpened":
        webSocketFile.updateOnOpen(messageArray[1], webSocket);
        break;
      case "createDatabase":
        webSocketFile.createDatabase(messageArray[1]);
        currentlySavedSessionId = messageArray[1];
        break;
      case "setupDeletionTime":
        setupDeletionTime(messageArray[2], webSocket);
        break;
      case "saveUserInfo":
        webSocketFile.saveUserInfo(webSocket, messageArray[1], messageArray[2]);
        break;
      case "addConstraints":
        addConstraintsToDatabase(
          webSocket,
          messageArray[1],
          messageArray[2],
          messageArray[3],
          messageArray[4],
          messageArray[5],
          messageArray[6]
        );
        break;
      case "initializeDequeueing":
        webSocketFile.initializeDequeueing();
        break;
      case "runAlgorithmAndProceed":
        runAlgorithmAndProceedToRecommendations();
        break;
      case "addAllUsersToQueue":
        webSocketFile.addAllUsersToQueue(webSocket);
        break;
      case "checkMovieAvailabilty":
        webSocketFile.checkAllMoviesAvailability(messageArray[1], webSocket);
        break;
      case "selectedMovies":
        webSocketFile.includeSelectedMovies(messageArray[1], webSocket);
        break;
      default:
        throw new Error("Message ID is not defined.");
    }
  });

  webSocket.on("close", () => {
    let user = webSocketFile.findUser(webSocket);
    if (user !== undefined) {
      webSocketFile.resetOnClose(webSocket, user.currentPage);
    }
  });
});

async function setupDeletionTime(sessionId, webSocket) {
  let databaseDeletionTime = 100;
  await database
    .sessionSetupDeletionTime(sessionId, databaseDeletionTime)
    .then(webSocket.send(["deletionTimeWasSet"].toString()));
}

async function addConstraintsToDatabase(
  webSocket,
  restrictedActors,
  restrictedGenres,
  restrictedDirectors,
  earliestYear,
  latestYear,
  lowestRating
) {
  //individual constraints are seperated by | in their respective constraint string.
  let restrictedActorsArray = restrictedActors.split("|");
  let restrictedGenresArray = restrictedGenres.split("|");
  let restrictedDirectorsArray = restrictedDirectors.split("|");
  await database.sessionConstraintCreator(
    currentlySavedSessionId,
    restrictedActorsArray,
    restrictedGenresArray,
    restrictedDirectorsArray,
    earliestYear,
    latestYear,
    lowestRating
  );
  webSocket.send(["constraintsWereAdded"].toString());
}

async function runAlgorithmAndProceedToRecommendations() {
  let movieScore = await runAlgorithm(currentlySavedSessionId);
  webSocketFile.initializeDequeueing();
  console.log(currentlySavedSessionId);
  for (let i = 0; i < 10; i++) {
    console.log(movieScore[i].movieTitle, movieScore[i].usersBordaScore);
  }
}

//the following code reads the html page corresponding to the specific get request.

app.get("", (request, response) => {
  readFile("public/HTML/main.html", "utf8", (err, html) => {
    if (err) {
      response.status(500).send("Error 500");
    }
    response.send(html);
  });
});

app.get("/help", (request, response) => {
  readFile("public/HTML/help.html", "utf8", (err, html) => {
    if (err) {
      response.status(500).send("Error 500");
    }
    response.send(html);
  });
});

app.get("/sessionJoin", (request, response) => {
  readFile("public/HTML/sessionJoin.html", "utf8", (err, html) => {
    if (err) {
      response.status(500).send("Error 500");
    }
    response.send(html);
  });
});

app.get("/sessionStarter", (request, response) => {
  readFile("public/HTML/sessionStarter.html", "utf8", (err, html) => {
    if (err) {
      response.status(500).send("Error 500");
    }
    response.send(html);
  });
});

app.get("/constraints", (request, response) => {
  readFile("public/HTML/constraints.html", "utf8", (err, html) => {
    if (err) {
      response.status(500).send("Error 500");
    }
    response.send(html);
  });
});

app.get("/waitingRoomSessionJoin", (request, response) => {
  readFile("public/HTML/waitingRoomSessionJoin.html", "utf8", (err, html) => {
    if (err) {
      response.status(500).send("Error 500");
    }
    response.send(html);
  });
});

app.get("/movieSelect", (request, response) => {
  readFile("public/HTML/movieSelect.html", "utf8", (err, html) => {
    if (err) {
      response.status(500).send("Error 500");
    }
    response.send(html);
  });
});

app.get("/waitingRoomMovieSelect", (request, response) => {
  readFile("public/HTML/waitingRoomMovieSelect.html", "utf8", (err, html) => {
    if (err) {
      response.status(500).send("Error 500");
    }
    response.send(html);
  });
});

app.get(`/movieRecommendations`, async (req, res) => {
  readFile(
    "public/HTML/movieRecommendations.html",
    "utf8",
    async (err, html) => {
      if (err) {
        res.status(500).send("Error 500");
      }
      let finalHtml = await movieRecommendations.movieRecommendationsHtmlConstructor(
        html,
        currentlySavedSessionId
      );
      res.send(finalHtml);
    }
  );
});
