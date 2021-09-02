webSocket = new WebSocket("ws://localhost:3000");

let totalUsers = 0;
let currentUsers = 0;

webSocket.addEventListener("message", (message) => {
  let messageContentArray = message.data.split(",");
  let messageID = messageContentArray.shift();
  let messageArray = [messageID, messageContentArray];

  switch (messageArray[0]) {
    case "displayUpdatedNames":
      displayName(messageArray[1]);
      break;
    case "subtractOneFromRemainingUsers":
      subtractOneFromTotalUsersAndDisplayIt();
      break;
    case "displayRemainingUsers":
      displayRemainingUsers(messageArray[1]);
      break;
    case "isHost":
      displayStartButton();
      break;
    case "allUsersWereAddedToQueue":
      webSocket.send(["runAlgorithmAndProceed"].toString());
      break;
    case "firstInQueue":
      webSocket.send(["saveUserInfo"].toString());
      break;
    case "infoWasSaved":
      window.location.href = "../movieRecommendations";
      break;
    default:
      console.log("Message ID is not defined.");
      break;
  }
});

webSocket.addEventListener("open", () => {
  if (sessionStorage.getItem("waitingRoomMovieSelect") === null) {
    sessionStorage.setItem("waitingRoomMovieSelect", "notNull");
    console.log("We are connected!");
    webSocket.send(
      ["userWebsocketOpened", "waitingRoomMovieSelect"].toString()
    );
    let runAlgorithmButton = document.getElementById("runAlgorithm");

    runAlgorithmButton.addEventListener("click", () => {
      runAlgorithmButton.disabled = true;
      webSocket.send(["addAllUsersToQueue"].toString());
    });
  } else {
    window.location.href = "../";
  }
});

function displayRemainingUsers(currentUsersAndTotalUsers) {
  currentUsers = currentUsersAndTotalUsers[0];
  totalUsers = currentUsersAndTotalUsers[1];
  ReplaceContentInContainer(
    "remainingUsersText",
    `${currentUsers} / ${totalUsers} har valgt`
  );
  if (currentUsers === totalUsers) {
    document.getElementById("runAlgorithm").removeAttribute("disabled");
  }
}

function subtractOneFromTotalUsersAndDisplayIt() {
  totalUsers -= 1;
  ReplaceContentInContainer(
    "remainingUsersText",
    `${currentUsers} / ${totalUsers} har valgt`
  );
}

function displayStartButton() {
  let startButton = document.getElementById("runAlgorithm");
  startButton.style.visibility = "visible";
}

function displayName(names) {
  let namesHTML = "";
  for (let i = 0; i < names.length; i++) {
    namesHTML += names[i] + " <br> ";
  }
  ReplaceContentInContainer("usernames", namesHTML);
}

function ReplaceContentInContainer(id, content) {
  var container = document.getElementById(id);
  container.innerHTML = content;
}
