//Math.floor(Math.random() * 430) + 10 
//begin game
$(document).ready(function () {
  $("#start").click(function () {
    game.init();
    //check for keypress
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
  });
  $("#stop").click(function () {
    game.stopGame();
  });
});
//define the pod object
var pod = {
  //initialize pod speed and position
  init: function () {
    this.podPosition = 0;
    this.podSpeed = 50;
    this.pod = $("#pod");
    this.podWidth = parseInt(this.pod.css('width'));
    this.podBorder = parseInt(this.pod.css('border-right'));
  },
  //move pod to the right
  moveRight: function () {
    var pos = parseInt(this.pod.css('left'));
    this.podPosition = pos + this.podSpeed;
    this.updatePodPosition();
  },
  //move pod to the left
  moveLeft: function () {
    var pos = parseInt(this.pod.css('left'));
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
    this.pod.css('width', this.podWidth + 'px');
  },
  //called on keypress to control the pod from moving out of the border.
  updatePodPosition: function () {
    this.podPosition = (this.podPosition < -10 ? -10 : (this.podPosition + this.podWidth > 700 ? 700 - this.podWidth - this.podBorder : this.podPosition));
    this.pod.css('left', this.podPosition + 'px');
  }
};
//generic falling object the argument x will contain the style to be applied trooper powerup etc.
var FallingObject = function (x) {
  this.type = x;
  //2 objects could be created at the same time so time is not dependable add a random number
  this.id = Date.now() + Math.floor(Math.random() * 10000) + 1000;
  this.html = '<div class="' + this.type + '" id=' + this.id + '></div>';
  this.fallSpeed = Math.floor(Math.random() * 100) + 20;
  this.pos = Math.floor(Math.random() * 660) + 10;
  this.points = 120 - this.fallSpeed;
  // console.log(this);
  $(".container").append(this.html);
  $("#" + this.id).css('left', this.pos + 'px');
  $("#" + this.id).attr('data-content', this.points);
};
//game object to control the game play
var game = {
  //initialize the game by initializing pod and troopercreate speed and being trooper creation
  init: function () {
    this.trooperCreateSpeed = 3000;
    this.powerCreateSpeed = 20000;
    this.dangerCreateSpeed = 30000;
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
    }
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
    elem.FallInterval = setInterval(fall, elem.fallSpeed);
    var top = parseInt($("#" + elem.id).css('top'));

    function fall() {
      top += 2;
      if (top >= 365 && top <= 370 && elem.pos + 10 >= pod.getPodPosition() && elem.pos <= pod.getPodPosition() + pod.podWidth) {
        clearInterval(elem.FallInterval);
        _this.handleCollission(elem);
      } else if (top < 410) {
        $("#" + elem.id).css('top', top + 'px');
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
      pod.setPodWidth(1.3);
    }
    if (e.type === "danger") {
      pod.setPodWidth(0.7);
    }
    this.removeObject(e);
  },
  handleDead: function (e) {
    clearInterval(e.FallInterval);
    $("#" + e.id).hasClass('trooper') ? $("#" + e.id).addClass("dead") : "";
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
    var score = (dead ? Math.floor(e.points / 4) : e.points);
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
