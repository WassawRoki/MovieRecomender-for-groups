webSocket = new WebSocket("ws://localhost:3000");

let nameWasInputted = false;
let roomIdWasInputted = false;

webSocket.addEventListener("message", (message) => {
  let messageContentArray = message.data.split(",");
  let messageID = messageContentArray.shift();
  let messageArray = [messageID, messageContentArray];
  switch (messageArray[0]) {
    case "doesSessionExist":
      doesSessionExist(messageContentArray[0], messageContentArray[1]);
      break;
    case "firstInQueue":
      saveUserInfo();
      window.location.href = "../waitingRoomSessionJoin";
      break;
    default:
      console.log("Message ID is not defined.");
      break;
  }
});

webSocket.addEventListener("open", () => {
  if (sessionStorage.getItem("sessionJoin") === null) {
    sessionStorage.setItem("sessionJoin", "notNull");
    console.log("We are connected!");
    webSocket.send(["sessionJoin"].toString());

    let joinButton = document.getElementById("joinButton");
    let backButton = document.getElementById("backButton");
    let textFieldName = document.getElementById("username");
    let textFieldRoomId = document.getElementById("sessionId");

    // When a name is inputted
    textFieldName.addEventListener("input", () => {
      nameWasInputted = true;
      enableOrDisableJoinButton(nameWasInputted, roomIdWasInputted);
    });
    textFieldRoomId.addEventListener("input", () => {
      roomIdWasInputted = true;
      enableOrDisableJoinButton(nameWasInputted, roomIdWasInputted);
    });

    joinButton.addEventListener("click", () => {
      joinButton.disabled = true;
      let sessionId = document.getElementById("sessionId").value;
      sessionId = sessionId.toLowerCase();
      webSocket.send(["checkIfSessionExists", sessionId].toString());
    });

    backButton.addEventListener("click", () => {
      backButton.disabled = true;
      window.location.href = "../";
    });
  } else {
    window.location.href = "../";
  }
});

function enableOrDisableJoinButton(nameWasInputted, roomIdWasInputted) {
  if (nameWasInputted && roomIdWasInputted) {
    joinButton.removeAttribute("disabled");
  }
  if (textFieldName.value == "" || textFieldRoomId.value == "") {
    joinButton.disabled = true;
  }
}

//if session exists join session, otherwise inform user that session does not exist
function doesSessionExist(sessionExists, sessionId) {
  if (sessionExists == "true") {
    webSocket.send(["addToQueue"].toString());
  } else {
    ReplaceContentInContainer(
      "sessionDoesNotExist",
      `Rum ${sessionId} findes ikke`
    );
    document.getElementById("sessionId").value = "";
    document.getElementById("joinButton").removeAttribute("disabled");
  }
}

function saveUserInfo() {
  let username = document.getElementById("username").value;
  let sessionId = document.getElementById("sessionId").value;
  sessionId = sessionId.toLowerCase(); // The user automatically types in uppercase on the website, but the actual id is in lowercase. Therefor, we convert to lowercase.
  webSocket.send(["saveUserInfo", username, sessionId].toString());
}

function ReplaceContentInContainer(id, content) {
  var container = document.getElementById(id);
  container.innerHTML = content;
}
