//Math.floor(Math.random() * 430) + 10 

$(document).ready(function() {

    var trooperId = 0;
    var troopers = {};
    var game = {

        init: function(){
          this.podPosition = 0;
          this.podIncrement = 10;
          this.trooperCreateSpeed = 1000;
          this.trooperFallSpeed = 10;
          this.trooperInit();
        },

        podRight: function() {
            var pos = parseInt($("#pod").css('left'));
            this.podPosition = pos + 10;
            $("#pod").css('left', this.podPosition + 'px');
        },
        podLeft: function() {
            var pos = parseInt($("#pod").css('left'));
            this.podPosition = pos - 10;
            $("#pod").css('left', this.podPosition + 'px');
        },
        trooperInit: function() {

            this.trooperInitInterval = setInterval(createTrooper, this.trooperCreateSpeed);

            function createTrooper() {
                trooperId++;
                var trooperPos = Math.floor(Math.random() * 420) + 10;
                var newTrooper = '<div class="troopers" id=' + trooperId + '></div>';
                troopers[trooperId] = trooperPos;
                $(".container").append(newTrooper);
                $("#" + trooperId).css('left', trooperPos + 'px');
                game.trooperFall(trooperId);
            }
        },

        trooperFall: function(trooper) {
            var _this = this;
            var trooperFallInterval = setInterval(fall, this.trooperFallSpeed);
            var top = parseInt($("#" + trooper).css('top'));

            function fall() {
                top++;

                if (top === 295 && troopers[trooper] >= _this.podPosition && troopers[trooper] <= _this.podPosition + 75 - 20) {
                    console.log("collission");
                    console.log(trooper);
                    console.log(trooperFallInterval);
                    clearInterval(trooperFallInterval);

                } else if (top < 330) {

                    $("#" + trooper).css('top', top + 'px');

                } else {

                    clearInterval(trooperFallInterval);
                    $("#" + trooper).hide("slow");
                }
            }

        },

        checkCollission: function() {

        }


    };

    $(document).keydown(function(e) {
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
