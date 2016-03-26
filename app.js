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
  },
  //move pod to the right
  moveRight: function () {
    var pos = parseInt(this.pod.css('left'));
    this.podPosition = pos + this.podSpeed;
    this.pod.css('left', this.podPosition + 'px');
  },
  //move pod to the left
  moveLeft: function () {
    var pos = parseInt(this.pod.css('left'));
    this.podPosition = pos - this.podSpeed;
    this.pod.css('left', this.podPosition + 'px');
  },
  //return current podposition i.e left of the pod
  getPosition: function () {
    return this.podPosition;
  }
};

//generic falling object the argument x will contain the style to be applied trooper powerup etc.
var FallingObject = function (x) {
  this.type = x;
  this.id = Date.now();
  this.html = '<div class="' + this.type + '" id=' + this.id + '></div>';
  this.fallSpeed = Math.floor(Math.random() * 50) + 10;
  this.pos = Math.floor(Math.random() * 420) + 10;
  console.log(this);
  $(".container").append(this.html);
  $("#" + this.id).css('left', this.pos + 'px');
};

//game object to control the game play
var game = {
  //initialize the game by initializing pod and troopercreate speed and being trooper creation
  init: function () {
    pod.init();
    this.trooperCreateSpeed = 3000;
    this.powerCreateSpeed = 20000;
    this.dangerCreateSpeed = 30000;
    this.trooperInit();
    this.powerUpInit();
    this.dangerInit();
  },
  //create troopers
  trooperInit: function () {
    this.trooperInitInterval = setInterval(createTrooper, this.trooperCreateSpeed);

    function createTrooper() {
      trooper = new FallingObject("trooper");
      game.startFall(trooper);
    }
  },

  powerUpInit: function (){
    this.powerInitInterval = setInterval(createPower, this.powerCreateSpeed);

    function createPower() {
      power = new FallingObject("powerup");
      game.startFall(power);
    }
  },

  dangerInit: function (){
    this.dangerInitInterval = setInterval(createPower, this.dangerCreateSpeed);

    function createPower() {
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
      top++;
      if (top === 285 && elem.pos + 10 >= pod.getPosition() && elem.pos <= pod.getPosition() + 105 - 30) {
        clearInterval(elem.FallInterval);
        // $(elem.id).addClass("alive");
        _this.removeObject("#"+elem.id);
      } else if (top < 320) {
        $("#" + elem.id).css('top', top + 'px');
      } else {
        clearInterval(elem.FallInterval);
        elem.id % 2 === 0 ? $("#" + elem.id).addClass("dead1") : $("#" + elem.id).addClass("dead2");
        _this.removeObject("#"+elem.id);
      }
    }
  },
  //need to sepearte the collission function
  checkCollission: function () {},

  removeObject: function (elem) {
    setTimeout(function () {
      $(elem).remove();
    }, 1000);
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
