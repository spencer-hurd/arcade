let state = {};

const resetState = () => {
    state.board = [
        null, null, null,
        null, null, null,
        null, null, null
    ];
    state.players = ["", ""];
    state.getCurrentPlayer = () => state.players[state.currentPlayerIdx];
    state.currentPlayerIdx = 0;
    state.playerMark = "X";
    state.winner = null;
    state.draw = false;
    state.gameGoing = false;
}
resetState();

//dom selectors
const scoreElem = document.querySelector('#score');
const boardElem = document.getElementById("board");
const playerTurnElem = document.querySelector('#player-turn');


//game logic
const changeTurn = () => {
    if (state.currentPlayerIdx === 0) {
        state.currentPlayerIdx = 1
        state.playerMark = "O";
    }else{
        state.currentPlayerIdx = 0;
        state.playerMark = "X"
    }
    renderPlayer();

};

const drawCheck = () => {
    if (state.board.includes(null) === false && state.winner === null) {
        state.draw=true;
    }
}

const checkBoard = () => {
    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5], 
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    for (let winCondition of winningConditions) {
        const [position1, position2, position3] = winCondition;
        if (state.board[position1] !== null && 
        state.board[position1] === state.board[position2] && 
        state.board[position1] === state.board[position3]
        ) {
            let winnerIdx = 0;
            if (state.board[position1] === "X") {
                winnerIdx = 0;
            }else if (state.board[position1] === "O"){
                winnerIdx = 1;
            }
            
            state.winner = state.players[winnerIdx]
            console.log(state.winner)
        }else{
            drawCheck();
            console.log(state.draw)
        }
    }
}


//dom manipulating functions
const renderBoard = () => {
    boardElem.innerHTML = "";
    for (let i = 0; i<state.board.length; i++) {
        const squareElem = document.createElement("div");
        squareElem.classList.add("square");
        squareElem.dataset.index = i;
        boardElem.appendChild(squareElem);
    }
};

renderBoard();

const renderPlayer = () => {
    let text;
    if (!state.players[0] || !state.players[1]) {
        text = `
        <input name="player1" placeholder="Enter Player 1"/>
        <input name="player2" placeholder="Enter Player 2"/>
        <button class="start">Start Game</button>
        `;
     } else {
        if (state.winner) {
            text = `<span class='player'>${state.winner} has won!</span>`;
        } else {
            text = `It's currently <span class="player">${state.getCurrentPlayer()}</span>'s turn.`;
        }
    }
    playerTurnElem.innerHTML = text;

    if (state.winner) {
        const resetButton = document.createElement('button');
        resetButton.innerHTML = `Play Again?`;
        resetButton.classList.add('restart');
        playerTurnElem.appendChild(resetButton);
    } else if (state.draw) {
            playerTurnElem.innerHTML = "It's a draw!";
            const resetButton = document.createElement('button');
            resetButton.innerHTML = `Play Again?`;
            resetButton.classList.add('restart');
            playerTurnElem.appendChild(resetButton);
        }
    }

renderPlayer();

//event listeners
playerTurnElem.addEventListener('click', (event) => {
    if (event.target.className === 'restart') {
      resetState();
      renderBoard();
      renderPlayer();
    } else if (event.target.className === 'start') {
      const player1Input = document.querySelector('input[name=player1]');
      const player1Value = player1Input.value;
      state.players[0] = player1Value;
      const player2Input = document.querySelector('input[name=player2]');
      const player2Value = player2Input.value;
      state.players[1] = player2Value;
      renderPlayer();
      state.gameGoing = true;
    }
  });
  boardElem.addEventListener("click", (event) => {
    if (event.target.className !== "square" || state.winner || !state.gameGoing) {
        return;
    }else
    if (event.target.innerText === "X" || event.target.innerText === "O") {
        return;
    }else{
        console.log(event.target);
        event.target.innerText = state.playerMark;
        const idx = event.target.dataset.index;
        state.board[idx] = state.playerMark;
        checkBoard();
        changeTurn();
    }
    
  })