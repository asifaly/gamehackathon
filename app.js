//Math.floor(Math.random() * 430) + 10 
//begin game
$(document).ready(function () {
  game.init();
});
//define the pod object
var pod = {
  //initialize pod speed and position
  init: function () {
    this.podPosition = 0;
    this.podSpeed = 50;
    this.pod = $("#pod");
    this.podWidth = parseInt(this.pod.css('width'));
    this.podBorder= parseInt(this.pod.css('border-right'));
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
  getPosition: function () {
    return this.podPosition;
  },
  setPodWidth: function (multiplier) {
    this.podWidth = this.podWidth * multiplier;
    this.pod.css('width', this.podWidth + 'px');
  },

  updatePodPosition: function(){
    this.podPosition = (this.podPosition<0 ? 0 : (this.podPosition+this.podWidth>700 ? 700-this.podWidth-this.podBorder : this.podPosition));
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
  this.pos = Math.floor(Math.random() * 660)+10;
  this.points = 120 - this.fallSpeed;
  console.log(this);
  $(".container").append(this.html);
  $("#" + this.id).css('left', this.pos + 'px');
  $("#"+this.id).attr('data-content', this.points);
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
    this.score= 0;
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
  powerUpInit: function () {
    this.powerInitInterval = setInterval(createPower, this.powerCreateSpeed);

    function createPower() {
      power = new FallingObject("powerup");
      game.startFall(power);
    }
  },
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
      top+=2;
      if (top >= 365 && top <= 370 && elem.pos + 10 >= pod.getPosition() && elem.pos <= pod.getPosition() + pod.podWidth) {
        clearInterval(elem.FallInterval);

        if (elem.type === "trooper") {
          $("#" + elem.id).addClass("alive");
          _this.updateScore(elem);
        }
        if (elem.type === "powerup") {
          pod.setPodWidth(1.3);
        }
        if (elem.type === "danger") {
          pod.setPodWidth(0.7);
        }
        _this.removeObject(elem);
      } else if (top < 410) {
        $("#" + elem.id).css('top', top + 'px');
      } else {
        clearInterval(elem.FallInterval);
        $("#" + elem.id).hasClass('trooper') ? $("#" + elem.id).addClass("dead") : "";
        _this.updateScore(elem, true);
        _this.removeObject(elem);
      }
    }
  },
  //need to sepearte the collission function
  checkCollission: function (top,elem) {
    if (top === 365 && elem.pos + 10 >= pod.getPosition() && elem.pos <= pod.getPosition() + pod.podWidth) {
      clearInterval(elem.FallInterval);
      if (elem.type === "powerup") {
        pod.setPodWidth(1.3);
      }
      if (elem.type === "danger") {
        pod.setPodWidth(0.7);
      }
      _this.removeObject(elem);
    }
  },
  removeObject: function (elem) {
    setTimeout(function () {
      $("#" + elem.id).remove();
      delete elem;
    }, 1000);
  },
  updateScore: function(elem, dead){

    var score = (dead ? Math.floor(elem.points/4) : elem.points);
    this.score = (dead ? this.score -= score : this.score+=score);
    var plusminus  = (dead ? "-" : "+");
    $('#'+elem.id).html(plusminus+score);
    (this.scoreDiv).html(this.score);
  }
};
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
