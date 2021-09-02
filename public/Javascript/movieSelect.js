webSocket = new WebSocket("ws://localhost:3000");

webSocket.addEventListener("message", (message) => {
  let messageContentArray = message.data.split(",");
  let messageID = messageContentArray.shift();
  let messageArray = [messageID, messageContentArray];

  switch (messageArray[0]) {
    case "searchResult":
      changeRedGreenLight(messageContentArray);
      break;
    case "proceedToWaitingRoomMovieSelect":
      webSocket.send(["addToQueue"].toString());
      break;
    case "firstInQueue":
      webSocket.send(["saveUserInfo"].toString());
      break;
    case "infoWasSaved":
      window.location.href = "../waitingRoomMovieSelect";
      break;
    default:
      console.log("Message ID is not defined.");
      break;
  }
});

//update state of availablility of movies by changing lights to either red, green or grey, depending on the movies typed in
function changeRedGreenLight(availableMovies) {
  let allLights = [
    document.getElementById("light1"),
    document.getElementById("light2"),
    document.getElementById("light3"),
    document.getElementById("light4"),
    document.getElementById("light5"),
  ];

  for (let i = 0; i < availableMovies.length; i++) {
    if (availableMovies[i] === "0") {
      //if movie does not exist
      allLights[i].setAttribute("class", "redLight");
    } else if (availableMovies[i] === "") {
      //if no movie was typed in
      allLights[i].setAttribute("class", "off");
    } else {
      //if found movie
      allLights[i].setAttribute("class", "greenLight");
    }
  }
}

webSocket.addEventListener("open", () => {
  if (sessionStorage.getItem("movieSelect") === null) {
    sessionStorage.setItem("movieSelect", "notNull");
    console.log("We are connected!");
    webSocket.send(
      [
        "userWebsocketOpened",
        "movieSelect",
        sessionStorage.getItem("userId"),
      ].toString()
    );
    enableContinueButton();
  } else {
    window.location.href = "../";
  }
});

function enableContinueButton() {
  let continueButton = document.getElementById("continueButton");
  let textFields = Array.from(
    document.getElementsByClassName("inputtedMoviesTextField")
  );
  let allTextFieldsAreEmpty = true;

  textFields.forEach((textField) => {
    textField.addEventListener("input", () => {
      allTextFieldsAreEmpty = textFields.every((textField) => {
        return textField.value == "";
      });
      if (!allTextFieldsAreEmpty) {
        continueButton.removeAttribute("disabled");
      } else {
        continueButton.disabled = true;
      }
    });
  });
  continueButton.addEventListener("click", async () => {
    continueButton.disabled = true;
    checkDatabaseSetup();
  });
}

//sets up the movies typed in by the user in a string seperated by |
function checkDatabaseSetup() {
  let allMovies = document.getElementsByClassName("inputtedMoviesTextField");
  let includeSelectedMovies = false;
  let includeSelectedMoviesCheckbox = document.getElementById(
    "includeSelectedMoviesCheckbox"
  );

  if (includeSelectedMoviesCheckbox.checked != false) {
    includeSelectedMovies = true;
  } else {
    includeSelectedMovies = false;
  }

  webSocket.send(["selectedMovies", includeSelectedMovies].toString());
  webSocket.send([
    `checkMovieAvailabilty\\${allMovies[0].value}|${allMovies[1].value}|${allMovies[2].value}|${allMovies[3].value}|${allMovies[4].value}`,
  ]);
}
