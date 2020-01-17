function generateSudoku() {

	var grid = [
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

	var hGrid = [
			[0, 0, 0,  0, 0, 0,  0, 0, 0], 
			[0, 0, 0,  0, 0, 0,  0, 0, 0], 
			[0, 0, 0,  0, 0, 0,  0, 0, 0], 

			[0, 0, 0,  0, 0, 0,  0, 0, 0], 
			[0, 0, 0,  0, 0, 0,  0, 0, 0], 
			[0, 0, 0,  0, 0, 0,  0, 0, 0],

			[0, 0, 0,  0, 0, 0,  0, 0, 0], 
			[0, 0, 0,  0, 0, 0,  0, 0, 0], 
			[0, 0, 0,  0, 0, 0,  0, 0, 0]
		];

	shuffle(grid);
	hideTiles(grid, hGrid);

	this.getTileNumber = function(row, col) {
		return hGrid[row][col];
	};

	this.getSolution = function(row, col) {
		return grid[row][col];
	};

	this.isValid = function(fGrid, row, col, val) {
		var rowCnt = this.countInstances(fGrid[row], val);
		var colCnt = this.countInstances(this.columnToArray(fGrid, col), val);
		var subCnt = this.countInstances(this.subsquareToArray(fGrid, row, col), val);
		if(rowCnt == 1 && colCnt == 1 && subCnt == 1) {
			return true;
		}
		return false;
	};

	this.columnToArray = function(fGrid, col) {
		var colArray = [];
		for(var i = 0; i < 9; i++) {
			colArray.push(fGrid[i][col]);
		}
		return colArray;
	};

	this.subsquareToArray = function(fGrid, row, col) {
		var subArray = [];
		var subrow = row - (row % 3);
		var subcol = col - (col % 3);
		for(var i = 0; i < 3; i++) {
			for(var j = 0; j < 3; j++) {
				subArray.push(fGrid[i+subrow][j+subcol]);
			}
		}
		return subArray;
	};

	this.countInstances = function(arr, val) {
		var cnt = 0;
		for(var i = 0; i < arr.length; i++) {
			if(arr[i] == val) cnt++;
		}
		return cnt;
	};
}

function shuffle(grid) {

	var i, j, k, temp, col, col1, col2,
	row1, row2, sub, sub1, sub2, num1, num2;

	//swap the same columns of each subsquare
	for(i = 0; i < 25; i++) {
		col = Math.floor(Math.random()*3);
		sub1 = Math.floor(Math.random()*3);
		sub2 = Math.floor(Math.random()*3);
		for(j = 0; j < grid.length; j++) {
			temp = grid[j][col + sub1*3];
			grid[j][col + sub1*3] = grid[j][col + sub2*3];
			grid[j][col + sub2*3] = temp;
		}
	}

	//swap all columns within each subsquare
	for(i = 0; i < 25; i++) {
		sub = Math.floor(Math.random()*3);
		col1 = Math.floor(Math.random()*3);
		col2 = Math.floor(Math.random()*3);
		while(col1 == col2) col2 = Math.floor(Math.random()*3);
		for(j = 0; j < grid.length; j++) {
			temp = grid[j][sub*3 + col1];
			grid[j][sub*3 + col1] = grid[j][sub*3 + col2];
			grid[j][sub*3 + col2] = temp;
		}
	}

	//swap all rows within each subsquare
	for(i = 0; i < 25; i++) {
		sub = Math.floor(Math.random()*3);
		row1 = Math.floor(Math.random()*3);
		row2 = Math.floor(Math.random()*3);
		while(row1 == row2) row2 = Math.floor(Math.random()*3);
		for(j = 0; j < grid.length; j++) {
			temp = grid[sub*3 + row1][j];
			grid[sub*3 + row1][j] = grid[sub*3 + row2][j];
			grid[sub*3 + row2][j] = temp;
		}
	}

	//swap one number with another
	for(i = 0; i < 25; i++) {
		num1 = Math.floor(Math.random()*9 + 1);
		num2 = Math.floor(Math.random()*9 + 1);
		while(num1 == num2) num2 = Math.floor(Math.random()*9 + 1);
		for(j = 0; j < grid.length; j++) {
			for(k = 0; k < grid[j].length; k++) {
				if(grid[j][k] == num1)
					grid[j][k] = num2;
				else if(grid[j][k] == num2)
					grid[j][k] = num1;
			}
		}
	}
}

function hideTiles(aGrid, hiddenGrid) {

	// Randomly hide tiles, no guarantee for a unique solution
	var numTiles, k;

	for(var c = 0; c < 9; c++) {
		for(var d = 0; d < 9; d++) {
			hiddenGrid[c][d] = aGrid[c][d];
		}
	}

	for(var i = 0; i < 4; i++) {
		numTiles = Math.floor(Math.random()*8 + 6);
		while(numTiles > 0) {
			k = Math.floor(Math.random()*9);
			hiddenGrid[i][k] = 0;
			hiddenGrid[8-i][8-k] = 0;
			numTiles--;
			
		}
	}

	numTiles = Math.floor(Math.random()*4 + 2);
	while(numTiles > 0) {
		k = Math.floor(Math.random()*4);
		hiddenGrid[4][k] = 0;
		hiddenGrid[4][8-k] = 0;
		numTiles--;
	}
}


var puzzle;
var selectedTile;
var r, c;

$(document).ready(function() {
    init();
    $("#grid").fadeIn(1000);
    $(".emptyCell").click(function(e) {
        r = selectedTile.getAttribute('id').charAt(1);
		c = selectedTile.getAttribute('id').charAt(4);
		console.log('hello');
		console.log(r);
		console.log(c);
        //$("#numPad").fadeIn(100);
        //$("#numPad").offset({left: e.pageX - 78,top: e.pageY - 40});
	});
	/*
    $("#np1").click(function() { numberPad(1); });
    $("#np2").click(function() { numberPad(2); });
    $("#np3").click(function() { numberPad(3); });
    $("#np4").click(function() { numberPad(4); });
    $("#np5").click(function() { numberPad(5); });
    $("#np6").click(function() { numberPad(6); });
    $("#np7").click(function() { numberPad(7); });
    $("#np8").click(function() { numberPad(8); });
    $("#np9").click(function() { numberPad(9); });
    $("#npx").click(function() { numberPad(""); });
    $(".mistakeScreen").click(function() {
        $(".mistakeScreen").fadeOut(100);
    });
    $("#newGame").click(function() { newGame(); });
    $("#solve").click(function() {
        $("#numPad").fadeOut(100);
        solve();
	});
	*/
    
});


function init() {
    puzzle = new generateSudoku();
    for(var i = 0; i < 9; i++) {
        for(var j = 0; j < 9; j++) {
			var tile = document.getElementById("r" + i + "-c" + j);
			console.log('init');
            if(puzzle.getTileNumber(i, j) === 0) {
                tile.className = "emptyCell";
                tile.innerHTML = "";
                tile.onclick = tOnClick;
            }
            else {
                tile.style.backgroundColor = "#ecf4f3";
                tile.className = "cell";
                tile.innerHTML = puzzle.getTileNumber(i, j);
            }
        }
    }
}

function tOnClick() {
    if(selectedTile == null) {
        selectedTile = this;
        selectedTile.className = "emptyCell selected";
    }
    else {
        deselect();
        //$("#numPad").fadeOut(100);
    }
}
/*
function numberPad(value) {
    selectedTile.innerHTML = value;
    deselect();
    $("#numPad").fadeOut(100);
    if(checkForEmptyCells() === true) {
        var fGrid = getFinishedGrid();
        for(var i = 0; i < 9; i++) {
            for(var j = 0; j < 9; j++) {
                var t = document.getElementById("t" + i + "x" + j);
                if(t.classList.contains("emptyCell")) {
                    if(puzzle.isValid(fGrid, i, j, t.innerHTML)) {
                        continue;
                    }
                    else {
                        $(".mistakeScreen").fadeIn(100);
                        return;
                    }
                }
            }
        }
        $(".winScreen").fadeIn(100);
        return;
    }
}
*/
function getFinishedGrid() {
    var fGrid = new Array(9);
    for(var i = 0; i < 9; i++) {
        fGrid[i] = new Array(9);
        for(var j = 0; j < 9; j++) {
            fGrid[i][j] = document.getElementById("t" + i + "x" + j).innerHTML;
        }
    }
    return fGrid;
}

function checkForEmptyCells() {
    for(var l = 0; l < 9; l++) {
        for(var k = 0; k < 9; k++) {
            var tile = document.getElementById("t" + l + "x" + k);
            if(tile.innerHTML == "") return false;
        }
    }
    return true;
}

function deselect() {
    selectedTile.className = "emptyCell";
    //selectedTile = null;
}

function newGame() {
    location.reload();
}

function solve() {
    for(var i = 0; i < 9; i++) {
        for(var j = 0; j < 9; j++) {
            var tile = document.getElementById("t" + i + "x" + j);
            tile.innerHTML = puzzle.getSolution(i, j);
        }
    }
}

var model = (function() {
	// Private variables 
	var template = [
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

	var hGrid = [
		[0, 0, 0,  0, 0, 0,  0, 0, 0], 
		[0, 0, 0,  0, 0, 0,  0, 0, 0], 
		[0, 0, 0,  0, 0, 0,  0, 0, 0], 

		[0, 0, 0,  0, 0, 0,  0, 0, 0], 
		[0, 0, 0,  0, 0, 0,  0, 0, 0], 
		[0, 0, 0,  0, 0, 0,  0, 0, 0],

		[0, 0, 0,  0, 0, 0,  0, 0, 0], 
		[0, 0, 0,  0, 0, 0,  0, 0, 0], 
		[0, 0, 0,  0, 0, 0,  0, 0, 0]
	];

	// Private functions
	var getTileNumber = function(row, col) {
		return hGrid[row][col];
	};

	var getSolution = function(row, col) {
		return grid[row][col];
	};

	var isValid = function(fGrid, row, col, val) {
		var rowCnt = this.countInstances(fGrid[row], val);
		var colCnt = this.countInstances(this.columnToArray(fGrid, col), val);
		var subCnt = this.countInstances(this.subsquareToArray(fGrid, row, col), val);
		if(rowCnt == 1 && colCnt == 1 && subCnt == 1) {
			return true;
		}
		return false;
	};

	var columnToArray = function(fGrid, col) {
		var colArray = [];
		for(var i = 0; i < 9; i++) {
			colArray.push(fGrid[i][col]);
		}
		return colArray;
	};

	var subsquareToArray = function(fGrid, row, col) {
		var subArray = [];
		var subrow = row - (row % 3);
		var subcol = col - (col % 3);
		for(var i = 0; i < 3; i++) {
			for(var j = 0; j < 3; j++) {
				subArray.push(fGrid[i+subrow][j+subcol]);
			}
		}
		return subArray;
	};

	var countInstances = function(arr, val) {
		var cnt = 0;
		for(var i = 0; i < arr.length; i++) {
			if(arr[i] == val) cnt++;
		}
		return cnt;
	};


	/* Public object */
	return {
		getTemplate: function() {
			return template;
		},
		shuffle: function() {

		},
		hide: function() {

		}
	};
})();

var view = (function() {
	var DOMstrings = {
        counter: 'counter',
	};
	
	/* Public object */
	return {
		getDOMstrings: function() {
            return DOMstrings;
        }
	};
})();

var controller = (function(m, v) {
	/* Private variables */
	var DOM = v.getDOMstrings();
	count = 0;

	/* Private functions */

	/* Set up event listeners */


	/* */
	var createBoard = function() {

	}

	/* Start timer */
	var startTimer = function () {
		counter = document.getElementById(DOM.counter);
		count++;
		minutes = Math.floor(count / 60);
		seconds = count % 60 < 10 ? "0" + count % 60 : count % 60; 
		counter.innerHTML = minutes  + ':' + seconds;
	}

	/* Publicly returned object */
	return {
		init: function() {
			console.log('Application has started.');
			setInterval(startTimer, 1000);
		}
	};
})(model, view);

controller.init();