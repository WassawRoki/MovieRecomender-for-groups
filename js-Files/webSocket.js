const database = require("./database");

let preSessionUserArray = [];
let sessionArray = [];

let queueOfUsersTryingToProceed = [];
let globalUserId = 0; // This "id" is a unique identifier for each user, and increments every time a new user joins

// For saving user information while they switch socket
let currentlySavedUserId = null;
let currentlySavedSessionId = "";
let currentlySavedusername = "";

const userObject = {
  isHost: false,
  userId: null,
  sessionId: "", // It is convenient being able to identify to which session a given user belongs to
  name: "",
  socket: "",
  currentPage: "",
  selectedMovies: [],
  includeSelectedMovies: false,
};

const sessionObject = {
  sessionId: "",
  userArray: [],
  nameArray: [],
};

// Calls the appropriate function for the current page
function updateOnOpen(currentPage, webSocket) {
  let user = findUserInSessionArrayFromUserId(currentlySavedUserId);
  if (user === undefined) {
    user = findUserInPreSessionArrayFromId(currentlySavedUserId);
  }
  let session = findSessionFromSessionId(user.sessionId);
  user.socket = webSocket;
  user.currentPage = currentPage;
  resetCurrentlySavedInfo(); // Reset saved info after all info has been used
  if (
    currentPage === "waitingRoomSessionJoin" ||
    currentPage === "waitingRoomMovieSelect"
  ) {
    updateBrowserDisplay(session, currentPage, user);
  }
  if (currentPage === "waitingRoomMovieSelect") {
    database.sessionPopulator(user); // Post session user data
  }
}

// Create session and add it to session array
function createSession(sessionId) {
  let session = Object.create(sessionObject);
  session.sessionId = sessionId;
  (session.userArray = []),
    (session.nameArray = []),
    sessionArray.push(session);
}

// Create user and push them to session array if they are a host, and pre-session array otherwise
function createUser(currentPage, sessionId, isHost, webSocket) {
  let user = Object.create(userObject);
  user.userId = globalUserId;
  user.name = "User_" + user.userId.toString();
  user.socket = webSocket;
  user.currentPage = currentPage; // "currentPage" is either sessionStarter or sessionJoin at this point
  if (isHost) {
    // Hosts are pushed directly to the session array
    user.isHost = true;
    user.sessionId = sessionId;
    sessionArray[sessionArray.length - 1].userArray.push(user);
  } else {
    // Non-hosts are not linked to any specific session yet, and is therefore pushed to the pre-session user array
    user.isHost = false;
    preSessionUserArray.push(user);
  }
  globalUserId++;
}

//displays names of all users and who is host in specific session
function updateBrowserDisplay(session, currentPage, user) {
  displayUpdatedNames(session, currentPage);
  if (user.isHost) {
    user.socket.send(["isHost"].toString()); // Show start button if the user is the host
  }
}

function addAllUsersToQueue(webSocket) {
  let session = findSession(webSocket);
  let host = findUser(webSocket);
  session.userArray.forEach((user) => {
    queueOfUsersTryingToProceed.push(user.socket);
  });
  host.socket.send(["allUsersWereAddedToQueue"].toString());
}

function initializeDequeueing() {
  if (
    currentlySavedUserId === null &&
    currentlySavedusername === "" &&
    currentlySavedSessionId === "" &&
    queueOfUsersTryingToProceed.length > 0
  ) {
    let userSocket = queueOfUsersTryingToProceed.shift();
    userSocket.send(["firstInQueue"].toString());
  }
}

//Create and setup layout for database
async function createDatabase(sessionId) {
  await database
    .dbCreator(sessionId)
    .then(console.log(`\nDATABASE created: ${sessionId}`));
  await database.sessionLayoutCreator(sessionId);
}

// Save information before the client disconnects due to them proceeding to the next page, so that they can get it back when they connect again
function saveUserInfo(webSocket, username, sessionId) {
  let user = findUser(webSocket);
  currentlySavedUserId = parseInt(user.userId); // Convert to int for later comparison
  if (username === undefined) {
    // if username was parsed it is because the user changed name from User_n
    currentlySavedusername = user.name;
  } else currentlySavedusername = username;
  if (sessionId === undefined) {
    currentlySavedSessionId = user.sessionId;
  } else currentlySavedSessionId = sessionId;
  webSocket.send(["infoWasSaved"].toString());
}

function findUser(webSocket) {
  let user = findUserInSessionArrayFromSocket(webSocket); // Find user on the basis of the currently active websocket. Hosts are already in the session array.
  if (user === undefined) {
    user = findUserInPreSessionArrayFromSocket(webSocket); // For non-hosts, we look in the pre-session array
  }
  return user;
}

