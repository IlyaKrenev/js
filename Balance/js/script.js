let bodyParams = document.body.getBoundingClientRect();
let stick = document.createElement('div');
let ball = document.createElement('div');
let ballRotated = document.createElement('div');
let h1 = document.querySelector('h1');
let newH1 = document.createElement('h1');
let PG = document.querySelector('#playGround');
let settings = {
  rotation: 0,
  speed: 0.5,
  ballRotation: 5,
};
let stopFlag = 0;

stick.classList.add('stick');
PG.appendChild(stick);

newH1.classList.add('h1');
newH1.textContent = 'Retry';
newH1.classList.add('hide');
PG.append(newH1);

ball.classList.add('ball');
ballRotated.classList.add('ball');
ball.classList.add('hide');
ballRotated.classList.add('hide');
ball.style.top=20+'px';
ball.style.opacity = 1;
ball.style.boxShadow = '0.375em 0.375em 0 0 rgba(63, 15, 15, 0.125)';

function buttonEVENT(){

h1.addEventListener('click', () => {
  let start = Date.now();

  let timer = setInterval(function() {
    let timePassed = Date.now() - start;
    if (timePassed >= 500) {
      clearInterval(timer);
      h1.classList.add('hide');
      return;
    }
    draw(timePassed);
  }, 10);

  function draw(timePassed) {
    h1.style.opacity = 0.9 - timePassed/500;
    h1.style.width = h1.clientWidth + 'px';
  }
  startGame();
});

}

document.addEventListener('keydown', function (event) {
  if (event.code == 'ArrowLeft') {
    settings.rotation -= settings.speed;
    stick.style.transform = `rotate(${settings.rotation}deg)`;
  }
});

document.addEventListener('keydown', function (event) {
  if (event.code == 'ArrowRight') {
    settings.rotation += settings.speed;
    stick.style.transform = `rotate(${settings.rotation}deg)`;
  }
});

document.addEventListener('pointerdown', function (event) { 
  //console.dir(event);
  if (event.layerX < bodyParams.width/2){
    settings.rotation -= settings.speed;
    stick.style.transform = `rotate(${settings.rotation}deg)`;
  } else{
    settings.rotation += settings.speed;
    stick.style.transform = `rotate(${settings.rotation}deg)`;
  }
});

buttonEVENT();

function startGame() {
  ball.classList.remove('hide');
  ballRotated.classList.remove('hide');

  settings.rotation = getRandomInt(40)-20;
  stick.style.transform = `rotate(${settings.rotation}deg)`;
  let stickParams = stick.getBoundingClientRect();
  let left = stickParams.left+getRandomInt(stickParams.width)/2+stickParams.width/4;
  ballRotated.style.left = ball.style.left= left +'px';

  if (settings.rotation <= 0)
    ballRotated.style.top = ball.style.top = Math.abs(stickParams.right-left)*Math.abs(Math.tan(degToRad(settings.rotation))) + stickParams.top - stickParams.bottom/12 + 'px';
  else
    ballRotated.style.top = ball.style.top = Math.abs(left-stickParams.left)*Math.abs(Math.tan(degToRad(settings.rotation))) + stickParams.top - stickParams.bottom/16 + 'px';
  if (stopFlag == 0)
    requestAnimationFrame(playGame);
}

document.body.appendChild(ball);
document.body.appendChild(ballRotated);

function playGame(){
  let ballParams = ball.getBoundingClientRect();
  let stickParams = stick.getBoundingClientRect();
  procedureBall(stickParams, ballParams.left, ballParams.top);
  shadow(ballParams.left, ballParams.top);
  produceStick(ballParams.left);
  if (stopFlag == 0)
    requestAnimationFrame(playGame);
  else
    return;
}

function produceStick(ballLeft){
  if(ballLeft < bodyParams.width/2){
    settings.rotation = settings.rotation - bodyParams.width/150000;
    stick.style.transform = `rotate(${settings.rotation}deg)`;
  }
  else if (ballLeft >= bodyParams.width/2){
    settings.rotation = settings.rotation + bodyParams.width/150000;
    stick.style.transform = `rotate(${settings.rotation}deg)`;
  }
}

function procedureBall(stickPos, ballPosLeft, ballPosTop){
  if (settings.rotation < 0){
    let left = ball.style.left = ballPosLeft - 3 * Math.abs(settings.rotation/10) + 'px';
    let top = ball.style.top = Math.abs(stickPos.right-ballPosLeft-22)*Math.abs(Math.tan(degToRad(settings.rotation))) + stickPos.top - 37 + 'px';

    ballRotated.style.transform = `rotate(${settings.ballRotation}deg)`;
    ballRotated.style.left = left;
    ballRotated.style.top = top;

    settings.ballRotation += settings.rotation/2;

  }  else if (settings.rotation > 0){
      let left = ball.style.left = ballPosLeft + 3 * Math.abs(settings.rotation/10) + 'px';
      let top = ball.style.top = Math.abs(ballPosLeft-stickPos.left+13)*Math.abs(Math.tan(degToRad(settings.rotation))) + stickPos.top - 37 + 'px';
    
      ballRotated.style.transform = `rotate(${settings.ballRotation}deg)`;
      ballRotated.style.left = left;
      ballRotated.style.top = top;

      settings.ballRotation += settings.rotation/2;
      } else {
        ballRotated.style.top = ball.style.top = stickPos.top - 37 + 'px';
    }

    if (ballPosLeft < stickPos.left-30){
      ballFall(ballPosTop);
      stopGame();
    }
    if (ballPosLeft > stickPos.right){
      ballFall(ballPosTop);
      stopGame();
    }
}

function shadow(left, top){
  let shadow = document.createElement('div');
  shadow.classList.add('ball');
  shadow.style.left=left + 'px';
  shadow.style.top=top + 'px';
  shadow.style.opacity = 0.10;
  shadow.style.zIndex = 1;
  PG.appendChild(shadow);
  setTimeout(() => shadow.remove(), 100);
  setTimeout(() => PG.appendChild(shadow), 110);
  setTimeout(() => shadow.remove(), 120);
}

function ballFall(top){
  ballRotated.style.top = ball.style.top = top * 1.02 + 'px';
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function degToRad (deg) { 
  return deg / 180 * Math.PI; 
}

function stopGame(){
  setTimeout(() => {
    newH1.removeEventListener('click', rertyGame);
    newH1.addEventListener('click', rertyGame);
    newH1.classList.remove('hide');
    stopFlag = 1;
  }, 500);
}

function rertyGame(){
  setTimeout(() => {
    newH1.classList.add('hide');
    stopFlag = 0;
    startGame();
  }, 100);
  
}