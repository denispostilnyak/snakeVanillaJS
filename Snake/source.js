let lastRenderTime = 0;
let snakeSpeed = prompt('Enter level from 1 to 10:');
const GRID_SIZE = 24;
let snakeBody = [{ x: 12, y: 12 }];
let applePosition = getRandomPosition();
let direction = {
    x: 0, y: 0 
};
let addSnakeSize = 0;
let gameOver = false;
let board = document.getElementsByClassName('board').item(0);
let score = document.getElementsByClassName('score').item(0);

function main(time) {
    if (gameOver) {
        if(confirm('You lose! press OK to restart.')){
            window.location.reload();
        }

        return;
    }

    window.requestAnimationFrame(main);
    const secondsSinceLastRender = (time - lastRenderTime) / 1000;
    if (secondsSinceLastRender < 1 / snakeSpeed) {
        return;
    }
    
    console.log('Test');
    lastRenderTime = time;

    updateSnake();
    updateFood();
    checkDeath();
    drawSnake();
    drawApple();
    initScores();
}

window.requestAnimationFrame(main);

function initScores() {
    score.innerText = `Your score: ${snakeBody.length}`;
}

function updateSnake() {
    resizeSnake();
    for(let i = snakeBody.length - 2; i >= 0; --i) {
        snakeBody[i + 1] = { ...snakeBody[i] };
    }

    snakeBody[0].x += direction.x;
    snakeBody[0].y += direction.y;
}

function updateFood() {
    if(onSnake(applePosition)) {
        addSnakeSize += 1;
        applePosition = getRandomPosition();
    }
}

function onSnake(position) {
    return snakeBody.some(bodyPosition => {
        return bodyPosition.x == position.x && bodyPosition.y == position.y;
    });
}

function resizeSnake() {
    for (let i = 0; i < addSnakeSize; ++i) {
        snakeBody.push({ ...snakeBody[snakeBody.length - 1] });
    }

    addSnakeSize = 0;
}

function drawSnake() {
    board.innerHTML = '';
    snakeBody.forEach((position) => {
        let snakeElement = document.createElement('div')

        snakeElement.style.gridColumnStart = position.x;
        snakeElement.style.gridRowStart = position.y;
        snakeElement.classList.add('snake');
        board.appendChild(snakeElement);
    });
}

function drawApple() {
    let appleElement = document.createElement('div')

    appleElement.style.gridColumnStart = applePosition.x;
    appleElement.style.gridRowStart = applePosition.y;
    appleElement.classList.add('apple');
    board.appendChild(appleElement);
}

function getRandomPosition() {
    let newApplePosition = null;
    while (newApplePosition == null || onSnake(newApplePosition)) {
        newApplePosition = {
            x: Math.floor(Math.random() * GRID_SIZE) + 1,
            y: Math.floor(Math.random() * GRID_SIZE) + 1
        };
    }

    return newApplePosition;
}

function checkDeath() {
    if(outOfGrid() || snakeIntersection()) {
        gameOver = true;
    }
}

function outOfGrid() {
    let head = snakeBody[0];
    
    return (
        head.x < 1 || head.x > GRID_SIZE ||
        head.y < 1 || head.y > GRID_SIZE
    )
}

function snakeIntersection() {
    let head = snakeBody[0];

    return snakeBody.some((bodyPosition, index) => {
        if(index == 0) {
            return false;
        }

        return bodyPosition.x == head.x && bodyPosition.y == head.y;
    });
}

window.addEventListener('keydown', e => {
    switch (e.key) {
        case 'ArrowUp':
            if(direction.x == 0 && direction.y == 1) {
                break;
            }

            direction = { x: 0, y: -1 };
            break;
        case 'ArrowDown':
            if(direction.x == 0 && direction.y == -1) {
                break;
            }

            direction = { x: 0, y: 1 };
            break;
        case 'ArrowRight':
            if(direction.x == -1 && direction.y == 0) {
                break;
            }

            direction = { x: 1, y: 0 };
            break;
        case 'ArrowLeft':
            if(direction.x == 1 && direction.y == 0) {
                break;
            }

            direction = { x: -1, y: 0 };
            break;
    }
});