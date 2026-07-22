let currentDifficulty = "easy";

let solution = [];

let originalPuzzle = [];

let timerSeconds = 0;

let timerInterval = null;

let gameStarted = false;


const boardElement =
    document.getElementById("sudoku-board");


const timerElement =
    document.getElementById("timer");


const difficultyButtons =
    document.querySelectorAll(".difficulty");


const difficultyText =
    document.getElementById("current-difficulty");


const gameStatus =
    document.getElementById("game-status");


function createBoard(board) {

    boardElement.innerHTML = "";


    for (let row = 0; row < 9; row++) {

        for (let col = 0; col < 9; col++) {

            const input =
                document.createElement("input");


            input.type = "text";

            input.maxLength = 1;

            input.classList.add("cell");


            if (board[row][col] !== 0) {

                input.value =
                    board[row][col];

                input.disabled = true;

                input.classList.add("given");

            }


            input.dataset.row = row;

            input.dataset.col = col;


            input.addEventListener(
                "input",
                validateInput
            );


            input.addEventListener(
                "input",
                checkCompletion
            );


            boardElement.appendChild(input);

        }

    }

}


function validateInput(event) {

    event.target.value =
        event.target.value.replace(
            /[^1-9]/g,
            ""
        );

}


function startTimer() {

    clearInterval(timerInterval);

    timerSeconds = 0;

    timerInterval = setInterval(() => {

        timerSeconds++;

        let minutes =
            Math.floor(timerSeconds / 60);

        let seconds =
            timerSeconds % 60;


        timerElement.textContent =

            `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

    }, 1000);

}


async function generatePuzzle() {

    const response = await fetch(
        "/generate",
        {

            method: "POST",

            headers: {

                "Content-Type":
                    "application/json"

            },

            body: JSON.stringify({

                difficulty:
                    currentDifficulty

            })

        }

    );


    const data =
        await response.json();


    originalPuzzle =
        data.puzzle;


    solution =
        data.solution;


    createBoard(
        originalPuzzle
    );


    difficultyText.textContent =
        currentDifficulty
            .charAt(0)
            .toUpperCase()
        +
        currentDifficulty.slice(1);


    gameStatus.textContent =
        "Playing";


    gameStarted = true;


    startTimer();


    saveGamePlayed();

}


function getCurrentBoard() {

    const inputs =
        document.querySelectorAll(".cell");


    let board = [];


    for (let row = 0; row < 9; row++) {

        let currentRow = [];


        for (let col = 0; col < 9; col++) {

            let input =
                inputs[row * 9 + col];


            currentRow.push(

                input.value === ""

                    ? 0

                    : parseInt(input.value)

            );

        }


        board.push(
            currentRow
        );

    }


    return board;

}


function checkCompletion() {

    const board =
        getCurrentBoard();


    for (let row = 0; row < 9; row++) {

        for (let col = 0; col < 9; col++) {

            if (

                board[row][col]
                !==
                solution[row][col]

            ) {

                return;

            }

        }

    }


    clearInterval(timerInterval);


    gameStatus.textContent =
        "Completed!";


    savePuzzleSolved();


    alert(
        "Congratulations! Puzzle solved 🎉"
    );

}


function solvePuzzle() {

    const inputs =
        document.querySelectorAll(".cell");


    for (let row = 0; row < 9; row++) {

        for (let col = 0; col < 9; col++) {

            inputs[row * 9 + col].value =
                solution[row][col];

        }

    }


    clearInterval(timerInterval);


    gameStatus.textContent =
        "Solved";

}


function clearBoard() {

    const inputs =
        document.querySelectorAll(".cell");


    inputs.forEach(input => {

        if (!input.classList.contains("given")) {

            input.value = "";

        }

    });


    gameStatus.textContent =
        "Playing";

}


function saveGamePlayed() {

    let stats =
        JSON.parse(
            localStorage.getItem(
                "sudokuStats"
            )
        ) || {

            gamesPlayed: 0,

            puzzlesSolved: 0,

            totalTime: 0,

            bestTime: null,

            easy: 0,

            medium: 0,

            hard: 0

        };


    stats.gamesPlayed++;


    localStorage.setItem(

        "sudokuStats",

        JSON.stringify(stats)

    );

}


function savePuzzleSolved() {

    let stats =
        JSON.parse(
            localStorage.getItem(
                "sudokuStats"
            )
        );


    stats.puzzlesSolved++;


    stats[currentDifficulty]++;


    stats.totalTime +=
        timerSeconds;


    if (

        stats.bestTime === null
        ||
        timerSeconds < stats.bestTime

    ) {

        stats.bestTime =
            timerSeconds;

    }


    localStorage.setItem(

        "sudokuStats",

        JSON.stringify(stats)

    );

}


difficultyButtons.forEach(button => {

    button.addEventListener(

        "click",

        () => {

            difficultyButtons.forEach(
                btn =>
                    btn.classList.remove(
                        "active"
                    )
            );


            button.classList.add(
                "active"
            );


            currentDifficulty =
                button.dataset.difficulty;


            generatePuzzle();

        }

    );

});


document.getElementById(
    "new-game"
).addEventListener(

    "click",

    generatePuzzle

);


document.getElementById(
    "solve-button"
).addEventListener(

    "click",

    solvePuzzle

);


document.getElementById(
    "clear-button"
).addEventListener(

    "click",

    clearBoard

);


generatePuzzle();
