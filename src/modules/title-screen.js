import { initializeGamePlay } from "./game-control";

function appendUserInitialization(parentCont) {
  const intakeForm = document.createElement("form");
  intakeForm.id = "intakeForm"
  intakeForm.addEventListener("submit", (e) => {
    e.preventDefault();
    initializeGamePlay();
  })

  parentCont.appendChild(intakeForm);

  const inputLabel = document.createElement("label");
  inputLabel.htmlFor = "username";
  inputLabel.textContent = "Welcome, Admiral. Please state your name for verification:"
  intakeForm.appendChild(inputLabel);

  const usernameInput = document.createElement("input");
  usernameInput.type = "text";
  usernameInput.id = "username";
  usernameInput.name = "username";
  usernameInput.setAttribute("required", "");
  usernameInput.setAttribute("minlength", 3);
  usernameInput.addEventListener("input", (e) => {
    if(usernameInput.validity.valueMissing || usernameInput.value.length < 2) {
      usernameInput.setCustomValidity("This is urgent sir. Your name please.")
    } else if(usernameInput.value.length > 15) {
      usernameInput.setCustomValidity("That's too long for our system. Might I suggest a nickname?")
    } else if (usernameInput.value.toUpperCase() == "JACK") {
      usernameInput.setCustomValidity("Your last name wouldn't be Sparrow... would it?")
      setTimeout( () => {
        usernameInput.setCustomValidity("");
      }, 5000);
    } else {
      usernameInput.setCustomValidity("");
    }
  })
  inputLabel.appendChild(usernameInput);


  const submitIntakeBtn = document.createElement("button");
  submitIntakeBtn.id = "submit-intake-btn"
  submitIntakeBtn.type = "submit";
  submitIntakeBtn.textContent = "Confirm";
  intakeForm.appendChild(submitIntakeBtn);
}

function appendTitle(parentCont) {
  const title = document.createElement("div");
  title.id = "title";
  title.textContent = "Battle Ships";
  parentCont.appendChild(title);
}

function initializeTitleScreen() {
  document.body.innerHTML = "";

  const titleScreen = document.createElement("div");
  titleScreen.id = "title-screen"
  titleScreen.innerHTML = "";
  document.body.appendChild(titleScreen)

  appendTitle(titleScreen);
  appendUserInitialization(titleScreen);
}

initializeTitleScreen();