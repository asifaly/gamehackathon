/*globals $:false */
$(document).ready(function () {
  //jquery reports width/left etc in pixels, this if a factor to convert it to vh and vw
  var vwConvert = 100 / document.documentElement.clientWidth;
  var vhConvert = 100 / document.documentElement.clientHeight;
  //define the pod object
  var pod = {
    //initialize pod speed and position
    init: function () {
      this.podPosition = 0;
      this.podSpeed = Math.floor(30 * vwConvert); //50 pixels to vw
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
        this.podPosition = 100 - this.podWidth - this.podBorder * 2;
      }
      this.pod.css('left', this.podPosition + 'vw');
    }
  };
  //Generic constructor to create new falling objects in the game.
  var FallingObject = function (x) {
    this.type = x;
    this.id = Date.now() + Math.floor(Math.random() * 10000) + 1000;
    this.html = '<div class="base ' + this.type + '" id=' + this.id + '></div>';
    this.fallTimer = 10;
    this.fallSpeed = Math.floor(Math.random() * 3) + 1;
    this.pos = Math.floor(Math.random() * 85) + 10;
    this.points = this.fallSpeed * 10;
    $(".container").append(this.html);
    $("#" + this.id).css('left', this.pos + 'vw');
    $("#" + this.id).attr('data-content', this.points);
  };

  FallingObject.prototype.handleFall = function () {
    var _this = this;
    this.FallInterval = setInterval(fall, this.fallTimer);

    function fall() {
      var top = Math.floor(parseInt($("#" + _this.id).css('top'))) * vhConvert;
      top += (_this.fallSpeed) / 2;
      if (top >= 78 && top <= 80 && _this.pos + 7 >= pod.getPodPosition() && _this.pos <= pod.getPodPosition() + pod.podWidth) {
        clearInterval(_this.FallInterval);
        _this.handleCollission();
      } else if (top < 90) {
        $("#" + _this.id).css('top', top + 'vh');
      } else {
        _this.handleDead();
      }
    }
  };

  FallingObject.prototype.handleCollission = function () {
    clearInterval(this.FallInterval);
    //add class alive which removes the background and updates score
    if (this.type === "trooper") {
      $("#" + this.id).addClass("alive");
      game.updateScore(this);
    }
    //increase the podWidth
    if (this.type === "powerup") {
      pod.setPodWidth(game.powerupFactor);
    }
    //decrease the podWidth
    if (this.type === "speed") {
      pod.podSpeed *= game.podSpeedFactor;
    }
    //increase podspeed
    if (this.type === "danger") {
      pod.setPodWidth(game.dangerFactor);
    }
    //double the podWidth for 10 and remove all danger items
    if (this.type === "super") {
      pod.setPodWidth(game.powerupFactor + 0.7);
      $('.danger').each(function () {
        $(this).remove();
      });
      setTimeout(function () {
        game.dangerInit();
        pod.setPodWidth(0.5);
      }, 10000);
    }
    this.removeObject();
  };
  FallingObject.prototype.handleDead = function () {
    clearInterval(this.FallInterval);
    if ($("#" + this.id).hasClass('trooper')) {
      $("#" + this.id).addClass("dead");
      game.updateScore(this, true);
    }
    this.removeObject();
  };
  //function to remove the objects
  FallingObject.prototype.removeObject = function () {
    var elem = this;
    setTimeout(function () {
      $("#" + elem.id).remove();
    }, 1000);
  };
  //game object to control the game play
  var game = {
    //initialize the game by initializing pod and troopercreate speed and being trooper creation
    init: function () {
      this.trooperCreateSpeed = 2000;
      this.powerCreateSpeed = 20000;
      this.dangerCreateSpeed = 15000;
      this.superCreateSpeed = 40000;
      this.speedCreateSpeed = 30000;
      this.negativePointsFactor = 4;
      this.superPowerUpFactor = 2;
      this.powerupFactor = 1.3;
      this.dangerFactor = 0.7;
      this.fallSpeedFactor = 2;
      this.podSpeedFactor = 1.2;
      this.trooperInit();
      this.powerUpInit();
      this.dangerInit();
      this.superPowerInit();
      this.speedPowerInit();
      this.scoreDiv = $("#points");
      this.score = 0;
      pod.init();
    },
    //create troopers
    trooperInit: function () {
      this.trooperInitInterval = setInterval(createTrooper, this.trooperCreateSpeed);

      function createTrooper() {
        var trooper = new FallingObject("trooper");
        trooper.handleFall();
      }
    },
    //create powerup items
    powerUpInit: function () {
      this.powerInitInterval = setInterval(createPower, this.powerCreateSpeed);

      function createPower() {
        var power = new FallingObject("powerup");
        power.handleFall();
      }
    },
    //create danger items
    dangerInit: function () {
      this.dangerInitInterval = setInterval(createDanger, this.dangerCreateSpeed);

      function createDanger() {
        var danger = new FallingObject("danger");
        danger.handleFall();
      }
    },
    //create superpower items
    superPowerInit: function () {
      this.superInitInterval = setInterval(createSuperPower, this.superCreateSpeed);

      function createSuperPower() {
        var superPower = new FallingObject("super");
        superPower.handleFall();
      }
    },
    speedPowerInit: function () {
      this.speedInitInterval = setInterval(createSpeedPower, this.speedCreateSpeed);

      function createSpeedPower() {
        var speedPower = new FallingObject("speed");
        speedPower.handleFall();
      }
    },
    updateScore: function (e, dead) {
      var score = (dead ? Math.floor(e.points / this.negativePointsFactor) : e.points);
      this.score = (dead ? this.score -= score : this.score += score);
      var plusminus = (dead ? "-" : "+");
      $('#' + e.id).html(plusminus + score);
      (this.scoreDiv).html(this.score);
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
});
