//Math.floor(Math.random() * 430) + 10 
//begin game
$(document).ready(function () {
  var vwConvert = 100 / document.documentElement.clientWidth;
  var vhConvert = 100 / document.documentElement.clientHeight;
  console.log(vwConvert);
  console.log(vhConvert);
  //define the pod object
  var pod = {
    //initialize pod speed and position
    init: function () {
      this.podPosition = 0;
      this.podSpeed = Math.floor(100 * vwConvert);
      this.pod = $("#pod");
      this.podWidth = Math.floor(parseInt(this.pod.css('width')) * vwConvert);
      this.podBorder = Math.floor(parseInt(this.pod.css('border-right')) * vwConvert);
    },
    //move pod to the right
    moveRight: function () {
      var pos = Math.floor(parseInt(this.pod.css('left')) * vwConvert);
      this.podPosition = pos + this.podSpeed;
      this.updatePodPosition();
    },
    //move pod to the left
    moveLeft: function () {
      var pos = Math.floor(parseInt(this.pod.css('left')) * vwConvert);
      this.podPosition = pos - this.podSpeed;
      this.updatePodPosition();
    },
    //return current podposition i.e left of the pod
    getPodPosition: function () {
      return this.podPosition;
    },
    //set the width of the pod, to be called when there is collission with powerups and danger
    setPodWidth: function (multiplier) {
      this.podWidth = this.podWidth * multiplier;
      this.pod.css('width', this.podWidth + 'vw');
    },
    //called on keypress to control the pod from moving out of the border.
    updatePodPosition: function () {
      if (this.podPosition < 0) {
        this.podPosition = 0;
      }
      if (this.podPosition + this.podWidth > 100) {
        this.podPosition = 100 - this.podWidth - this.podBorder*2;
      }
      this.pod.css('left', this.podPosition + 'vw');
    }
  };
  //generic falling object the argument x will contain the style to be applied trooper powerup etc.
  var FallingObject = function (x) {
    this.type = x;
    //2 objects could be created at the same time so time is not dependable add a random number
    this.id = Date.now() + Math.floor(Math.random() * 10000) + 1000;
    this.html = '<div class="' + this.type + '" id=' + this.id + '></div>';
    this.fallTimer = 10;
    this.fallSpeed = Math.floor(Math.random() * 3) + 1;
    this.pos = Math.floor(Math.random() * 85) + 10;
    this.points = this.fallSpeed * 10;
    $(".container").append(this.html);
    $("#" + this.id).css('left', this.pos + 'vw');
    $("#" + this.id).attr('data-content', this.points);
  };
  //game object to control the game play
  var game = {
    //initialize the game by initializing pod and troopercreate speed and being trooper creation
    init: function () {
      this.trooperCreateSpeed = 2000;
      this.powerCreateSpeed = 20000;
      this.dangerCreateSpeed = 15000;
      this.negativePointsFactor = 4;
      this.powerupFactor = 1.3;
      this.dangerFactor = 0.7;
      this.fallSpeedFactor = 2;
      this.trooperInit();
      this.powerUpInit();
      this.dangerInit();
      this.scoreDiv = $("#points");
      this.score = 0;
      pod.init();
    },
    //create troopers
    trooperInit: function () {
      this.trooperInitInterval = setInterval(createTrooper, this.trooperCreateSpeed);

      function createTrooper() {
        trooper = new FallingObject("trooper");
        game.startFall(trooper);
      };
    },
    //create powerup items
    powerUpInit: function () {
      this.powerInitInterval = setInterval(createPower, this.powerCreateSpeed);

      function createPower() {
        power = new FallingObject("powerup");
        game.startFall(power);
      }
    },
    //create danger items
    dangerInit: function () {
      this.dangerInitInterval = setInterval(createDanger, this.dangerCreateSpeed);

      function createDanger() {
        danger = new FallingObject("danger");
        game.startFall(danger);
      }
    },
    //being fall of created items
    startFall: function (elem) {
      var _this = this;
      elem.FallInterval = setInterval(fall, elem.fallTimer);

      function fall() {
        var top = Math.floor(parseInt($("#" + elem.id).css('top'))) * vhConvert;
        top += (elem.fallSpeed) / _this.fallSpeedFactor;
        console.log(top);
        if (top >= 78 && top <= 80 && elem.pos +7 >= pod.getPodPosition() && elem.pos <= pod.getPodPosition() + pod.podWidth) {
          console.log("collission detected" + elem.pos + pod.getPodPosition() + top);
          clearInterval(elem.FallInterval);
          _this.handleCollission(elem);
        } else if (top < 90) {
          $("#" + elem.id).css('top', top + 'vh');
        } else {
          _this.handleDead(elem);
        }
      }
    },
    //need to sepearte the collission function
    handleCollission: function (e) {
      clearInterval(e.FallInterval);
      if (e.type === "trooper") {
        $("#" + e.id).addClass("alive");
        this.updateScore(e);
      }
      if (e.type === "powerup") {
        pod.setPodWidth(this.powerupFactor);
      }
      if (e.type === "danger") {
        pod.setPodWidth(this.dangerFactor);
      }
      this.removeObject(e);
    },
    handleDead: function (e) {
      clearInterval(e.FallInterval);
      if ($("#" + e.id).hasClass('trooper')){
        $("#" + e.id).addClass("dead");
      }
      this.updateScore(e, true);
      this.removeObject(e);
    },
    removeObject: function (e) {
      setTimeout(function () {
        $("#" + e.id).remove();
        delete e;
      }, 1000);
    },
    updateScore: function (e, dead) {
      var score = (dead ? Math.floor(e.points / this.negativePointsFactor) : e.points);
      this.score = (dead ? this.score -= score : this.score += score);
      var plusminus = (dead ? "-" : "+");
      $('#' + e.id).html(plusminus + score);
      (this.scoreDiv).html(this.score);
    },
    stopGame: function () {
      clearInterval(this.trooperInitInterval);
      clearInterval(this.powerInitInterval);
      clearInterval(this.dangerInitInterval);
      $('.trooper').each(function () {
        $(this).remove();
      });
      $('.powerup').each(function () {
        $(this).remove();
      });
      $('.danger').each(function () {
        $(this).remove();
      });
      $('#score').hide();
    }
  };
  $(document).keydown(function (e) {
    switch (e.which) {
    case 37: // left
      pod.moveLeft();
      break;
    case 39: // right
      pod.moveRight();
      break;
    default:
      return; // exit this handler for other keys
    }
    e.preventDefault();
  });
  game.init();
  $("#start").click(function () {
    game.init();
  });
  //check for keypress
  $("#stop").click(function () {
    game.stopGame();
  });
});
