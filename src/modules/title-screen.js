function appendUserInitialization(parentCont) {
  const intakeForm = document.createElement("form");
  intakeForm.addEventListener("submit", (e) => {
    e.preventDefault();
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
  inputLabel.appendChild(usernameInput);

  const submitIntakeBtn = document.createElement("button");
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