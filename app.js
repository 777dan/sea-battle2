const gameOptionContainer = document.querySelector("#game-option");
const rotateButton = document.querySelector("#rotate");
const gameBoardsContainer = document.querySelector("#game-boards");
const startButton = document.querySelector("#start");
const turn = document.querySelector("#turn");
const info = document.querySelector("#info");

let angle = 0;
let width = 10;
let gameOver = false;
let humanTurn = true;

let humanHits = [];
let computerHits = [];

let computerSunkShips = [];
let humanSunkShips = [];

function rotate() {
  // const optionShips = gameOptionContainer.children;
  //console.log(optionShips);
  //   for (const ship of optionShips) {
  //     console.log(ship.className);
  //     ship.style.transform = "rotate(90deg)";
  //   }
  const optionShips = Array.from(gameOptionContainer.children);
  angle = angle === 0 ? 90 : 0;
  optionShips.forEach(
    (optionShip) => (optionShip.style.transform = `rotate(${angle}deg)`)
  );
}

rotateButton.addEventListener("click", rotate);

function createBoard(color, user) {
  const gameBoard = document.createElement("div");
  gameBoard.classList.add("game-board");
  gameBoard.style.background = color;
  gameBoard.id = user;
  gameBoardsContainer.append(gameBoard);
  for (let i = 0; i < width * width; i++) {
    const block = document.createElement("div");
    block.classList.add("block");
    block.id = `block-${String(i).padStart(2, '0')}`;
    // block.id = `block-${i}`;
    gameBoard.append(block);
  }
}

createBoard("tan", "human");
createBoard("pink", "computer");

class Ship {
  constructor(name, length) {
    this.name = name;
    this.length = length;
  }
}

const ship1 = new Ship("deck-one", 1);
const ship2 = new Ship("deck-one", 1);
const ship3 = new Ship("deck-one", 1);
const ship4 = new Ship("deck-one", 1);
const ship5 = new Ship("deck-two", 2);
const ship6 = new Ship("deck-two", 2);
const ship7 = new Ship("deck-two", 2);
const ship8 = new Ship("deck-three", 3);
const ship9 = new Ship("deck-three", 3);
const ship10 = new Ship("deck-four", 4);

const ships = [ship1, ship2, ship3, ship4, ship5, ship6, ship7, ship8, ship9, ship10];

let isHorisontal = true;

let notDropped;

function getValidity(allBoardBlocks, isHorisontal, startIndex, ship) {
  // console.log(isHorisontal);
  // console.log(Number(String(startIndex)[0]));
  // console.log(width - ship.length);
  // console.log(Number(String(startIndex)[0]) > width - ship.length);
  // console.log(startIndex)
  // console.log(startIndex - (10 * (ship.length - 1)))

  let validStart = isHorisontal
    ? Number(String(startIndex)[startIndex.length - 1]) > width - ship.length
      ? (startIndex - (String(Number(startIndex) + Number((ship.length - 1)))[String(Number(startIndex) + Number((ship.length - 1))).length - 1])) - 1
      : startIndex
    : Number(String(startIndex).padStart(2, '0')[0]) > width - ship.length
      ? startIndex - (10 * (ship.length - 1))
      : startIndex;
  let shipBlocks = [];

  for (let i = 0; i < ship.length; i++) {
    if (isHorisontal) {
      shipBlocks.push(allBoardBlocks[Number(validStart) + i]);
    } else {
      shipBlocks.push(allBoardBlocks[Number(validStart) + i * width]);
    }
  }

  const notTaken = shipBlocks.every(
    (shipBlocks) => !shipBlocks.classList.contains("taken")
  );

  return { shipBlocks, notTaken };
}