function findSession(webSocket) {
  let user = findUser(webSocket);
  let session = findSessionFromSessionId(currentlySavedSessionId);
  if (session === undefined) {
    // If user was not found the first time, it is because they closed the page  or returned to a previous page
    session = findSessionFromSessionId(user.sessionId);
    if (session === undefined) {
      throw new Error("The session you are searching for does not exist");
    }
  }
  return session;
}

function checkIfSessionExists(sessionId, webSocket) {
  let session = findSessionFromSessionId(sessionId);
  if (session !== undefined) {
    webSocket.send(["doesSessionExist", true, sessionId].toString());
  } else {
    webSocket.send(["doesSessionExist", false, sessionId].toString());
  }
}

// Assign username and session id to user and push user to session
function addUserToSessionArray(username, sessionId, userId) {
  console.log(username + " has connected!");
  let user = findUserInSessionArrayFromUserId(userId); // If the user is a host, they will already be in the session array
  if (user === undefined) {
    user = findUserInPreSessionArrayFromId(userId); // Otherwise, we look for them in the pre-session array
  }
  let session = findSessionFromSessionId(sessionId);
  user.name = username;
  if (user.isHost === false) {
    // Add non-hosts to the user array
    user.sessionId = sessionId;
    session.userArray.push(user);
    removeUserFromPreSessionUserArray(user.userId); // When users are added to the session array, there is no need to keep track of them in the pre-session user array
  }
}

function deleteUserAndUpdateHostAndDisplay(user, session) {
  let nameOfDisconnectedUser = user.name;
  let wasHost = user.isHost;
  let userIndex = session.userArray.indexOf(user);
  let currentPage = user.currentPage;
  session.userArray.splice(userIndex, 1); // Remove user from user array
  if (wasHost) {
    updateWhoIsHost(session);
  }
  if (
    currentPage == "waitingRoomMovieSelect" ||
    currentPage == "waitingRoomSessionJoin" ||
    currentPage == "movieSelect"
  ) {
    displayUpdatedNames(session, user.currentPage);
  }
  console.log(nameOfDisconnectedUser + " has disconnected");
  checkForConnectedClients(session);
}

function preSessionDeleteUser(user) {
  let nameOfDisconnectedUser = user.name;
  let userIndex = preSessionUserArray.indexOf(user);
  preSessionUserArray.splice(userIndex, 1); // Remove user from pre session user array
  console.log(nameOfDisconnectedUser + " has disconnected");
}

function findUserInPreSessionArrayFromId(userId) {
  if (typeof userId === "string") {
    // Convert to integer if necessary (as strings compared strictly with numbers will return false)
    userId = parseInt(userId);
  }
  let user = undefined;
  for (let i = 0; i < preSessionUserArray.length; i++) {
    if (preSessionUserArray[i].userId === userId) {
      user = preSessionUserArray[i];
    }
  }
  return user;
}

function findUserInPreSessionArrayFromSocket(socket) {
  let user = undefined;
  for (let i = 0; i < preSessionUserArray.length; i++) {
    if (preSessionUserArray[i].socket === socket) {
      user = preSessionUserArray[i];
    }
  }
  return user;
}

function findUserInSessionArrayFromUserId(userId) {
  if (typeof userId === "string") {
    // Convert to integer if necessary (as strings compared strictly with numbers will return false)
    userId = parseInt(userId);
  }
  let user = undefined;
  let stopLoop = false;
  for (let i = 0; i < sessionArray.length && stopLoop === false; i++) {
    // Run through entire session array
    for (let j = 0; j < sessionArray[i].userArray.length; j++) {
      // Run through the user array of each session
      if (sessionArray[i].userArray[j].userId === userId) {
        user = sessionArray[i].userArray[j];
        stopLoop = true;
        break;
      }
    }
  }
  return user;
}

function findUserInSessionArrayFromSocket(socket) {
  let user = undefined;
  let stopLoop = false;
  for (let i = 0; i < sessionArray.length && stopLoop === false; i++) {
    // Run through entire session array
    for (let j = 0; j < sessionArray[i].userArray.length; j++) {
      // Run through the user array of each session
      if (sessionArray[i].userArray[j].socket === socket) {
        user = sessionArray[i].userArray[j];
        stopLoop = true;
      }
    }
  }
  return user;
}

function findSessionFromSessionId(sessionId) {
  let session = undefined;
  for (let i = 0; i < sessionArray.length; i++) {
    if (sessionArray[i].sessionId === sessionId) {
      session = sessionArray[i];
      break;
    }
  }
  return session;
}

function removeUserFromPreSessionUserArray(userId) {
  for (let i = 0; i < preSessionUserArray.length; i++) {
    if (preSessionUserArray[i].userId === userId) {
      preSessionUserArray.splice(i, 1);
      break;
    }
  }
}

