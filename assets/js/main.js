var game = new Phaser.Game(800,600, Phaser.CANVAS, '', { preload: preload, create: create, update: update }),
    platforms,
    player,
    cursors,
    ground,
    ledge,
    stars,
    score = 0,
    scoreText,
    fpsText;

function preload() {
  game.load.image('sky', 'images/sky.png');
  game.load.image('ground', 'images/platform.png');
  game.load.image('star', 'images/star.png');
  game.load.spritesheet('dude', 'images/dude.png', 32, 48);
}

function create() {

  // Enable physics in ARCADE style? Gonna have to look closer at that
  game.physics.startSystem(Phaser.Physics.ARCADE);

  game.time.advancedTiming = true;

  // Sky! It's an 800x600 picture starting at 0,0 so it fills up the entire game screen.
  game.add.sprite(0, 0, 'sky');

  // Setting up an object group which we can later add to
  platforms = game.add.group();

  // ???
  platforms.enableBody = true;

  scoreText = game.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });
  fpsText = game.add.text(16, 48, 'Fps: 0', { fontSize: '32px', fill: '#000' });

  // Create the ground platform, scaling it.... x2 height x2 width? I guess? and setting immovable true so it doesn't move / fall to gravity when the player collides with it
  ground = platforms.create(0, game.world.height - 64, 'ground');
  ground.scale.setTo(2, 2);
  ground.body.immovable = true;

  // Creating two ledge platforms - apparently overwriting the first doesn't get rid of it? They must get painted onto the canvas and their world objects created so that the original variable is no longer needed? Also setting immovable to true so it doesn't fall (gravity?) when the player collides with it
  ledge = platforms.create(400, 400, 'ground');
  ledge.body.immovable = true;
  ledge = platforms.create(-150, 250, 'ground');
  ledge.body.immovable = true;

  player = game.add.sprite(32, game.world.height - 150, 'dude');

  game.physics.arcade.enable(player);

  player.body.bounce.y = 0.1;
  player.body.gravity.y = 600;
  player.body.collideWorldBounds = true;

  player.animations.add('left', [0, 1, 2, 3], 10, true);
  player.animations.add('right', [5, 6, 7, 8], 10, true);

  cursors = game.input.keyboard.createCursorKeys();

  stars = game.add.group();

  for ( var i = 0; i < 15; i++ ) {
    var star = stars.create(i * 70, 0, 'star');
    game.physics.arcade.enable(star);
    star.body.gravity.y = 6;
    star.body.bounce.y = 0.7 + Math.random * 0.2;
  }
}

function update() {

  if ( game.time.fps !== 0 ) {
    fpsText.text = 'Fps: ' + game.time.fps;
  }

  game.physics.arcade.collide(player, platforms);

  game.physics.arcade.collide(stars, platforms);

  game.physics.arcade.overlap(player, stars, collectStar, null, this);

  player.body.velocity.x = 0;

  if ( cursors.left.isDown ) {
    player.body.velocity.x = -150;

    player.animations.play('left');
  } else if ( cursors.right.isDown ) {
    player.body.velocity.x = 150;

    player.animations.play('right');
  } else {
    player.animations.stop();

    player.frame = 4;
  }

  if ( cursors.up.isDown && player.body.touching.down ) {
    player.body.velocity.y = -460;
  }

}

function collectStar (player, star) {
  star.kill();

  score += 10;

  scoreText.text = 'Score: ' + score;
}