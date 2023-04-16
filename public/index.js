/* eslint-disable no-use-before-define */
/* eslint-disable no-alert */
const configChoiceDiv = document.getElementById('config-choice');
const againstPlayerBtn = document.getElementById('against-player');
const againstMachineBtn = document.getElementById('against-machine');

const defaultTitle = document.getElementById('title-header').textContent;
const enterNamesTitle = 'Enter your names:';

function changeTitle(newTitle) {
  document.getElementById('title-header').textContent = newTitle;
}

againstPlayerBtn.addEventListener('click', () => {
  changeTitle(enterNamesTitle);
  replaceConfigChoice();
});

function replaceConfigChoice() {
  // Remove the buttons
  configChoiceDiv.innerHTML = '';

  // Create the form
  const form = document.createElement('form');
  form.id = 'config-form';

  // Create the label and text input for Player 1 (X)
  const player1Label = document.createElement('label');
  player1Label.innerText = 'Player 1 (X)';
  const player1Input = document.createElement('input');
  player1Input.required = true;
  player1Input.type = 'text';
  player1Input.name = 'player1';

  // Create the label and text input for Player 2 (O)
  const player2Label = document.createElement('label');
  player2Label.innerText = 'Player 2 (O)';
  const player2Input = document.createElement('input');
  player2Input.required = true;
  player2Input.type = 'text';
  player2Input.name = 'player2';

  // Create the 'Go Back' button
  const goBackButton = document.createElement('button');
  goBackButton.setAttribute('id', 'go-back');
  goBackButton.innerText = 'Go Back';
  goBackButton.addEventListener('click', () => {
    // Remove the form and add the buttons back
    configChoiceDiv.removeChild(form);
    changeTitle(defaultTitle);
    addConfigChoiceButtons();
  });

  // Create the 'Start Game' button
  const startGameButton = document.createElement('button');
  startGameButton.setAttribute('id', 'start-game');
  startGameButton.type = 'submit';
  startGameButton.innerText = 'Start Game';

  // Add the elements to the form
  form.appendChild(player1Label);
  form.appendChild(player1Input);
  form.appendChild(document.createElement('br'));
  form.appendChild(player2Label);
  form.appendChild(player2Input);
  form.appendChild(document.createElement('br'));
  form.appendChild(goBackButton);
  form.appendChild(startGameButton);

  // Add the form to the config-choice div
  configChoiceDiv.appendChild(form);
}

function addConfigChoiceButtons() {
  // Add the buttons to the config-choice div
  configChoiceDiv.appendChild(againstPlayerBtn);
  configChoiceDiv.appendChild(againstMachineBtn);
}

function createMarkSpan(parentDiv, mark) {
  const parentDivWidth = parentDiv.offsetWidth;
  const parentDivHeight = parentDiv.offsetHeight;
  const fontSize = Math.min(parentDivWidth, parentDivHeight) * 0.8;

  const span = document.createElement('span');
  span.textContent = mark;
  span.classList.add('mark');
  span.classList.add(`${mark.toLowerCase()}-mark`);
  span.style.fontSize = `${fontSize}px`;

  return span;
}

const Spot = (spotDiv) => {
  const getSpotDiv = () => spotDiv;
  let isChecked = false;

  const mark = (text) => {
    if (isChecked) return;
    spotDiv.appendChild(createMarkSpan(spotDiv, text));
    isChecked = true;
  };

  const markX = () => mark('X');

  const markO = () => mark('O');

  return {
    getSpotDiv, isChecked, markX, markO,
  };
};

function getSpotDivs() {
  const spotDivs = Array.from(document.querySelectorAll('div.spot'));
  const spots = [];

  spotDivs.forEach((spotDiv) => {
    spotDiv.classList.add('flex-centered');

    const spot = Spot(spotDiv);
    spotDiv.addEventListener('click', () => spot.markX());

    spots.push(spot);
  });

  return spots;
}

const gameBoard = (() => {
  const spots = getSpotDivs();
})();

const game = (() => {
  const turnCounter = 0;
})();