function addToQueue(webSocket) {
  queueOfUsersTryingToProceed.push(webSocket);
  initializeDequeueing();
}

function resetCurrentlySavedInfo() {
  currentlySavedUserId = null;
  currentlySavedusername = "";
  currentlySavedSessionId = "";
  initializeDequeueing();
}

// Set next user in array to host.
function updateWhoIsHost(session) {
  for (let i = 0; i <= session.userArray.length; i++) {
    if (session.userArray[i] !== undefined) {
      session.userArray[i].isHost = true;
      session.userArray[i].socket.send(["isHost"].toString()); // Send only to the specific client
      break;
    }
  }
}

// Update name array for the given session and send the new array to all users of that session -
function displayUpdatedNames(session, currentPage = "") {
  session.nameArray.length = 0; // Reset name array
  if (currentPage === "waitingRoomSessionJoin") {
    for (let i = 0; i < session.userArray.length; i++) {
      session.nameArray[i] = session.userArray[i].name;
    }

    session.userArray.forEach((user) => {
      user.socket.send(
        ["displayUpdatedNames", session.nameArray, session.sessionId].toString()
      );
    });
  } else if (currentPage === "waitingRoomMovieSelect") {
    for (let i = 0; i < session.userArray.length; i++) {
      if (session.userArray[i].currentPage == "waitingRoomMovieSelect") {
        session.nameArray[i] = session.userArray[i].name;
      }
    }
    let currentUsers = session.nameArray.length;
    let totalUsers = session.userArray.length;
    session.userArray.forEach((user) => {
      user.socket.send(
        ["displayRemainingUsers", currentUsers, totalUsers].toString()
      );
      user.socket.send(["displayUpdatedNames", session.nameArray].toString());
    });
  }
}

// Check whether there are any users left in the session. If there aren't, then check whether there are any sessions left at all.
function checkForConnectedClients(session) {
  if (session.userArray.length === 0) {
    // If there are no users left in the specific session => delete it from the session array
    let sessionIndex = sessionArray.indexOf(session);
    sessionArray.splice(sessionIndex, 1);
    if (sessionArray.length === 0) {
      // If there are no sessions left, that is, if every client has disconnected => Reset everything
      globalUserId = 0;
      currentlySavedUserId = null;
    }
    console.log("All clients have disconnected!");
  }
}

function resetOnClose(webSocket, currentPage) {
  let user = findUser(webSocket);
  if (currentlySavedUserId !== user.userId && user.sessionId === "") {
    // If user leaves before joining a session
    preSessionDeleteUser(user);
  } else {
    let session = findSession(webSocket);
    //If the currently saved id is not equal to the users id, that means the user disconnected because they closed the page
    if (currentlySavedUserId !== user.userId) {
      deleteUserAndUpdateHostAndDisplay(user, session);
    } else if (
      currentPage === "sessionJoin" ||
      currentPage === "sessionStarter"
    ) {
      addUserToSessionArray(
        currentlySavedusername,
        currentlySavedSessionId,
        currentlySavedUserId
      );
    } else if (currentPage === "waitingRoomMovieSelect") {
      resetCurrentlySavedInfo();
    }
  }
}

function includeSelectedMovies(includeSelectedMovies, webSocket) {
  let user = findUser(webSocket);
  if (includeSelectedMovies != "true") {
    user.includeSelectedMovies = false;
  } else {
    user.includeSelectedMovies = true;
  }
}

// checks all movies availability. If the inputted movies are valid, send user to next page
async function checkAllMoviesAvailability(movieString, webSocket) {
  let movieArray = movieString.split("|");
  let searchResult = [];

  return new Promise(async (resolve) => {
    for (let i = 0; i < movieArray.length; i++) {
      await database.movieAvailabilityChecker(movieArray, searchResult, i);
    }
    let user = findUserInSessionArrayFromSocket(webSocket);
    user.socket.send(["searchResult", searchResult].toString());
    if (
      !searchResult.includes("0") &&
      searchResult.find((movieId) => movieId.includes("tt"))
    ) {
      //all imdb id's starts with "tt"
      //if (all inputted movies are in database and at least one valid movie has been inputted)
      user.selectedMovies = searchResult;
      user.socket.send(["proceedToWaitingRoomMovieSelect"].toString());
    }
    resolve(searchResult); //this is not used
  });
}

module.exports = {
  updateOnOpen,
  createDatabase,
  saveUserInfo,
  resetOnClose,
  checkAllMoviesAvailability,
  findUser,
  createSession,
  createUser,
  addToQueue,
  addAllUsersToQueue,
  initializeDequeueing,
  includeSelectedMovies,
  checkIfSessionExists,
};
