webSocket = new WebSocket("ws://localhost:3000");

let clientIndex = null;

webSocket.addEventListener("message", (message) => {
  let messageContentArray = message.data.split(",");
  let messageID = messageContentArray.shift();
  let sessionId = messageContentArray.pop();
  let nameArray = [...messageContentArray];

  switch (messageID) {
    case "displayUpdatedNames":
      displayName(nameArray);
      displaySessionId(sessionId);
      break;
    case "isHost":
      displayHost();
      break;
    case "allUsersWereAddedToQueue":
      toMovieSelect();
      break;
    case "firstInQueue":
      webSocket.send(["saveUserInfo"].toString());
      break;
    case "infoWasSaved":
      window.location.href = "../movieSelect";
      break;
    default:
      console.log("Message ID is not defined.");
      break;
  }
});

function displayName(names) {
  let namesHTML = "";
  for (let i = 0; i < names.length; i++) {
    namesHTML += names[i] + " <br> ";
  }
  ReplaceContentInContainer("usernames", namesHTML);
}

function displaySessionId(sessionId) {
  ReplaceContentInContainer("waitingRoomSessionId", "ID: " + sessionId);
}

function displayHost() {
  let button = document.getElementById("startButton");
  button.style.visibility = "visible";
}

function toMovieSelect() {
  webSocket.send(["initializeDequeueing"].toString());
}

webSocket.addEventListener("open", () => {
  if (sessionStorage.getItem("waitingRoomSessionJoin") === null) {
    sessionStorage.setItem("waitingRoomSessionJoin", "notNull");
    console.log("We are connected!");
    webSocket.send(
      ["userWebsocketOpened", "waitingRoomSessionJoin"].toString()
    );
    let startButton = document.getElementById("startButton");
    startButton.addEventListener("click", () => {
      startButton.disabled = true;
      webSocket.send(["addAllUsersToQueue"].toString());
    });
  } else {
    window.location.href = "../";
  }
});

function ReplaceContentInContainer(id, content) {
  var container = document.getElementById(id);
  container.innerHTML = content;
}
