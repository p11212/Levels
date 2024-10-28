const Engine = Matter.Engine,
  World = Matter.World,
  Events = Matter.Events,
  Bodies = Matter.Bodies,
  Collision = Matter.Collision,
  Detector = Matter.Detector,
  Query = Matter.Query;

  var plat1, plat2, plat3
  keys = {}

  var whiteMF = []
  var whiteMB = []
  var whiteJB = []

  let currentFrame = 0
  let frameDuration = 100
  let lastFrameTime = 0

  let lastJFrameTime = 0
  let jumpFrame = 0

  paused = false
  
  

  

  function preload(){
    //character movement
    whiteIdle = loadImage('Sprites/White Moving/white f1.png')
    for (let i = 1; i <= 4; i++) {whiteMF.push(loadImage(`Sprites/White Moving/white f${i}.png`))}
    for (let i = 1; i <= 4; i++) {whiteMB.push(loadImage(`Sprites/White Moving B/white b${i}.png`))}
      
    nothing = loadImage('Sprites/nothing.png')

    pauseR = loadImage('Sprites/Pause/pause R.png')
    pauseH = loadImage('Sprites/Pause/pause H.png')
    playR = loadImage('Sprites/Pause/Play R.png')
    playH = loadImage('Sprites/Pause/Play H.png')
    
    jumpLImg = loadImage(`Sprites/White Jumping/jump L.png`)
    jumpRImg = loadImage(`Sprites/White Jumping/jump R.png`)
  
      //level backgrounds
    Level1bg = loadImage('background/Level 1 - Jungle.png')
    Level2bg = loadImage('background/Level 2 - Cave.png')
    Level3bg = loadImage('background/Level 3 - Snowy Mountains.png')
    Level4bg = loadImage('background/Level 4 - Temple.png')
    LevelBossbg = loadImage('background/Level 5 - The Dragons Lair.png')

    x1 = 0
    x2 = width

  }

function setup(){
   createCanvas(screen.width*1.5,screen.height*1.5)
  //camera.on()
  engine = Engine.create()
  world = engine.world
  world.gravity.y = 1;
  move = 0
  ground = new Platform(width/2,height,width+100,20)

  barrier = new Platform(-10,height/2,20,height)
  //player()

  //pauseGame()
  //plB.hide()

  //paCge = pauseR
  //plCge = nothing
  
  
  Matter.Runner.run(engine)
  

  // platforms to jump on
  plat1 = new Platform(width/4,1550,100,10)
  plat2 = new Platform(width/2,450,100,10)
  plat3 = new Platform(width/4*3,250,100,10)
  
  whiteChange = whiteIdle

  pB.mouseClicked(()=>{
    paused = true

    paCge = nothing
    plCge = playR

    pB.hide()
    plB.show()
  })
  plB.mouseClicked(()=>{
    paused = false
    plB.hide()
    pB.show()

    paCge = pauseR
    plCge = nothing 
  })
  
}

function draw() {

  let bgX = -player1.position.x;
  //let bgY = -player1.position.y * 0.1;

  translate(
    (-player1.position.x + width * 0.3) / 0.9,
    -100
  );

background(Level1bg)


push()
imageMode(CENTER)
image(whiteChange,player1.position.x, player1.position.y-9)
pop()

fill(255);
//rect(player1.position.x, player1.position.y,60,70);
hover()



ground.display();
plat1.display();
plat2.display();
plat3.display();



  if(!paused){
    rectMode(CENTER);
  
    Engine.update(engine);
  
    updatePlayerMovement()
  
    if (millis() - lastFrameTime > frameDuration) {
      currentFrame = (currentFrame + 1) % 4
      lastFrameTime = millis()
    }

  push()
  resetMatrix()
  imageMode(CENTER)
  image(paCge,100,100)

pop()
}
else{
  whiteChange = whiteIdle
  

  push()
  rectMode(CENTER)
  fill(0, 0, 0, 200);
  rect(width/2,height/2, width*1.5, height*1.5);
  pop()

  push()
  resetMatrix()

  textSize(150)
  textAlign(CENTER)
  text("Paused", width/2,height/2-300)

  imageMode(CENTER)
  image(plCge,width/2,height/2)
  pop()
} 
}

// Creating the body of the main player
function player(){
  var options = {
    density:10,
    restitution:0,
    friction:5
  }
  player1 = Bodies.rectangle(400,700,70,70,options)
  World.add(world,player1)
  }


document.addEventListener("keydown", (e) => {keys[e.key] = true;});

document.addEventListener("keyup", (e) => {keys[e.key] = false;});

  function updatePlayerMovement() {
    let colliding = isPlayerOnGroundOrPlatform();
  
    if (colliding) {
      let currentVelocityX = player1.velocity.x;
  
      if (keys[" "]) {
        let horizontalDirection = 0;

        whiteChange = jumpRImg

        if (keys["a"]) {horizontalDirection = -1
          whiteChange = jumpLImg;}
        else if (keys["d"]) {horizontalDirection = 1
          whiteChange = jumpRImg;}
        
        Matter.Body.setVelocity(player1, { x: currentVelocityX + horizontalDirection, y: -15 });
      }
  
      if (!keys[" "]) {
        if (keys["a"]) {Matter.Body.setVelocity(player1, { x: -5, y: 0});
                        whiteChange = whiteMB[currentFrame]}
        else if (keys["d"]) {Matter.Body.setVelocity(player1, { x: 5, y: 0});
                        whiteChange = whiteMF[currentFrame]}
        else{Matter.Body.setVelocity(player1, { x: 0, y: 0});
            whiteChange = whiteIdle}
      }
    }
  }

  function isPlayerOnGroundOrPlatform() {
    return (
        Matter.SAT.collides(player1, ground.body).collided ||
        Matter.SAT.collides(player1, plat1.body).collided ||
        Matter.SAT.collides(player1, plat2.body).collided ||
        Matter.SAT.collides(player1, plat3.body).collided
    );
}

function pauseGame(){
  pB = createButton(' ')
  pB.position(10,-345)
  pB.size(200,200)
  pB.style('background-color','transparent')
  pB.style('border-color','transparent')
  pB.class('center')

  plB = createButton(' ')
  plB.position(width/2-100,height/2-450)
  plB.size(200,200)
  plB.style('background-color','transparent')
  plB.style('border-color','transparent')
}

function hover(){
  pB.mouseOver(()=>{
    paCge = pauseH
  })
  pB.mouseOut(()=>{
    paCge = pauseR
  })

  plB.mouseOver(()=>{
    plCge = playH
  })
  plB.mouseOut(()=>{
    plCge = playR
  })
}

