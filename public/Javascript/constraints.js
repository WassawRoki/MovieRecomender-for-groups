webSocket = new WebSocket("ws://localhost:3000");

// Constraint variables
let restrictedActors = "";
let restrictedGenres = "";
let restrictedDirectors = "";
let earliestYear = 2000;
let latestYear = 2017;
let lowestRating = 1;
let earliestYearWasChanged = false;
let latestYearWasChanged = false;
let lowestRatingWasChanged = false;

webSocket.addEventListener("message", (message) => {
  let messageContentArray = message.data.split(",");
  let messageID = messageContentArray.shift();
  let messageArray = [messageID, messageContentArray];
  switch (messageArray[0]) {
    case "firstInQueue":
      webSocket.send(["saveUserInfo"].toString());
      break;
    case "infoWasSaved":
      addConstraints();
      break;
    case "constraintsWereAdded":
      window.location.href = "../waitingRoomSessionJoin";
      break;
    case "toMainPage":
      window.location.href = "../";
      break;
    default:
      console.log("Message ID is not defined.");
      break;
  }
});

function addConstraints() {
  webSocket.send(
    [
      "addConstraints",
      restrictedActors,
      restrictedGenres,
      restrictedDirectors,
      earliestYear,
      latestYear,
      lowestRating,
    ].toString()
  );
}

webSocket.addEventListener("open", () => {
  if (sessionStorage.getItem("constraints") === null) {
    sessionStorage.setItem("constraints", "notNull");
    console.log("We are connected!");
    webSocket.send(["userWebsocketOpened", "constraints"].toString());

    let addConstraintsButton = document.getElementById("addConstraintsButton");
    let applyConstraintsButton = document.getElementById(
      "applyConstraintsButton"
    );
    let removeConstraintsButton = document.getElementById(
      "removeConstraintsButton"
    );
    let backButton = document.getElementById("backToSessionStarterButton");
    let inputtedActors = document.getElementById("inputtedActors");
    let inputtedGenres = document.getElementById("inputtedGenres");
    let inputtedDirectors = document.getElementById("inputtedDirectors");
    let inputtedEarliestYear = document.getElementById("inputtedEarliestYear");
    let inputtedLatestYear = document.getElementById("inputtedLatestYear");
    let inputtedLowestRating = document.getElementById("inputtedLowestRating");

    // Enable disabled buttons when text is inputted
    inputtedActors.addEventListener("input", () => {
      addConstraintsButton.removeAttribute("disabled");
    });
    inputtedGenres.addEventListener("input", () => {
      addConstraintsButton.removeAttribute("disabled");
    });
    inputtedDirectors.addEventListener("input", () => {
      addConstraintsButton.removeAttribute("disabled");
    });

    // Change background color of latest year slider immediately
    changeSliderBackgroundColor(inputtedLatestYear);

    // Change slider values dynamically
    inputtedEarliestYear.addEventListener("input", () => {
      changeYearValues();
      earliestYearWasChanged = true;
    });
    inputtedLatestYear.addEventListener("input", () => {
      changeYearValues();
      latestYearWasChanged = true;
    });
    inputtedLowestRating.addEventListener("input", () => {
      changeValuesBasedOnSlider(inputtedLowestRating);
      lowesetRatingWasChanged = true;
    });

    // Add constraints to array or variable and display constraint on screen. Reset text field afterwards
    addConstraintsButton.addEventListener("click", () => {
      addConstraintsButton.disabled = true;
      addsAndDisplaysConstraints();
    });

    // Send constraints to database and proceed to next page
    applyConstraintsButton.addEventListener("click", () => {
      applyConstraintsButton.disabled = true;
      addsAndDisplaysConstraints();
      webSocket.send(["addToQueue"].toString());
    });

    // Reset all constraints to default
    removeConstraintsButton.addEventListener("click", () => {
      resetConstraintValuesAndDisplay();
    });

    // Go back to sessionStarter page
    backButton.addEventListener("click", () => {
      backButton.disabled = true;
      window.location.href = "../sessionStarter";
    });
  } else {
    window.location.href = "../";
  }
});