function generate(user, ship, startId) {
  //   const allBoardBlocks = document.querySelectorAll("#computer div");
  //   let randomBoolean = Math.random() < 0.5;
  //   isHorisontal = randomBoolean;
  const allBoardBlocks = document.querySelectorAll(`#${user} div`);
  let randomBoolean = Math.random() < 0.5;
  // isHorisontal = user === "human" ? angle === 0 : randomBoolean;
  isHorisontal = user === "human" ? angle === 0 : randomBoolean;
  let randomStartIndex = Math.floor(Math.random() * width * width);
  let startIndex = startId ? startId.substr(6) : randomStartIndex;

  const { shipBlocks, notTaken } = getValidity(
    allBoardBlocks,
    isHorisontal,
    startIndex,
    ship
  );

  if (notTaken) {
    if (isHorisontal) {
      for (let i = 0; i < ship.length; i++) {
        let blockingBlockUpHor;
        let blockingBlockDownHor;
        if (Number(shipBlocks[i].id.substring(6)) - 10 >= 0) {
          blockingBlockUpHor = document.querySelectorAll(`#block-${String(Number(shipBlocks[i].id.substring(6)) - 10).padStart(2, "0")}`)[1];
          blockingBlockUpHor.classList.add("blocking");
        }
        if (Number(shipBlocks[i].id.substring(6)) + 10 <= 99) {
          blockingBlockDownHor = document.querySelectorAll(`#block-${String(Number(shipBlocks[i].id.substring(6)) + 10).padStart(2, "0")}`)[1];
          blockingBlockDownHor.classList.add("blocking");
        }
      }
      for (let i = 1; i <= 3; i++) {
        let blockingBlockLeftHor;
        let blockingBlockRightHor;
        if (Number(String(startIndex).padStart(2, "0")[1]) > 0 && (Number(startIndex) + 19) - (i * 10) < 100 && (Number(startIndex) + 19) - (i * 10) >= 0) {
          blockingBlockLeftHor = document.querySelectorAll(`#block-${String((Number(startIndex) + 19) - (i * 10)).padStart(2, "0")}`)[1];
          blockingBlockLeftHor.classList.add("blocking");
        }
        if (Number(String(startIndex).padStart(2, "0")[1]) < 9 && String((Number(startIndex) + ship.length + 20) - i * 10) < 100 && String((Number(startIndex) + ship.length + 20) - i * 10) >= 0) {
          blockingBlockRightHor = document.querySelectorAll(`#block-${String((Number(startIndex) + ship.length + 20) - i * 10).padStart(2, "0")}`)[1];
          blockingBlockRightHor.classList.add("blocking");
        }
      }
    } else {
      for (let i = 0; i < ship.length; i++) {
        let blockingBlockLeftVert;
        let blockingBlockRightVert;
        console.log(startIndex);
        console.log(Number(String(startIndex).padStart(2, "0")[1]) > 0);
        console.log((Number(startIndex) + ((ship.length - 1) * 10) - 1) - (i * 10));
        console.log('------------------------------------------------');
        Number(shipBlocks[i].id.substring(6))
        if (Number(shipBlocks[i].id.substring(6).padStart(2, "0")[1]) > 0 && Number(shipBlocks[i].id.substring(6)) - 1 < 100 && Number(shipBlocks[i].id.substring(6)) - 1 >= 0) {
          blockingBlockLeftVert = document.querySelectorAll(`#block-${String(Number(shipBlocks[i].id.substring(6)) - 1).padStart(2, "0")}`)[1];
          blockingBlockLeftVert.classList.add("blocking");
        }
        if (Number(shipBlocks[i].id.substring(6).padStart(2, "0")[1]) < 9 && Number(shipBlocks[i].id.substring(6)) + 1 < 100 && Number(shipBlocks[i].id.substring(6)) + 1 >= 0) {
          blockingBlockRightVert = document.querySelectorAll(`#block-${String(Number(shipBlocks[i].id.substring(6)) + 1).padStart(2, "0")}`)[1];
          blockingBlockRightVert.classList.add("blocking");
        }
      }
      for (let i = 0; i < 3; i++) {
        let blockingBlockUpVert;
        let blockingBlockDownVert;
        if (Number(String(startIndex).padStart(2, "0")) - 11 + i >= 0) {
          blockingBlockUpVert = document.querySelectorAll(`#block-${String(Number(startIndex) - 11 + i).padStart(2, "0")}`)[1];
          blockingBlockUpVert.classList.add("blocking");``
        }
        if (Number(String(startIndex).padStart(2, "0")) + (((ship.length * 10) - 1) + i) <= 99) {
          blockingBlockDownVert = document.querySelectorAll(`#block-${String(Number(startIndex) + (((ship.length * 10) - 1) + i)).padStart(2, "0")}`)[1];
          blockingBlockDownVert.classList.add("blocking");
        }
      }
    }
    shipBlocks.forEach((shipBlock) => {
      shipBlock.classList.add(ship.name);
      shipBlock.classList.add("taken");
    });
  } else {
    if (user === "computer") generate(user, ship);
    if (user === "human") notDropped = true;
  }

  // console.log(shipBlocks);
  //   shipBlocks.forEach((shipBlock) => {
  //     shipBlock.classList.add(ship.name);
  //     shipBlock.classList.add("taken");
  //   });
}

//generate(ship3);
ships.forEach((ship) => generate("computer", ship));

let draggedShip;

const optionShips = Array.from(gameOptionContainer.children);

optionShips.forEach((optionShip) =>
  optionShip.addEventListener("dragstart", dragStart)
);

const allUserBlocks = document.querySelectorAll("#human div");
allUserBlocks.forEach((userBlock) => {
  userBlock.addEventListener("dragover", dragOver);
  userBlock.addEventListener("drop", dropShip);
});

function dragStart(event) {
  draggedShip = event.target;
  notDropped = false;
}

