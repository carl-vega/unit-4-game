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
    $("#characters").empty();
    $("#antagonists").empty();
    $("#proHit").empty();
    $("#antHit").empty();
    $("#win-lose").empty();
    $("#proStatus").empty();
    $("#antStatus").empty();
    $("#pro").removeAttr("src");
    $("#ant").removeAttr("src");
    $("#select-pro h2").removeClass("d-none");
    $("#attackMessage").empty();
    characterGenerator(Object.keys(CHARACTERS), "#characters", "col-2");
    $("#select-pro .character").on("click", pickProtagonist);
    game = {};
  }

  // create characters
  function characterGenerator(keys, container, direction) {
    keys.forEach(function(key) {
      var element = $('<div class="card bg-dark"></div>');
      element
        .append('<img class="card-img" src="./assets/images/' + key + '.svg">')
        .append(
          '<div class="card-img-overlay d-flex"><div class="my-auto mx-auto text-center"><h4 class="card-text">' +
            CHARACTERS[key].health +
            "</h4></div></div>"
        );
      element.attr("id", key);
      element
        .addClass(direction)
        .addClass("character")
        .addClass("p-0");
      //element.find("img").addClass("card-img");
      element
        .find("h4")
        .addClass("text-white")
        .addClass("line-height-auto");
      $(container).append(element);
    });
  }

  // select character to play with
  function pickProtagonist(event) {
    if (!game || game.pro) return;
    var key = event.currentTarget.id;
    game.pro = Object.assign({ color: key }, CHARACTERS[key]);
    $("#pro").attr("src", "./assets/images/" + key + ".svg");
    $("#protagonist h4").html("❤️" + game.pro.health);
    $("#select-pro h2").addClass("d-none");
    $("#characters").empty();
    // add antagonists to their selection area
    keys = Object.keys(CHARACTERS);
    keys.splice(keys.indexOf(key), 1);
    characterGenerator(keys, "#antagonists", "row");
    $("#antagonists .character").on("click", pickAntagonist);
  }

  // select character to play against
  function pickAntagonist(event) {
    if (!game || game.ant) return;
    $("#attackMessage").text("Click Enemy to Attack");
    var key = event.currentTarget.id;
    game.ant = Object.assign({ color: key }, CHARACTERS[key]);
    $("#ant")
      .attr("src", "./assets/images/" + key + ".svg")
      .removeClass("d-none");
    $("#antagonist h4").html(game.ant.health + "❤️");
    $("#" + key).remove();
  }

  // attack
  function attack() {
    if (!game || !game.ant) {
      return;
    }
    $("#attackMessage").empty();
    // get attack values
    $("#proHit").html("<h2>" + game.pro.hit + "&rarr;</h2>");
    $("#antHit").html("<h2>&larr;" + game.ant.hit + "</h2>");
    game.ant.health = game.ant.health - game.pro.hit;
    game.pro.hit = game.pro.hit + game.pro.hitIncrease;

    if (game.ant.health > 0) {
      counterattack();
    } else {
      defeatAntagonist();
    }
  }

  function win() {
    $("#attackMessage")
      .html("You Won! YEAH BOI!!")
      .removeClass("d-none");
    game = null;
  }

  function lose() {
    $("#attackMessage")
      .html("You Lost. MWAHAHAHA")
      .removeClass("d-none");
    game = null;
  }

  // defeated the antagonist, check if won
  function defeatAntagonist() {
    $("#ant").addClass("d-none");
    $("#antagonist h4").html("Defeated");
    $("#proHit").empty();
    $("#antHit").empty();
    delete game.ant;
    if ($("#antagonists .character").length <= 0) {
      win();
    }
  }

  // not defeated, hit back
  function counterattack() {
    $("#antagonist h4").html(game.ant.health + "❤️");
    game.pro.health = game.pro.health - game.ant.hit;

    if (game.pro.health > 0) {
      // still battling, update health
      $("#protagonist h4").html("❤️" + game.pro.health);
    } else {
      lose();
    }
  }

  // call functions
  $("#ant").on("click", attack);
  $("#start").on("click", startGame);
  startGame();
});
