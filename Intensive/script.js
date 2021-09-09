const score = document.querySelector('.score'),
      start = document.querySelector('.start'),
      gameArea = document.querySelector('.gameArea'),
      car = document.createElement('div'),
      lvlArr = [
      start.querySelector('.easylvl'),
      start.querySelector('.mediumlvl'),
      start.querySelector('.harlvl'),
      start.querySelector('.gelvl')],
      popup = document.querySelector('.popup');
      

car.classList.add('car');

const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowRight: false,
    ArrowLeft: false,
};

const setting = {
    start: false,
    score: 0,
    speed: 5,
    traffic: 3
};

const levels ={
    easy: false,
    medium: false,
    hard: false,
    GE: false,
};

function getQuantityElements(heightElement){
    return document.documentElement.clientHeight / heightElement + 1;
}

for (let lvl of lvlArr){
    lvl.onclick = function() {
        switch (lvl.textContent){
            case 'Easy':
                setting.traffic = 4;
                break;
            case 'Medium':
                setting.traffic = 3;
                setting.speed = 6;
                break;
            case 'Hard':
                setting.traffic = 2;
                setting.speed = 7;
                break;
            case 'GlobalElite':
                setting.traffic = 1.2;
                setting.speed = 12;
                break;
            default:
                setting.traffic = 3;
        }
        console.log(lvl.textContent);
    }; 
}



start.addEventListener('click', startGame);
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);

function startGame(){
    start.classList.add('hide');
    gameArea.style.display = 'block';
    score.style.top = start.offsetHeight;
    gameArea.innerHTML = '';
    car.style.top = 'auto';
    car.style.left = '125px';
    for (let i = 0; i < getQuantityElements(100); i++){
        const line = document.createElement('div');
        line.classList.add('line');
        line.style.top = (i*75) + 'px';
        line.y = i * 100;
        gameArea.appendChild(line);
    }

    if (setting.speed == 12){
        for (let i = 0; i < getQuantityElements(100); i++){
            const line1 = document.createElement('div');
            line1.classList.add('line');
            line1.style.top = (i*75) + 'px';
            line1.style.left = (350) + 'px';
            line1.y = i * 100;
            gameArea.appendChild(line1);
        }
        for (let i = 0; i < getQuantityElements(100); i++){
            const line1 = document.createElement('div');
            line1.classList.add('line');
            line1.style.top = (i*75) + 'px';
            line1.style.left = (550) + 'px';
            line1.y = i * 100;
            gameArea.appendChild(line1);
        }
        gameArea.style.width = '700px';
        gameArea.style.outlineWidth = '20px';
    }
    else{
        gameArea.style.width = '300px';
        gameArea.style.outlineWidth = '10px';
    }

    for (let i = 0; i < getQuantityElements(100 * setting.traffic); i++){
        const enemy = document.createElement('div');
        enemy.classList.add('enemy');
        enemy.y = -100 * setting.traffic * (i + 1);
        enemy.style.left = Math.floor((Math.random() * (gameArea.offsetWidth - 50))) + 'px';
        enemy.style.top = enemy.y + 'px';
        let randCar = Math.random();
        if (randCar > 0.5)
        enemy.style.background = 'transparent url(./image/enemy2.png) center / cover no-repeat';
        else enemy.style.background = 'transparent url(./image/enemy.png) center / cover no-repeat';
        gameArea.appendChild(enemy);
    }

    setting.store = 0;
    setting.start = true;
    gameArea.appendChild(car);
    setting.x = car.offsetLeft;
    setting.y = car.offsetTop;
    setting.rotate = 0;
    requestAnimationFrame(playGame);
}

function playGame(){
    if (setting.start === true){
        setting.score +=setting.speed;
        score.innerHTML = 'SCORE: <br>' + setting.score;
        moveRoad();
        moveEnemy();
        if(keys.ArrowLeft && setting.x > 0){
            setting.x -= setting.speed;
            setting.rotate = -5;
            car.style.transform = 'rotate(' + setting.rotate + 'deg)';
        }
        if(keys.ArrowRight && setting.x < (gameArea.offsetWidth - car.offsetWidth)){
            setting.x += setting.speed;
            setting.rotate = 5;
            car.style.transform = 'rotate(' + setting.rotate + 'deg)';
        }
        if(keys.ArrowDown && setting.y < (gameArea.offsetHeight - car.offsetHeight)){
            setting.y += setting.speed*1.2;
            setting.rotate = 0;
        }
        if(keys.ArrowUp && setting.y > 0){
            setting.y -= setting.speed*1.2;
            setting.rotate = 0;
        }

        car.style.left = setting.x + 'px';
        car.style.top = setting.y + 'px';
        setInterval(function(){
            car.style.transform = 'rotate(' + 0 + 'deg)';
        }, 1000);
        
        requestAnimationFrame(playGame);
    }
}

function startRun(event){
    event.preventDefault();
    keys[event.key] = true;
}

function stopRun(event){
    event.preventDefault();
    keys[event.key] = false;
}

function moveRoad(){
    let lines = document.querySelectorAll('.line');
    lines.forEach(function(item) {
        item.y += setting.speed;
        item.style.top = item.y; 

        if(item.y >= document.documentElement.clientHeight){
            item.y = -100;
        }
    });
}

function moveEnemy(){
    let enemy = document.querySelectorAll('.enemy');
    enemy.forEach(function(item){
        let carRect = car.getBoundingClientRect();
        let enemyRect = item.getBoundingClientRect();

        if (carRect.top <= enemyRect.bottom-5 &&
            carRect.right-5 >= enemyRect.left &&
            carRect.left <= enemyRect.right-5 &&
            carRect.bottom-5 >= enemyRect.top){
                const blow = document.createElement('div');
                blow.classList.add('blow');

                blow.style.top = (carRect.top+enemyRect.bottom)/2-90 + 'px';
                blow.style.left = car.offsetLeft-25+'px';
               // blow.style.right = (car.offsetRight+enemy.offsetLeft)/2 + 'px';
                //blow.style.left = (carRect.left <= enemyRect.right-5) ? ((car.offsetLeft-25) + 'px') : blow.style.left;
               // blow.style.right = (carRect.right-5 >= enemyRect.left) ? ((enemy.offsetRight-25) + 'px') : blow.style.right;

                console.log(blow.style.top);
                blow.style.display = 'block';
                gameArea.append(blow);

                setting.start = false;
                start.classList.remove('hide');
                score.style.top = start.offsetHeight;

                let rec = localStorage.getItem('Record');

                if (rec < setting.score){
                    if(rec != null){
                    popup.children[1].textContent += rec;
                    setInterval(function(){
                        popup.style.display = 'flex';
                    }, 1000);
                }
                else localStorage.setItem('Record', setting.score);
                }
                
                setting.score = 0;
                
        }
        item.y += setting.speed / 2;
        item.style.top = item.y + 'px';
    
    if (item.y >= document.documentElement.clientHeight){
        item.y = -150 * setting.traffic;
        item.style.left = Math.floor((Math.random() * (gameArea.offsetWidth - 50))) + 'px';
        let randCar = Math.random();
        if (randCar > 0.5)
        item.style.background = 'transparent url(./image/enemy2.png) center / cover no-repeat';
        else item.style.background = 'transparent url(./image/enemy.png) center / cover no-repeat';
    }
});
}