const ID = "needle";

function move(posX) {
  const element = document.getElementById(ID);
  element.style.left = posX + "px";
}

function onKeyPress(e) {
  const keyPressed = e.keyCode;
  const needlePosX = document.getElementById(ID).getBoundingClientRect().left;

  switch (keyPressed) {
    case 37:
      move(needlePosX - 15);
      break;

    case 39:
      move(needlePosX + 15);
      break;
  }
}

const pierceDetected = (ball) => {
  const needleParams = document.getElementById(ID).getBoundingClientRect();
  const needlePos = needleParams.left + needleParams.width / 2;
  const ballParams = ball.getBoundingClientRect();
  const ballPos = ballParams.left + ballParams.width / 2;
  if (Math.abs(needlePos - ballPos) < 40) {
    return true;
  }
};

const weatherChanger = () => {
  const value = Math.random();
  if (value >= 0.6) {
    return "right";
  }
  if (value >= 0.4 && value < 0.6) {
    return "still";
  }
  if (value < 0.4) {
    return "left";
  }
};

const ballMaker = () => {
  const ball = document.createElement("div");
  const gameField = document.getElementById("field");
  const gameFieldParams = gameField.getBoundingClientRect();
  ball.classList.add("ball");
  const ballSize = Math.random() * (50 - 30) + 30;
  ball.style.width = ballSize + "px";
  ball.style.height = ballSize + "px";
  gameField.appendChild(ball);
  ball.style.left =
    (Math.random() * 0.85 + 0.05) * gameFieldParams.width + "px";
  const liftingSpeed = Math.random() + time / 100;
  let isPopped = false;
  const intervalID = setInterval(() => {
    const { top, bottom, left } = ball.getBoundingClientRect();
    ball.style.top = `${top - liftingSpeed}px`;
    if (weather !== "still" && !isPopped) {
      weather === "right"
        ? (ball.style.left = `${left - left / gameFieldParams.width}px`)
        : (ball.style.left = `${
            left + (1 - (left + ballSize) / gameFieldParams.width)
          }px`);
    }
    if (bottom <= 140 && bottom >= 120) {
      if (pierceDetected(ball)) {
        ball.classList.add("poppedBall");
        !isPopped && ballsPopped++;
        isPopped = true;
      }
    }
    if (bottom <= 0) {
      if (!isPopped) {
        ballsMissed++;
      }
      gameField.removeChild(ball);
      clearInterval(intervalID);
    }
  }, 7);
};

let releaseBalls = function () {
  if (delay >= 1000) {
    delay -= 20;
  }
  ballMaker();
  if (time < 60) {
    setTimeout(releaseBalls, delay);
  }
};

const viewScore = (popped, missed) => {
  const scoreboard = document.createElement("div");
  scoreboard.classList.add("scoreboard");
  scoreboard.innerHTML = `<h3>Ваши результаты:</h3><p>Лопнуто: ${popped}</p><p>Пропущено: ${missed}</p>`;
  return scoreboard;
};

document.addEventListener("keydown", onKeyPress);
document.addEventListener("click", ballMaker);

let time = 50;
let weather = "still";
let delay = 2000;
let ballsPopped = 0;
let ballsMissed = 0;

const startGame = () => {
  const timer = setInterval(() => {
    document.getElementById("timer").innerText = `timer: ${time}`;
    time === 60 ? clearInterval(timer) : time++;
  }, 1000);
  setInterval(() => (weather = weatherChanger()), 7000);
  setTimeout(releaseBalls, delay);
  setTimeout(() => {
    const intervalID = setInterval(() => {
      if (!document.getElementById("field").hasChildNodes()) {
        const scoreboard = viewScore(ballsPopped, ballsMissed);
        document.querySelector(".wrapper").appendChild(scoreboard);
        clearInterval(intervalID);
      }
    }, 1000);
  }, 10000);
};

startGame();

//TODO: Кнопка "заново", Leaderboard в localstorage, плавная анимация рыбы??