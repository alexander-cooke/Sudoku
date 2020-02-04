var sudokuBoard = ( function() {
    // PRIVATE VARIABLES
    var masterBoard = []; // This board will contain the solution for the game.
    var playerBoard = []; // This board will be a partially-empty copy 
                          // of the master board for the player
    
    var templateBoard = [ // This valid solution will be used to generate different master boards by shuffling.
		[5, 3, 4,  6, 7, 8,  9, 1, 2], 
		[6, 7, 2,  1, 9, 5,  3, 4, 8], 
		[1, 9, 8,  3, 4, 2,  5, 6, 7], 
	
		[8, 5, 9,  7, 6, 1,  4, 2, 3], 
		[4, 2, 6,  8, 5, 3,  7, 9, 1], 
		[7, 1, 3,  9, 2, 4,  8, 5, 6], 
	
		[9, 6, 1,  5, 3, 7,  2, 8, 4], 
		[2, 8, 7,  4, 1, 9,  6, 3, 5], 
		[3, 4, 5,  2, 8, 6,  1, 7, 9]
    ];

    // PRIVATE UTILITY METHODS
    // Generates random between lower (inclusive) and upper (exclusive)
    function generateRandomNumBetween(lower, upper) {
        return Math.floor(Math.random() * (upper - lower) + lower)
    }
    
    // Turn rows into columns and columns into rows.
    function inverseBoard(board) {
        let inverse = [];

        for( let i = 0; i < board.length; i++ ) {
            let columnToRow = []
            for( let j = 0; j < 9; j++ ) {
                columnToRow.push(board[j][i])
            }
            inverse.push(columnToRow);
        }
        return inverse;
    }

    function hideTilesAtRandom(board) 
    {
        let numberOfEmptyCells, randIndex;

        for( let i = 0; i < 9; i++) {
            numberOfEmptyCells = generateRandomNumBetween(2, 6);
            for( let j = 0; j < numberOfEmptyCells; j++) {
                randIndex = generateRandomNumBetween(0, 8);
                board[i][randIndex] = 0;
            }
        }
    }

    // Fisher-Yates shuffling algorithm - O(n)
    function shuffleArray(arr) 
    {
        let temp, j;

        for( i = arr.length - 1; i >= 0; i--) {
            j = generateRandomNumBetween(0, i);
            temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
        return arr;
    }

    // Shuffle the template board
    function shuffle() {
        let subRow1, subRow2, subRow3, rowShuffleBoard;
        let subCol1, subCol2, subCol3, colShuffleBoard;
        let subsquareRowShuffleBoard;

        // Shuffle each row within each individual subsquare row
        subRow1 = shuffleArray(templateBoard.slice(0,3));
        subRow2 = shuffleArray(templateBoard.slice(3,6));
        subRow3 = shuffleArray(templateBoard.slice(6,9));
        rowShuffleBoard = subRow1.concat(subRow2).concat(subRow3);

        // Shuffle each column within each individual subsquare column
        rowShuffleBoard = inverseBoard(rowShuffleBoard);
        subCol1 = shuffleArray(rowShuffleBoard.slice(0,3));
        subCol2 = shuffleArray(rowShuffleBoard.slice(3,6));
        subCol3 = shuffleArray(rowShuffleBoard.slice(6,9));
        colShuffleBoard = subCol1.concat(subCol2).concat(subCol3);

        // Shuffle each subsquare row
        subRow1 = colShuffleBoard.slice(0,3);
        subRow2 = colShuffleBoard.slice(3,6);
        subRow3 = colShuffleBoard.slice(6,9);
        subsquareRowShuffleBoard = [];
        subsquareRowShuffleBoard.push(subRow1);
        subsquareRowShuffleBoard.push(subRow2);
        subsquareRowShuffleBoard.push(subRow3);
        subsquareRowShuffleBoard = shuffleArray(subsquareRowShuffleBoard);
        subsquareRowShuffleBoard = subsquareRowShuffleBoard[0]
                        .concat(subsquareRowShuffleBoard[1])
                        .concat(subsquareRowShuffleBoard[2]);

        // Shuffle each subsquare column
        subsquareRowShuffleBoard = inverseBoard(subsquareRowShuffleBoard);
        subCol1 = shuffleArray(subsquareRowShuffleBoard.slice(0,3));
        subCol2 = shuffleArray(subsquareRowShuffleBoard.slice(3,6));
        subCol3 = shuffleArray(subsquareRowShuffleBoard.slice(6,9));

        return subCol1.concat(subCol2).concat(subCol3);
    };

    function findNextEmptySquarePosition(board)
    {
        let emptySquarePosition = [];
        let foundEmptySquare = false;
 
        for( let i = 0; i < board.length; i++ ) {
            for( let j = 0; j < board[0].length; j++ ) {
                if(!foundEmptySquare && board[i][j] == 0) {
                    emptySquarePosition[0] = i;
                    emptySquarePosition[1] = j;
                    foundEmptySquare = true;
                }
            }
        }
        return emptySquarePosition;
    };

    // PUBLIC INTERFACE
    return {
        makePlayerBoard: function() {
            masterBoard = shuffle();
            playerBoard = masterBoard.map(inner => inner.slice());
            hideTilesAtRandom(playerBoard);
            return playerBoard;
        },

        getPlayerBoard: function() {
            return playerBoard;
        },

        getCellValue: function(row, col) {
			return playerBoard[row][col];
        },

        setCellValue: function(row, col, value) {
            playerBoard[row][col] = value;
        },

        stillPartiallyEmpty: function() {
            let foundEmptySquare = false;

            for( let i = 0; i < playerBoard.length; i++ ) {
                for( let j = 0; j < playerBoard[0].length; j++ ) {
                    if( playerBoard[i][j] == 0) {
                        foundEmptySquare = true;
                    }
                }
            }
            return foundEmptySquare;
        },

        solve: function() {
            playerBoard = Array.from(masterBoard);
        },

        giveHint: function() {
            let [x, y] = findNextEmptySquarePosition(playerBoard);
            playerBoard[x][y] = masterBoard[x][y];
            return [x, y];
        },


        /* 
        This function checks to see whether the last number added
        to the board during backtracking satisfies the constraints of the game
        (i.e. the same number can't already exist within the row, column or box
        to which the new number belongs)
        numValue: value of the number attempting to be added (1-9)
        x: x-coordinate of the position where number is being placed
        y: y-coordinate of the position where number is being placed

        For checking the box, each of the nine boxes are represented by the
            following coordinates.
                |       |
          (0,0) | (1,0) | (2,0)
                |       |
            - - - - - - - - - - -
                |       |
          (0,1) | (1,1) | (2,1)
                |       |
            - - - - - - - - - - -
                |       |
          (0,2) | (1,2) | (2,2)
                |       |
        */

        checkIfLegalMove: function(row, column, value, conflictLocation) {
            let legalMove = true;
                
            // Check row
            for( let i = 0; i < playerBoard[0].length; i++) {
                if( playerBoard[row][i] === value) {
                    legalMove = false;
                    conflictLocation[0] = row;
                    conflictLocation[1] = i
                }
            }

            // Check column
            for( let i = 0; i < playerBoard.length; i++) {
                if( playerBoard[i][column] === value) {
                    legalMove = false;
                    conflictLocation[0] = i
                    conflictLocation[1] = column;
                }
            }

            // Check subsquare
            var boxX = Math.floor(column / 3);
            var boxY = Math.floor(row / 3);

            for( let i = boxY * 3; i < boxY * 3 + 3; i++) {
                for( let j = boxX * 3; j < boxX * 3 + 3; j++) {
                    if(playerBoard[i][j] == value) {
                        legalMove = false;
                        conflictLocation[0] = i;
                        conflictLocation[1] = j;
                    }
                }
            }
            
            return legalMove;
        }
    }
})();

var controller = (function(s) {    
    let count = 0;
    let intervalID = 0;
    let selectedTile;
    let conflictLocation = [];
    let rowOfSelectedTile, columnOfSelectedTile;

    function setupEventHandlers()
    {
        document.querySelectorAll('.numberOnPad').forEach(item => {
            item.addEventListener('click', event => {
                tryToAddValueToSelectedTile(parseInt(item.innerHTML));
            });
        });

        document.addEventListener('keypress', function(event) {
            if ((event.keyCode >= 49 && event.keyCode <= 57)) {
                tryToAddValueToSelectedTile(parseInt(String.fromCharCode(event.keyCode)));
            }
        });

        document.addEventListener('keydown', function(event){
            if( event.keyCode === 8 ) {
                selectedTile.innerHTML = "";
            }
        });

        document.getElementById('newGameButton').addEventListener('click', function(event){
            restart();
        });

        document.getElementById('hintButton').addEventListener('click', function(event) {
            if (sudokuBoard.stillPartiallyEmpty()) {
                let [x, y] = sudokuBoard.giveHint();
                let tile = document.getElementById("r" + x + "-c" + y);
                tile.className = "cell";
                tile.innerHTML = s.getCellValue(x, y);
            }
        });

        document.getElementById('solveButton').addEventListener('click', function(event) {
            sudokuBoard.solve();
            populateGrid();
        });
    }

    function restart() {
        clearInterval(intervalID);
        count = 0;
        counter = document.getElementById('counter').innerHTML = "0:00";
        strikes = document.getElementById('strikeCounter').innerHTML = "";
        intervalID = setInterval(startTimer, 1000);
        sudokuBoard.makePlayerBoard();
        populateGrid();
        $("#grid").fadeIn(1000);
        $("#numPad").fadeIn(1000);
    }
 
    function populateGrid() {
        for(let i = 0; i < 9; i++) {
            for(let j = 0; j < 9; j++) {
                let tile = document.getElementById("r" + i + "-c" + j);
                if(s.getCellValue(i, j) == 0) {
                    tile.className = "emptyCell";
                    tile.innerHTML = "";
                    tile.onclick = function() {
                        if( selectedTile != this) {
                            if( selectedTile != null ) {
                                selectedTile.className = "emptyCell";
                            }
                            selectedTile = this;
                            rowOfSelectedTile = selectedTile.getAttribute('id').charAt(1);
                            columnOfSelectedTile = selectedTile.getAttribute('id').charAt(4);
                            selectedTile.className = "emptyCell selected";
                        }
                    }
                }
                else {
                    tile.className = "cell";
                    tile.innerHTML = s.getCellValue(i, j);
                }
            }
        }
    }

    function gameOver() {
        alert('You lost.');
        restart();
    }

    function tryToAddValueToSelectedTile(value) {
        if( selectedTile != null ) {
            if( sudokuBoard.checkIfLegalMove(rowOfSelectedTile, 
                                             columnOfSelectedTile, 
                                             value, 
                                             conflictLocation)) {
                    selectedTile.innerHTML = value;
                    sudokuBoard.setCellValue(rowOfSelectedTile, 
                                             columnOfSelectedTile, 
                                             value);
            }
            else {
                //Add a strike
                document.getElementById("strikeCounter").innerHTML = document.getElementById("strikeCounter").innerHTML + 'X';

                //Momentarily highlight the offending number using conflictLocation
                let tile = document.getElementById("r" + conflictLocation[0] + "-c" + conflictLocation[1]);
                let prevColour = tile.style.backgroundColor;
                tile.style.backgroundColor = "#cc2c4f";
                
                setTimeout(function() {
                    tile.style.backgroundColor = prevColour;
                },1000);
                
                if( document.getElementById("strikeCounter").innerHTML.toString().length >= 4 ) {
                    gameOver();
                }
            }        
        }
    }

	/* Start timer */
	var startTimer = function () {
		counter = document.getElementById('counter');
		count++;
		minutes = Math.floor(count / 60);
		seconds = count % 60 < 10 ? "0" + count % 60 : count % 60; 
		counter.innerHTML = minutes  + ':' + seconds;
    }
    
	/* Publicly returned object */
	return {
		init: function() {
            intervalID = setInterval(startTimer, 1000);
            sudokuBoard.makePlayerBoard();
            populateGrid();
            $("#grid").fadeIn(1000);
            $("#numPad").fadeIn(1000);
            setupEventHandlers();
		}
	};
})(sudokuBoard);

controller.init();


  