function dragOver(event) {
  event.preventDefault();
  const ship = ships[draggedShip.id.substr(5)];
  highlight(event.target.id.substr(6), ship);
}

function dropShip(event) {
  const startID = event.target.id;
  const ship = ships[draggedShip.id.substr(5)];
  generate("human", ship, startID);
  if (!notDropped) {
    draggedShip.remove();
  }
}

function highlight(startIndex, ship) {
  const allBoardBlocks = document.querySelectorAll("#human div");
  let isHorisontal = angle === 0;
  const { shipBlocks, notTaken } = getValidity(
    allBoardBlocks,
    isHorisontal,
    startIndex,
    ship
  );
  if (notTaken) {
    shipBlocks.forEach((shipBlock) => {
      shipBlock.classList.add("hover");
      setTimeout(() => shipBlock.classList.remove("hover"), 500);
    });
  }
}

function computerGo() {
  if (!gameOver) {
    turn.textContent = "Computers Go!";
    info.textContent = "Computers is thinking...";

    setTimeout(() => {
      let rand = Math.floor(Math.random() * width * width);
      const allBoardsBlocks = document.querySelectorAll("#human div");

      if (
        allBoardsBlocks[rand].classList.contains("taken") &&
        allBoardsBlocks[rand].classList.contains("boom")
      ) {
        computerGo();
        return;
      } else if (
        allBoardsBlocks[rand].classList.contains("taken") &&
        !allBoardsBlocks[rand].classList.contains("boom")
      ) {
        allBoardsBlocks[rand].classList.add("boom");
        info.textContent = "Computer hit your ship!";
        let classes = Array.from(allBoardsBlocks[rand].classList);
        classes = classes.filter(
          (className) =>
            className !== "block" &&
            className !== "boom" &&
            className !== "taken"
        );
        computerHits.push(...classes);
        // console.log(computerHits);
        checkScore("computer", computerHits, computerSunkShips);
      } else {
        info.textContent = "Nothing hit";
        allBoardsBlocks[rand].classList.add("empty");
      }
    }, 3000);
    setTimeout(() => {
      humanTurn = true;
      turn.textContent = "Your Go!";
      info.textContent = "Your turn!";
      const allBoardBlocks = document.querySelectorAll("#computer div");
      allBoardBlocks.forEach((block) =>
        block.addEventListener("click", handleClick)
      );
    }, 6000);
  }
}

function handleClick(event) {
  if (!gameOver)
    if (event.target.classList.contains("taken")) {
      event.target.classList.add("boom");
      info.innerHTML = "You hit computers ship!";
      let classes = Array.from(event.target.classList);
      classes = classes.filter(
        (className) =>
          className !== "block" && className !== "boom" && className !== "taken"
      );
      humanHits.push(...classes);
      // console.log(humanHits);
      checkScore("human", humanHits, humanSunkShips);
    } else {
      info.textContent = "You missed it";
      event.target.classList.add("empty");
    }
  humanTurn = false;
  const allBoardBlocks = document.querySelectorAll("#computer div");
  allBoardBlocks.forEach((block) => block.replaceWith(block.cloneNode(true)));
  setTimeout(computerGo, 2000);
}

function startGame() {
  if (gameOptionContainer.children.length != 0) {
    info.innerHTML = "Place all your ships!";
  } else {
    info.innerHTML = "Congrat!";

    const allBoardBlocks = document.querySelectorAll("#computer div");
    allBoardBlocks.forEach((block) =>
      block.addEventListener("click", handleClick)
    );
  }
  humanTurn = true;
  turn.textContent = "You Go!";
  info.textContent = "The game has started!";
}

startButton.addEventListener("click", startGame);

function checkScore(user, userHits, userSunkShips) {
  function checkShip(shipName, shipLength) {
    if (
      userHits.filter((storedShipName) => storedShipName === shipName)
        .length === shipLength
    ) {
      if (user === "human") {
        info.textContent = `You sunk the computer's ${shipName}`;
        humanHits = userHits.filter(
          (storedShipName) => storedShipName != shipName
        );
      }
      if (user === "computer") {
        info.textContent = `Computer sunk your ${shipName}`;
        computerHits = userHits.filter(
          (storedShipName) => storedShipName != shipName
        );
      }
      userSunkShips.push(shipName);
    }
  }
  checkShip("deck-one", 1);
  checkShip("deck-two", 2);
  checkShip("deck-three", 3);
  checkShip("deck-four", 4);

  // console.log("userHits", user, userHits);
  // console.log("userSunkShips", user, userSunkShips);
  if (humanSunkShips.length === 10) {
    info.textContent = "You won!";
    gameOver = true;
  }
  if (computerSunkShips.length === 10) {
    info.textContent = "Computer won!";
    gameOver = true;
  }
}
