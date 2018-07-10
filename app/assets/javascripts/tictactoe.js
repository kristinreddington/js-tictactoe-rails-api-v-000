var turn = 0;
var gameID = 0;

WINNING_COMBINATIONS = [
[0, 1, 2], [3, 4, 5],
[6, 7, 8], [0, 4, 8],
[2, 4, 6], [0, 3, 6],
[1, 4, 7], [2, 5, 8],
]

var player = () => turn % 2 === 0 ? "X" : "O"

function updateState(square) {
  square.innerHTML = player()
  return square;
}

var setMessage = (string) => $("#message").html(string)

function checkWinner() {
  var board = []
  var winner = false
  $('td').text((index, content) => {
    board.push(content)
  });
   WINNING_COMBINATIONS.some(function (array) {
     if (board[array[0]] !== '' && board[array[0]] === board[array[1]] && board[array[1]] === board[array[2]]) {
       setMessage(`Player ${board[array[0]]} Won!`)
        winner = true;
     }
     if (winner === true) {
       return true } else {
      return false }
   })
   return winner
  }

  function resetBoard() {
    $("td").empty();
    turn = 0;
    gameID = 0;
  }

function doTurn(square) {
  if (validMove(square)) {
  updateState(square)
  turn++
  switch (checkWinner()) {
      case true:
        resetBoard();
      case false:
        if (turn === 9) {
          setMessage("Tie game.");
          resetBoard();
          }
        }
      }
    }

  function saveGame() {
    var board = [];
    var gamedata = {state: board};
    $('td').text((index, content) => {
      board.push(content)})
      if (!!gameID) {
        $.ajax ({
          type: "PATCH",
          url: `/games/${gameID}`,
          data: gamedata
        });
       } else {
         $.post("/games", gamedata, function(game) {
           gameID = game.data.id;
           addButton(game);
         });
       }
    }

    function updateBoard(game){
      var gameState = game.data.attributes.state
      for (let index = 0; index < gameState.length; index++) {
    $("table td").eq(`${index}`).text(`${gameState[index]}`);
    };
  }

    function resetGame(gameID) {
      $.get(`/games/${gameID}`).done(function(game){
        updateBoard(game)
      })
    }

    function addButton(game) {
      var button =  `<button id="${game.id}">${game.id}</button><br>`
      $('#games').append(button)
    }

    function previousGames() {
      $("#games").empty();

      $.get('/games').done(function(data) {
        var games = data.data;
        games.forEach(addButton);
    });
  }


    function validMove(square) {
      if (square.innerHTML === '') {
        return true; } else {
          return false;
        }
      }

$(document).ready(function() {
  attachListeners();
});

 function attachListeners() {
   $('#clear').on('click', () => resetBoard());
   $('#save').on('click', () => saveGame());
   $('#previous').on('click', () => previousGames());
   $('td').on('click', function() {
      doTurn(this)
    });
    $("#games").on('click', 'button', function(e) {
    var gameId = $(e.target).attr('id');
    savedGame(gameId);
  });
  }
