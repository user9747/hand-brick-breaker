let playerScore = 0
let paddle
let ball
let bricks
let gameState
let CamFPR = 0
let a = CamFPR
let life = 3

function preload(){
  sound1 = loadSound('sound/Arkanoid SFX (1).wav');
  sound2 = loadSound('sound/Arkanoid SFX (7).wav');
  sound3 = loadSound('sound/Arkanoid SFX (10).wav');
  sound4 = loadSound('sound/Arkanoid SFX (11).wav');
  sound5 = loadSound('sound/over.mp3');
}
function setup() {
  createCanvas(800, 600)
  let colors = createColors()
  gameState = 'starting'
  paddle = new Paddle()
  ball = new Ball(paddle)
  bricks = createBricks(colors)
  handTrack.load(modelParams).then(lmodel => {
    model = lmodel
    overlay.style.display = "none";
    gameState = 'playing'
    startVideo()
  });
}

function createColors() {
  const colors = []
  colors.push(color(265, 165, 0))
  colors.push(color(135, 206, 250))
  colors.push(color(147, 112, 219))
  for (let i = 0; i < 10; i++) {
    colors.push(color(random(0, 255), random(0, 255), random(0, 255)))
  }
  return colors
}

function createBricks(colors) {
  const bricks = []
  const rows = 10
  const bricksPerRow = 10
  const brickWidth = width / bricksPerRow
  for (let row = 0; row < rows; row++) {
    for (let i = 0; i < bricksPerRow; i++) {
      brick = new Brick(createVector(brickWidth * i, 25 * row), brickWidth, 25, colors[floor(random(0, colors.length))])
      bricks.push(brick)
    }
  }

  return bricks
}

async function draw() {
  if (gameState === 'playing' && isVideo == true) {
    background(0)
    ball.bounceEdge()
    ball.bouncePaddle()
    ball.update()
/*	  
    if (keyIsDown(LEFT_ARROW)) {
      paddle.move('left')
    } else if (keyIsDown(RIGHT_ARROW)) {
      paddle.move('right')
    }
*/
    for (let i = bricks.length - 1; i >= 0; i--) {
      const brick = bricks[i]
      if (brick.isColliding(ball)) {
        ball.reverse('y')
        bricks.splice(i, 1)
        playerScore += brick.points
	sound1.play()
      } else {
        brick.display()
      }
    }

    paddle.display()
    ball.display()
    textSize(32)
    fill(255,0,0)
    text(`❤️ =${life } Score:${playerScore} `, width - 250, 50)

    if (ball.belowBottom()) {
	    life = life - 1
	    if(life == 0){
		sound5.play()
		gameState = 'Lose'
	    }
	    ball.reset()
    }

    if (bricks.length === 0) {
      gameState = 'Win'
    }
    if (a == 0) {
      runDetection().then(pred => {
        if (pred.length > 0) {
          model.renderPredictions(pred, canvas, context, video);
          paddle.move(pred[0].bbox[0])
        }
      });

      a = CamFPR;
    }else{
	a = a - 1;
    }
  } else {
    textSize(100)
    gameState === 'Lose' ? fill(255, 0, 255) : fill(255)
    text(`You ${gameState}!!!`, width / 2 - 220, height / 2)
  }
}
