//////////////////////////////////////////
// Tic Tac Toe (Work in Progress)
// Engin Erdogan
// May 2, 2013
//////////////////////////////////////////
// TODO
// - Improve object model
// - Improve AI strategy for the computer
// - Clean up the code
//////////////////////////////////////////

$(document).ready(function(){

    //$(".box").each(function () { $(this).text($(this).attr('id')) });

    function Player(name, selector, color) {
        this.name = name || "";
        this.moves = [];
        this.chances = [];
        this.selector = selector || "x";
        this.color = color;
    }

    // Setup
    window.players = [];
    var user = new Player('user', 'O', 'green');
    var computer = new Player('computer', 'X', 'pink');
    players.push(user);
    players.push(computer);

    // Trackers for the board and moves
    var board = ['A1', 'B1', 'C1', 'A2', 'B2', 'C2', 'A3', 'B3', 'C3'];
    var wins = ['A1A2A3', 'B1B2B3', 'C1C2C3', 'A1B1C1', 'A2B2C2', 'A3B3C3', 'A1B2C3', 'C1B2A3'];
    var moves = 1;
    var currentPlayer = players[0];
    var game = 1;

    // Handle clicks
    $(".box").click(function (event) {
        if (getCurrentPlayer() === user && game == 1) usersMove(event.target.id);
    });

    // *** MOVES *** 
    // With every move, these functions update the state of the board

    function usersMove(boxId) {
        if (validMove(boxId) === true) {
            makeMove(user, boxId);
        } else alert('taken');
    }

    function computersMove() {
        makeMove(computer, getBestNextMove(computer));
    }

    function validMove(boxId) {
        return (board.indexOf(boxId) != -1);
    }

    function markBox(player, boxId) {
        $("#" + boxId).text(player.selector).addClass(player.color);
    }

    function updateBoard(boxId) {
        board.splice(board.indexOf(boxId), 1);
    }

    function updateMoves(player, boxId) {
        moves = moves + 1;
        player.moves.push(boxId);
    }

    function makeMove(player, boxId) {
        if (moves < 10) {
            markBox(player, boxId);
            updateBoard(boxId);
            updateMoves(player, boxId);
            addChances(player, boxId);
            removeChances(getOtherPlayer(), boxId);
            if (checkWin(getCurrentPlayer(), boxId) === false) {         
                getBestNextMove(player);
                setTimeout(function () { nextTurn() }, 500);
            }
        } else endGame("Nobody");
    }

    // *** TRACK AND UPDATE USER'S CHANCES *** 

    // Add to current player chances array
    function addChances(player, boxId) {
        for (var i = 0; i < wins.length; i++) {
            if (wins[i].indexOf(boxId) !== -1 && player.chances.indexOf(wins[i]) === -1 && getOtherPlayer().chances.indexOf(wins[i]) === -1) {
                player.chances.push(wins[i]);
                wins.splice(wins.indexOf(wins[i]), 1);
                i--;
            }
        }
    }

    // Eliminate arrays from other player chances array
    function removeChances(player, boxId) { 
        for (var i = 0; i < player.chances.length; i++) {
            if (player.chances[i].indexOf(boxId) !== -1) {
                player.chances.splice(player.chances.indexOf(player.chances[i]), 1);
                i--;
            }
        }
    }

    // *** FIND THE BEST NEXT MOVE *** 

    function getBestNextMove(player) {
        var c = player.chances;
        var m = player.moves;
        for (var i = 0; i < c.length; i++) {
            for (var j = 0; j < m.length; j++) {
                if (c[i].indexOf(m[j]) != -1) {
                    c[i] = c[i].replace(m[j], "");
                }
            }
        }
        if (c.length > 0 && c[0].length == 2) { 
            return c[0];
        } else return sortMoves();
    }

    function sortMoves(){
        var scores = [];
        var bestMoves = [];
        
        // rank moves based on score
        for (var i = 0; i < board.length; i++) {
            scores.push({ 'boxId' : board[i], 'val' : rankMove(board[i]) });
        }
        scores.sort(function(a,b) {
            return b.val - a.val;
        });
        
        // get all options with the highest score
        for (var i = 0; i< scores.length; i++) {
            if (scores[i].val == scores[0].val) {
                bestMoves.push(scores[i]['boxId']);
            }
        }
        
        // select a random one from the highest score options
        var moveIndex = Math.floor(Math.random()*bestMoves.length);
        return scores[moveIndex].boxId;
    }

    function rankMove(boxId) {
        var score = 0;
        for (var p = 0; p < players.length; p++) {
            var c = players[p].chances;
            for (var i = 0; i < c.length; i++) {
                if (c[i].indexOf(boxId) !== -1) {
                    score += 1;
                    // if user is one step away from winning, increase chances
                    if (c[i].length == 2) score += 5;
                }
            }
        }
        return score;
    }

    function sortByLength(arr) {
        arr.sort(function(a, b){
          return a.length - b.length;
        });    
        return arr;
    }

    // *** SETTERS & GETTERS

    function getCurrentPlayer() {
        return currentPlayer;
    }

    function setCurrentPlayer(player) {
        currentPlayer = player;
        return currentPlayer;
    }

    function getOtherPlayer() {
        if (getCurrentPlayer() == players[0]) {
            return players[1];
        } else return players[0];
    }

    function nextTurn() {
            if (getCurrentPlayer() === players[0]) {
                setCurrentPlayer(players[1]);
                computersMove();
            } else setCurrentPlayer(players[0]);
    }

    // *** CHECK FOR WINNERS, CONTINUE/END

    function checkWin(player, boxId) {
        var c = player.chances;
        for (var i = 0, tot = c.length; i < tot; i++) {
            if (c[i].length == 2 & c[i] == boxId ) {
                endGame(player);
                return true;
            }
        }
        if (board.length == 0 && game == 1) {
            endGame();
            return true;
        }
        return false;
    }

    function endGame(winner) {
        game = 0;
        if (winner) {
            alert(winner.name + " wins!");
        } else alert("it's a draw!");
    }
});