//Math.floor(Math.random() * 430) + 10 

$(document).ready(function () {

  var trooperId = 0;
  var troopers = {};
  var game = {

    init: function () {
      this.podPosition = 0;
      this.podSpeed = 50;
      this.trooperCreateSpeed = 3000;
      this.trooperFallSpeed = 20;
      this.trooperInit();
    },

    podRight: function () {
      var pos = parseInt($("#pod").css('left'));
      this.podPosition = pos + this.podSpeed;
      $("#pod").css('left', this.podPosition + 'px');
    },
    podLeft: function () {
      var pos = parseInt($("#pod").css('left'));
      this.podPosition = pos - this.podSpeed;
      $("#pod").css('left', this.podPosition + 'px');
    },
    trooperInit: function () {

      this.trooperInitInterval = setInterval(createTrooper, this.trooperCreateSpeed);

      function createTrooper() {
        trooperId++;
        var trooperPos = Math.floor(Math.random() * 420) + 10;
        var newTrooper = '<div class="troopers" id=' + trooperId + '></div>';
        troopers["#"+trooperId] = trooperPos;
        $(".container").append(newTrooper);
        $("#" + trooperId).css('left', trooperPos + 'px');
        game.trooperFall("#"+trooperId);
      }
    },

    trooperFall: function (trooper) {
      var _this = this;
      var trooperFallInterval = setInterval(fall, this.trooperFallSpeed);
      var top = parseInt($(trooper).css('top'));

      function fall() {
        top++;

        if (top === 285 && troopers[trooper] + 10 >= _this.podPosition && troopers[trooper] <= _this.podPosition + 105 - 30) {
          clearInterval(trooperFallInterval);
          // $(trooper).addClass("alive");
          setTimeout(function () {
            $(trooper).remove();
          }, 1000);


        } else if (top < 320) {

          $(trooper).css('top', top + 'px');

        } else {

          clearInterval(trooperFallInterval);
          trooper % 2 === 0 ? $(trooper).addClass("dead1") : $(trooper).addClass("dead2");
          setTimeout(function () {
            $(trooper).remove();
          }, 1000);
        }

      }

    },

    checkCollission: function () {

    },


  };

  $(document).keydown(function (e) {
    switch (e.which) {
    case 37: // left
      game.podLeft();
      break;

    case 39: // right
      game.podRight();
      break;

    default:
      return; // exit this handler for other keys
    }
    e.preventDefault();
  });

  game.init();

});
