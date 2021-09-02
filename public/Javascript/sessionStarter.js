webSocket = new WebSocket("ws://localhost:3000");

let sessionId = "";
let constraintsWasApplied = undefined;

webSocket.addEventListener("message", (message) => {
  let messageContentArray = message.data.split(",");
  let messageID = messageContentArray.shift();
  let messageArray = [messageID, messageContentArray];

  switch (messageArray[0]) {
    case "firstInQueue":
      saveUserInfo();
      break;
    case "infoWasSaved":
      webSocket.send(
        ["setupDeletionTime", constraintsWasApplied, sessionId].toString()
      );
      break;
    case "deletionTimeWasSet":
      sendsUserToCorrectPageDependingOnIfConstraintsWasApplied();
      break;
    default:
      console.log("Message ID is not defined.");
      break;
  }
});

webSocket.addEventListener("open", () => {
  if (sessionStorage.getItem("sessionStarter") === null) {
    sessionStorage.setItem("sessionStarter", "notNull");
    sessionIdCreator();
    webSocket.send(["createDatabase", sessionId].toString());
    console.log("We are connected!");
    if (sessionId != "")
      webSocket.send(["sessionStarter", sessionId].toString());
    let noConstraintsButton = document.getElementById("noConstraintsButton");
    let constraintsButton = document.getElementById("constraintsButton");
    let backButton = document.getElementById("backButton");
    let textFieldName = document.getElementById("username");

    // When a name is inputted
    textFieldName.addEventListener("input", () => {
      noConstraintsButton.removeAttribute("disabled");
      constraintsButton.removeAttribute("disabled");
      if (textFieldName.value == "") {
        noConstraintsButton.disabled = true;
        constraintsButton.disabled = true;
      }
    });

    noConstraintsButton.addEventListener("click", () => {
      noConstraintsButton.disabled = true;
      webSocket.send(["addToQueue"].toString());
      constraintsWasApplied = false;
    });

    constraintsButton.addEventListener("click", () => {
      constraintsButton.disabled = true;
      webSocket.send(["addToQueue"].toString());
      constraintsWasApplied = true;
    });

    backButton.addEventListener("click", () => {
      backButton.disabled = true;
      window.location.href = "../";
    });
  } else {
    window.location.href = "../";
  }
});

function sendsUserToCorrectPageDependingOnIfConstraintsWasApplied() {
  if (constraintsWasApplied) {
    window.location.href = "../constraints";
  } else {
    window.location.href = "../waitingRoomSessionJoin";
  }
}

function saveUserInfo() {
  let username = document.getElementById("username").value;
  webSocket.send(["saveUserInfo", username].toString());
}

//generates random session-id of length 8, then adds it to session storage
function sessionIdCreator() {
  let idLength = 8;
  sessionStorage.userType = 1;
  let chars = "abcdefghijklmnopqrstuvwxyz1234567890";
  for (let x = 0; x < idLength; x++) {
    let i = Math.floor(Math.random() * chars.length);
    sessionId += chars.charAt(i);
  }
  sessionStorage.sessionId = sessionId;
}
