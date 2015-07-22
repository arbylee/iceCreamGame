var game = new Phaser.Game(600, 600, Phaser.AUTO, '')
function Main() {};


var IceCream = function (state) {
  this.alreadyScored = false;
  Phaser.Sprite.call(this, state.game, 0, 0, 'iceCream');
  this.alive = false;
  this.exists = false;
}

IceCream.prototype = Object.create(Phaser.Sprite.prototype);
IceCream.prototype.constructor = IceCream;


Main.prototype = {
  preload: function(){
    game.load.image('cone', 'assets/cone.png');
    game.load.image('iceCream', 'assets/ice_cream.png');
    this.cursors = game.input.keyboard.createCursorKeys();
  },
  create: function(){
    this.score = 0;
    this.scoreText = game.add.text(20, 20, "Score: 0", {font: "16px Arial", fill: "#FFFFFF"});
    game.physics.startSystem(Phaser.Physics.ARCADE);
    this.player = game.add.sprite(300, 550, 'cone');
    game.physics.arcade.enable(this.player);
    this.player.body.collideWorldBounds = true;

    this.iceCreams = game.add.group();
    this.iceCreams.enableBody = true;

    //this.iceCreams.createMultiple(30, 'iceCream');
    for(i=0; i<80; i++){
      this.iceCreams.add(new IceCream(this));
    }

    game.time.events.loop(game.rnd.between(250, 450), this.spawnIceCream, this);
  },
  update: function(){
    this.player.body.velocity.x = 0;
    if(this.cursors.left.isDown){
      this.player.body.velocity.x -= 250;
    }
    if(this.cursors.right.isDown){
      this.player.body.velocity.x += 250;
    }

    game.physics.arcade.overlap(this.player, this.iceCreams, this.iceCreamHitsCone, null, this);
    game.physics.arcade.overlap(this.iceCreams, this.iceCreams, this.iceCreamHitsIceCream, null, this);
  },
  spawnIceCream: function(){
    var iceCream = this.iceCreams.getFirstDead();
    iceCream.reset(this.game.rnd.between(0, 600), -50);
    iceCream.body.velocity.y = 300;
  },
  iceCreamHitsCone: function(player, iceCream){
    if(!iceCream.alreadyScored){
      iceCream.alreadyScored = true;
      iceCream.body.velocity.y = 0;
      iceCream.body.velocity = player.body.velocity;
      this.addPoints();
    }
  },
  iceCreamHitsIceCream: function(iceCream1, iceCream2){
    if(!iceCream2.alreadyScored){
      if(iceCream1 != iceCream2){
        iceCream2.alreadyScored = true;
        iceCream2.body.velocity.y = 0;
        iceCream2.body.velocity = iceCream1.body.velocity;
        this.addPoints();
      };
    };
  },
  addPoints: function(){
    this.score += 1;
    this.scoreText.text = "Score: " + this.score;
    if(this.score >= 20){
      game.state.start('win');
    }
  }
};

function Win() {};
Win.prototype = {
  create: function(){
    game.add.text(240, 240, "You win!", {font: "24px Arial", fill: "#FFFFFF"});
    game.add.text(150, 440, "Press spacebar to restart", {font: "24px Arial", fill: "#FFFFFF"});
  },
  update: function(){
    if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
      game.state.start('main');
    };
  }
}

game.state.add('main', Main);
game.state.add('win', Win);
game.state.start('main');
