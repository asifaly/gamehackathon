//Math.floor(Math.random() * 430) + 10 

$(document).ready(function() {

    var trooperId = 0;

    var game = {
        podRight: function() {
            var pos = parseInt($("#pod").css('left'));
            console.log(pos);
            $("#pod").css('left', pos + 10 + 'px');
        },
        podLeft: function() {
            var pos = parseInt($("#pod").css('left'));
            $("#pod").css('left', pos - 10 + 'px');
        },
        trooperInit: function() {

            this.trooperInitInterval = setInterval(createTrooper, 2000);

            function createTrooper() {
                trooperId++;
                var trooperPos = Math.floor(Math.random() * 420) + 10;
                var newTrooper = '<div class="troopers" id=' + trooperId + '></div>';
                $(".container").append(newTrooper);
                $("#" + trooperId).css('left', trooperPos + 'px');
                game.trooperFall(trooperId);
            }
        },

        trooperFall: function(trooper) {

            var trooperFallInterval = setInterval(fall, 10);
            console.log(trooperFallInterval);
            var top = parseInt($("#" + trooper).css('top'));
            //$('#'+trooper).attr('id',trooperFallInterval);
            function fall() {

                if (top < 330) {
                    top++;
                    $("#" + trooper).css('top', top + 'px');
                } else {
                    clearInterval(trooperFallInterval);
                    $("#"+trooper).hide("slow");
                }
            }

        },

        detectCollission: function(trooper) {

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

            case 32: //space
                game.stop();
                break;

            default:
                return; // exit this handler for other keys
        }
        e.preventDefault();
    });

    game.trooperInit();

});
