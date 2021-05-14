let intervalLeft;
let isLeftPressed = false;
let intervalRight;
let isRightPressed = false;

const moveNeedle = (posX) => {
  const needle = document.getElementById("needle");
  const needleWidth = document
    .getElementById("needle")
    .getBoundingClientRect().width;
  const fieldWidth = document
    .getElementById("field")
    .getBoundingClientRect().width;
  if (posX > -needleWidth / 2 && posX < fieldWidth - needleWidth / 2) {
    needle.style.left = posX + "px";
  }
};

const onKeyPress = (e) => {
  const keyPressed = e.keyCode;

  switch (keyPressed) {
    case 37:
      if (!isLeftPressed) {
        intervalLeft = setInterval(() => {
          const needlePosX = document
            .getElementById("needle")
            .getBoundingClientRect().left;
          moveNeedle(needlePosX - 4);
          isLeftPressed = true;
        }, 7);
      }
      break;

    case 39:
      if (!isRightPressed) {
        intervalRight = setInterval(() => {
          const needlePosX = document
            .getElementById("needle")
            .getBoundingClientRect().left;
          moveNeedle(needlePosX + 4);
          isRightPressed = true;
        }, 7);
      }
      break;
  }
};

const onKeyUp = (e) => {
  const keyUpped = e.keyCode;

  switch (keyUpped) {
    case 37:
      clearInterval(intervalLeft);
      isLeftPressed = false;
      break;

    case 39:
      clearInterval(intervalRight);
      isRightPressed = false;
      break;
  }
};

const pierceDetected = (ball) => {
  const needleParams = document
    .getElementById("needle")
    .getBoundingClientRect();
  const needlePos = needleParams.left + needleParams.width / 2;
  const ballParams = ball.getBoundingClientRect();
  const ballPos = ballParams.left + ballParams.width / 2;
  if (Math.abs(needlePos - ballPos) < 30) {
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
  let isPopped = false;
  const ball = document.createElement("div");
  const gameField = document.getElementById("field");
  const gameFieldParams = gameField.getBoundingClientRect();
  const ballSize = Math.random() * (50 - 30) + 30;
  const liftingSpeed = Math.random() + time / 60;

  ball.classList.add("ball");
  ball.style.width = ballSize + "px";
  ball.style.height = ballSize + "px";
  ball.style.left =
    (Math.random() * 0.85 + 0.05) * gameFieldParams.width + "px";

  gameField.appendChild(ball);

  const ascension = setInterval(() => {
    const { top, bottom, left } = ball.getBoundingClientRect();
    ball.style.top = `${top - liftingSpeed}px`;

    if (weather !== "still" && !isPopped) {
      weather === "right"
        ? (ball.style.left = `${left - left / gameFieldParams.width}px`)
        : (ball.style.left = `${
            left + (1 - (left + ballSize) / gameFieldParams.width)
          }px`);
    }

    if (top <= 130 && top >= 90) {
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
      clearInterval(ascension);
    }
  }, 7);
};

const releaseBalls = () => {
  if (delay >= 1000) {
    delay -= 20;
  }
  ballMaker();
  if (time < 60) {
    setTimeout(releaseBalls, delay);
  }
};

const viewScore = () => {
  const scoreboard = document.createElement("div");
  const record = parseInt(localStorage.getItem("record"), 10);
  const recordElement =
    ballsPopped > record ? `<p>Новый рекорд!</p>` : `<p>Рекорд: ${record}</p>`;
  scoreboard.setAttribute("id", "scoreboard");
  scoreboard.innerHTML = `<h3>Ваши результаты:</h3>${recordElement}<p>Лопнуто: ${ballsPopped}</p><p>Пропущено: ${ballsMissed}</p><button onclick="startGame()">Сыграть еще раз!</button>`;
  if (ballsPopped > record) {
    localStorage.setItem("record", `${ballsPopped}`);
  }
  return scoreboard;
};

let time;
let weather;
let delay;
let ballsPopped;
let ballsMissed;

const defaultValues = {
  time: 0,
  weather: "still",
  delay: 2000,
  ballsPopped: 0,
  ballsMissed: 0,
};

const newGame = () => {
  ({ time, weather, delay, ballsPopped, ballsMissed } = defaultValues);
  const scoreboard = document.getElementById("scoreboard");
  scoreboard && document.querySelector(".wrapper").removeChild(scoreboard);
};

const startGame = () => {
  newGame();
  const timer = setInterval(() => {
    document.getElementById("timer").innerText = `Время: ${time}`;
    time === 60 ? clearInterval(timer) : time++;
  }, 1000);
  const weatherInterval = setInterval(
    () =>
      time !== 60
        ? (weather = weatherChanger())
        : clearInterval(weatherInterval),
    7000
  );
  setTimeout(() => releaseBalls(), delay);
  setTimeout(() => {
    const intervalID = setInterval(() => {
      if (!document.getElementById("field").hasChildNodes()) {
        const scoreboard = viewScore();
        document.querySelector(".wrapper").appendChild(scoreboard);
        clearInterval(intervalID);
      }
    }, 500);
  }, 60000);
};

const startHandler = () => {
  const modal = document.querySelector(".start-modal");
  document.querySelector(".wrapper").removeChild(modal);
  document.addEventListener("keydown", onKeyPress);
  document.addEventListener("keyup", onKeyUp);
  const record = localStorage.getItem("record");
  if (!record) {
    localStorage.setItem("record", "0");
  }
  startGame();
};

document.getElementById("startButton").addEventListener("click", startHandler);