function addsAndDisplaysConstraints() {
  currentlyInputtedActor = inputtedActors.value;
  currentlyInputtedGenre = inputtedGenres.value;
  currentlyInputtedDirector = inputtedDirectors.value;

  if (
    currentlyInputtedActor != "" ||
    currentlyInputtedGenre != "" ||
    currentlyInputtedDirector != ""
  ) {
    enableButtons();
  }

  if (currentlyInputtedActor != "") {
    restrictedActors += currentlyInputtedActor + "|";
    addContentToContainer("actorConstraints", currentlyInputtedActor);
    inputtedActors.value = "";
  }
  if (currentlyInputtedGenre != "") {
    restrictedGenres += currentlyInputtedGenre + "|";
    addContentToContainer("genreConstraints", currentlyInputtedGenre);
    inputtedGenres.value = "";
  }
  if (currentlyInputtedDirector != "") {
    restrictedDirectors += currentlyInputtedDirector + "|";
    addContentToContainer("directorConstraints", currentlyInputtedDirector);
    inputtedDirectors.value = "";
  }
  if (earliestYearWasChanged) {
    colorFlash("earliestYearConstraint");
    earliestYearWasChanged = false;
  }
  if (latestYearWasChanged) {
    colorFlash("latestYearConstraint");
    latestYearWasChanged = false;
  }
  if (lowestRatingWasChanged) {
    colorFlash("lowestRatingConstraint");
    lowesetRatingWasChanged = false;
  }
}

function enableButtons() {
  applyConstraintsButton.removeAttribute("disabled");
  removeConstraintsButton.removeAttribute("disabled");
}

function resetConstraintValuesAndDisplay() {
  restrictedActors = "";
  restrictedGenres = "";
  restrictedDirectors = "";
  earliestYear = 2000;
  latestYear = 2017;
  lowestRating = 1;

  ReplaceContentInContainer("actorConstraints", "");
  ReplaceContentInContainer("genreConstraints", "");
  ReplaceContentInContainer("directorConstraints", "");
  ReplaceContentInContainer("earliestYearConstraint", "");
  ReplaceContentInContainer("latestYearConstraint", "");
  ReplaceContentInContainer("lowestRatingConstraint", "");

  inputtedEarliestYear.value = 2000;
  inputtedLatestYear.value = 2017;
  inputtedLowestRating.value = 1;
  changeValuesBasedOnSlider(inputtedEarliestYear);
  changeValuesBasedOnSlider(inputtedLatestYear);
  changeValuesBasedOnSlider(inputtedLowestRating);

  addConstraintsButton.disabled = true;
  applyConstraintsButton.disabled = true;
  removeConstraintsButton.disabled = true;
}

function colorFlash(id) {
  let element = document.getElementById(id);
  element.style.color = "lightgrey";
  setTimeout(() => {
    element.style.color = "white";
  }, 300);
}

function ReplaceContentInContainer(id, content) {
  let container = document.getElementById(id);
  container.innerHTML = content;
}

//adds content to innerHTML of element with specific id. Also adds a break-row to the end.
function addContentToContainer(id, content) {
  let container = document.getElementById(id);
  container.innerHTML += content + "<br>";
}

function changeValuesBasedOnSlider(element) {
  currentlyInputtedValue = element.value;
  changeSliderBackgroundColor(element);
  switch (element) {
    case inputtedEarliestYear:
      earliestYear = currentlyInputtedValue;
      ReplaceContentInContainer(
        "earliestYearConstraint",
        currentlyInputtedValue
      );
      break;
    case inputtedLatestYear:
      latestYear = currentlyInputtedValue;
      ReplaceContentInContainer("latestYearConstraint", currentlyInputtedValue);
      break;
    case inputtedLowestRating:
      lowestRating = currentlyInputtedValue;
      ReplaceContentInContainer(
        "lowestRatingConstraint",
        currentlyInputtedValue
      );
      break;
    default:
      break;
  }
  enableButtons();
}

function changeYearValues() {
  inputtedEarliestYear.max = inputtedLatestYear.value;
  inputtedLatestYear.min = inputtedEarliestYear.value;
  changeValuesBasedOnSlider(inputtedLatestYear);
  changeValuesBasedOnSlider(inputtedEarliestYear);
}

function changeSliderBackgroundColor(element) {
  let value =
    ((element.value - element.min) / (element.max - element.min)) * 100;
  element.style.background =
    "linear-gradient(to right, #999999 0%, #999999 " +
    value +
    "%, #fff " +
    value +
    "%, white 100%)";
}
