$(document).ready(function() {
  // variables
  var CHARACTERS = {
    red: {
      health: 115,
      hit: 11,
      hitIncrease: 5
    },
    green: {
      health: 100,
      hit: 9,
      hitIncrease: 7
    },
    blue: {
      health: 130,
      hit: 13,
      hitIncrease: 3
    },
    yellow: {
      health: 150,
      hit: 15,
      hitIncrease: 1
    }
  };

  var game;
  var keys;
  // functions
  // start
  function startGame() {
    characterGenerator(Object.keys(CHARACTERS), "#characters", "col");
    $("#select-pro .character").on("click", pickProtagonist);
    game = {};
  }

  // create characters
  function characterGenerator(keys, container, direction) {
    keys.forEach(function(key) {
      var element = $('<div><img src="./assets/images/' + key + '.svg"></div>');
      element.append("<h4>" + CHARACTERS[key].health + "</h4>");
      element.attr("id", key);
      element.addClass(direction).addClass("character");
      element.find("img").addClass("img-thumbnail");
      $(container).append(element);
    });
  }

  // select character to play with
  function pickProtagonist(event) {
    var key = event.currentTarget.id;
    game.pro = Object.assign({ color: key }, CHARACTERS[key]);
    $("#pro").attr("src", "./assets/images/" + key + ".svg");
    $("#protagonist h4").html(game.pro.health);
    $("#select-pro").addClass("d-none");
    $("#characters").empty();
    // add antagonists to their selection area
    keys = Object.keys(CHARACTERS);
    keys.splice(keys.indexOf(key), 1);
    characterGenerator(keys, "#antagonists", "row");
    $("#antagonists .character").on("click", pickAntagonist);
  }

  // select character to play against
  function pickAntagonist(event) {
    var key = event.currentTarget.id;
    game.ant = Object.assign({ color: key }, CHARACTERS[key]);
    $("#ant")
      .attr("src", "./assets/images/" + key + ".svg")
      .removeClass("d-none");
    $("#antagonist h4").html(game.ant.health);
    $("#" + key).remove();
  }

  // attack
  function attack() {
    if (!game || !game.ant) {
      return;
    }
    $("#proHit").html("<h2>" + game.pro.hit + "</h2>");
    $("#antHit").html("<h2>" + game.ant.hit + "</h2>");
    game.ant.health = game.ant.health - game.pro.hit;
    game.pro.hit = game.pro.hit + game.pro.hitIncrease;
    if (game.ant.health > 0) {
      $("#antagonist h4").html(game.ant.health);
      game.pro.health = game.pro.health - game.ant.hit;
    } else {
      $("#ant").addClass("d-none");
      $("#antagonist h4").html("Defeated");
      delete game.ant;
      if ($("#antagonists .character").length <= 0) {
        $("#win-lose").html("<h3>You Won!</h3><h4>YEAH BOI!!</h4>");
      }
    }
    if (game.pro.health > 0) {
      $("#protagonist h4").html(game.pro.health);
    } else {
      $("#win-lose").html("<h3>You Lost.</h3><h4>MWAHAHAHA</h4>");
    }
  }

  // call functions
  $("#ant").on("click", attack);
  startGame();
});
