/* eslint-disable no-unused-expressions */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-plusplus */
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
  goBackButton.addEventListener('click', () => removeForm);

  // Create the 'Start Game' button
  const startGameButton = document.createElement('button');
  startGameButton.setAttribute('id', 'start-game');
  startGameButton.type = 'submit';
  startGameButton.innerText = 'Start Game';
  startGameButton.addEventListener('click', (event) => {
    event.preventDefault();
    removeForm();
    game.startGame();
  });

  const removeForm = () => {
    // Remove the form and add the buttons back
    configChoiceDiv.removeChild(form);
    changeTitle(defaultTitle);
    addConfigChoiceButtons();
  };

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

const Player = (name, mark) => {
  const getName = () => name;
  const getMark = () => mark;

  return { getName, getMark };
};

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

  const getStatus = () => isChecked;

  let currentMark = '';

  const getMark = () => currentMark;

  const mark = (markSign) => {
    if (isChecked) return false;
    spotDiv.appendChild(createMarkSpan(spotDiv, markSign));
    isChecked = true;
    currentMark = markSign;
    return true;
  };

  const unmark = () => {
    spotDiv.removeChild(spotDiv.firstChild);
    isChecked = false;
    currentMark = '';
  };

  return {
    getSpotDiv, getStatus, mark, unmark, getMark,
  };
};

function getSpotDivs() {
  const spotDivs = Array.from(document.querySelectorAll('div.spot'));
  const spots = [];

  spotDivs.forEach((spotDiv) => {
    spotDiv.classList.add('flex-centered');
    const spot = Spot(spotDiv);
    spots.push(spot);
  });

  return spots;
}

const gameBoard = (() => {
  const spots = getSpotDivs();
  const getSpots = () => spots;

  const winningCombos = [[0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6], // diagonals
  ];

  const checkForWin = (mark) => {
    for (const combo of winningCombos) {
      if (spots[combo[0]].getMark() === mark
          && spots[combo[1]].getMark() === mark
          && spots[combo[2]].getMark() === mark) {
        return true;
      }
    }
    return false;
  };

  const isBoardFull = () => {
    for (const spot of spots) {
      if (!spot.getStatus()) {
        return false;
      }
    }
    return true;
  };

  const resetBoard = (handler) => {
    spots.forEach((spot) => {
      spot.unmark();
      spot.getSpotDiv().removeEventListener('click', handler);
    });
  };

  return {
    getSpots, checkForWin, isBoardFull, resetBoard,
  };
})();

const player1Mark = 'X';
const player2Mark = 'O';

const game = (() => {
  let player1;
  let player2;
  let currentPlayer;

  const startGame = () => {
    player1 = Player('player1', player1Mark);
    player2 = Player('player2', player2Mark);
    currentPlayer = player1;

    gameBoard.getSpots().forEach((spot) => spot.getSpotDiv().addEventListener('click', () => handleTurn(spot)));
  };

  const handleTurn = (spot) => {
    const mark = currentPlayer.getMark();
    const played = spot.mark(mark);

    if (played === false) return;

    if (gameBoard.checkForWin(mark)) {
      alert(`${currentPlayer} wins!`);
      restartGame();
      return;
    }

    if (gameBoard.isBoardFull()) {
      alert("It's a tie!");
      restartGame();
      return;
    }

    currentPlayer = (currentPlayer === player1) ? player2 : player1;
  };

  const restartGame = () => gameBoard.resetBoard(handleTurn);

  return { startGame };
})();
