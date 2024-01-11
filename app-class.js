const gameOptionContainer = document.querySelector("#game-option");
const rotateButton = document.querySelector("#rotate");
const gameBoardsContainer = document.querySelector("#game-boards");
const startButton = document.querySelector("#start");
const turn = document.querySelector("#turn");
const info = document.querySelector("#info");
const reloadBtn = document.querySelector('#reload');

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

class GameBoards {
    constructor(angle, width, gameOver, humanTurn, isHorisontal, notDropped, draggedShip, humanHits, computerHits, computerSunkShips, humanSunkShips) {
        this.angle = angle;
        this.width = width;
        this.gameOver = gameOver;
        this.humanTurn = humanTurn;
        this.isHorisontal = isHorisontal;
        this.notDropped = notDropped;
        this.draggedShip = draggedShip;
        this.humanHits = humanHits;
        this.computerHits = computerHits;
        this.computerSunkShips = computerSunkShips;
        this.humanSunkShips = humanSunkShips;
    }

    playSound = (sound) => {
        const song = document.querySelector(`#${sound}`);
        song.play();
    }

    rotate = () => {
        this.playSound('sound2');
        const optionShips = Array.from(gameOptionContainer.children);
        this.angle = this.angle === 0 ? 90 : 0;
        optionShips.forEach(
            (optionShip) => (optionShip.style.transform = `rotate(${this.angle}deg)`)
        );
    }

    createBoard(color, user) {
        const gameBoard = document.createElement("div");
        gameBoard.classList.add("game-board");
        gameBoard.style.background = color;
        gameBoard.id = user;
        gameBoardsContainer.append(gameBoard);
        for (let i = 0; i < this.width * this.width; i++) {
            const block = document.createElement("div");
            block.classList.add("block");
            block.id = `block-${String(i).padStart(2, '0')}`;
            // block.id = `block-${i}`;
            gameBoard.append(block);
        }
    }

    generate(user, ship, startId) {
        const allBoardBlocks = document.querySelectorAll(`#${user} div`);
        let randomBoolean = Math.random() < 0.5;
        this.isHorisontal = user === "human" ? this.angle === 0 : randomBoolean;
        let randomStartIndex = Math.floor(Math.random() * this.width * this.width);
        let startIndex = startId ? startId.substr(6) : randomStartIndex;

        const { shipBlocks, notTaken } = this.getValidity(
            allBoardBlocks,
            this.isHorisontal,
            startIndex,
            ship,
            user
        );

        if (notTaken) {
            if (this.isHorisontal) {
                for (let i = 0; i < ship.length; i++) {
                    let blockingBlockUpHor;
                    let blockingBlockDownHor;
                    if (Number(shipBlocks[i].id.substring(6)) - 10 >= 0) {
                        blockingBlockUpHor = document.querySelector(`#${user} #block-${String(Number(shipBlocks[i].id.substring(6)) - 10).padStart(2, "0")}`);
                        blockingBlockUpHor.classList.add("blocking");
                    }
                    if (Number(shipBlocks[i].id.substring(6)) + 10 <= 99) {
                        blockingBlockDownHor = document.querySelector(`#${user} #block-${String(Number(shipBlocks[i].id.substring(6)) + 10).padStart(2, "0")}`);
                        blockingBlockDownHor.classList.add("blocking");
                    }
                }
                for (let i = 1; i <= 3; i++) {
                    let blockingBlockLeftHor;
                    let blockingBlockRightHor;
                    if (Number(String(startIndex).padStart(2, "0")[1]) > 0 && (Number(startIndex) + 19) - (i * 10) < 100 && (Number(startIndex) + 19) - (i * 10) >= 0) {
                        blockingBlockLeftHor = document.querySelector(`#${user} #block-${String((Number(startIndex) + 19) - (i * 10)).padStart(2, "0")}`);
                        blockingBlockLeftHor.classList.add("blocking");
                    }
                    if (Number(String(Number(startIndex) + ship.length).padStart(2, "0")[1]) !== 0 && String((Number(startIndex) + ship.length + 20) - i * 10) < 100 && String((Number(startIndex) + ship.length + 20) - i * 10) >= 0) {
                        blockingBlockRightHor = document.querySelector(`#${user} #block-${String((Number(startIndex) + ship.length + 20) - i * 10).padStart(2, "0")}`);
                        blockingBlockRightHor.classList.add("blocking");
                    }
                }
            } else {
                for (let i = 0; i < ship.length; i++) {
                    let blockingBlockLeftVert;
                    let blockingBlockRightVert;
                    Number(shipBlocks[i].id.substring(6))
                    if (Number(shipBlocks[i].id.substring(6).padStart(2, "0")[1]) > 0 && Number(shipBlocks[i].id.substring(6)) - 1 < 100 && Number(shipBlocks[i].id.substring(6)) - 1 >= 0) {
                        blockingBlockLeftVert = document.querySelector(`#${user} #block-${String(Number(shipBlocks[i].id.substring(6)) - 1).padStart(2, "0")}`);
                        blockingBlockLeftVert.classList.add("blocking");
                    }
                    if (Number(shipBlocks[i].id.substring(6).padStart(2, "0")[1]) < 9 && Number(shipBlocks[i].id.substring(6)) + 1 < 100 && Number(shipBlocks[i].id.substring(6)) + 1 >= 0) {
                        blockingBlockRightVert = document.querySelector(`#${user} #block-${String(Number(shipBlocks[i].id.substring(6)) + 1).padStart(2, "0")}`);
                        blockingBlockRightVert.classList.add("blocking");
                    }
                }
                for (let i = 0; i < 3; i++) {
                    let blockingBlockUpVert;
                    let blockingBlockDownVert;
                    if (Number(String(startIndex).padStart(2, "0")) - 11 + i >= 0) {
                        blockingBlockUpVert = document.querySelector(`#${user} #block-${String(Number(startIndex) - 11 + i).padStart(2, "0")}`);
                        blockingBlockUpVert.classList.add("blocking"); ``
                    }
                    if (Number(String(startIndex).padStart(2, "0")) + (((ship.length * 10) - 1) + i) <= 99) {
                        blockingBlockDownVert = document.querySelector(`#${user} #block-${String(Number(startIndex) + (((ship.length * 10) - 1) + i)).padStart(2, "0")}`);
                        blockingBlockDownVert.classList.add("blocking");
                    }
                }
            }
            shipBlocks.forEach((shipBlock) => {
                shipBlock.classList.add(ship.name);
                shipBlock.classList.add("taken");
                if (user === 'human') {
                    this.playSound('sound1');
                }
            });
        } else {
            if (user === "computer") this.generate(user, ship);
            if (user === "human") {
                this.notDropped = true;
                this.playSound('sound3');
            }
        }
    }

    getValidity(allBoardBlocks, isHorisontal, startIndex, ship, user = 'human') {
        let validStart = isHorisontal
            ? Number(String(startIndex)[Math.floor(Math.log10(startIndex))]) > this.width - ship.length
                ? (startIndex - (String(Number(startIndex) + Number((ship.length - 1)))[String(Number(startIndex) + Number((ship.length - 1))).length - 1])) - 1
                : startIndex
            : Number(String(startIndex).padStart(2, '0')[0]) > this.width - ship.length
                ? startIndex - (10 * (ship.length - 1))
                : startIndex;
        let shipBlocks = [];

        for (let i = 0; i < ship.length; i++) {
            if (isHorisontal) {
                shipBlocks.push(allBoardBlocks[Number(validStart) + i]);
            } else {
                shipBlocks.push(allBoardBlocks[Number(validStart) + i * this.width]);
            }
        }

        let notTaken;
        for (let i = 0; i < shipBlocks.length; i++) {
            notTaken = !shipBlocks[i].classList.contains("taken");
            if (!notTaken) {
                break;
            } else {
                notTaken = !shipBlocks[i].classList.contains("blocking");
                if (!notTaken) break;
            }
        }

        return { shipBlocks, notTaken };
    }

    dragStart = (event) => {
        this.draggedShip = event.target;
        this.notDropped = false;
    }

    dragOver = (event) => {
        event.preventDefault();
        const ship = ships[this.draggedShip.id.substr(5)];
        this.highlight(event.target.id.substr(6), ship);
    }

    dropShip = (event) => {
        const startID = event.target.id;
        const ship = ships[this.draggedShip.id.substr(5)];
        this.generate("human", ship, startID);
        if (!this.notDropped) {
            this.draggedShip.remove();
        }
    }

    highlight(startIndex, ship) {
        const allBoardBlocks = document.querySelectorAll("#human div");
        this.isHorisontal = this.angle === 0;
        const { shipBlocks, notTaken } = this.getValidity(
            allBoardBlocks,
            this.isHorisontal,
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

    computerGo = () => {
        if (!this.gameOver) {
            turn.textContent = "Computer's turn!";
            info.textContent = "Computer is thinking...";

            setTimeout(() => {
                let rand = Math.floor(Math.random() * this.width * this.width);
                const allBoardsBlocks = document.querySelectorAll("#human div");

                if (
                    allBoardsBlocks[rand].classList.contains("taken") &&
                    allBoardsBlocks[rand].classList.contains("boom")
                ) {
                    this.computerGo();
                    return;
                } else if (
                    allBoardsBlocks[rand].classList.contains("taken") &&
                    !allBoardsBlocks[rand].classList.contains("boom")
                ) {
                    this.playSound('true');
                    allBoardsBlocks[rand].classList.add("boom");
                    info.textContent = "Computer hit your ship!";
                    let classes = Array.from(allBoardsBlocks[rand].classList);
                    classes = classes.filter(
                        (className) =>
                            className !== "block" &&
                            className !== "boom" &&
                            className !== "taken"
                    );
                    this.computerHits.push(...classes);
                    // console.log(computerHits);
                    this.checkScore("computer", this.computerHits, this.computerSunkShips);
                } else {
                    this.playSound('false');
                    info.textContent = "Nothing hit";
                    turn.textContent = "";
                    allBoardsBlocks[rand].classList.add("empty");
                }
            }, 3000);
            setTimeout(() => {
                this.humanTurn = true;
                turn.textContent = "Your turn!";
                info.textContent = "";
                const allBoardBlocks = document.querySelectorAll("#computer div");
                allBoardBlocks.forEach((block) =>
                    block.addEventListener("click", this.handleClick)
                );
            }, 6000);
        }
    }

    handleClick = (event) => {
        if (!this.gameOver)
            if (!event.target.classList.contains("boom")) {
                if (event.target.classList.contains("taken")) {
                    this.playSound('true');
                    event.target.classList.add("boom");
                    info.innerHTML = "You hit computer's ship!";
                    let classes = Array.from(event.target.classList);
                    classes = classes.filter(
                        (className) =>
                            className !== "block" && className !== "boom" && className !== "taken"
                    );
                    this.humanHits.push(...classes);
                    // console.log(humanHits);
                    this.checkScore("human", this.humanHits, this.humanSunkShips);
                } else {
                    this.playSound('false');
                    info.textContent = "You missed it";
                    event.target.classList.add("empty");
                }
                this.humanTurn = false;
                const allBoardBlocks = document.querySelectorAll("#computer div");
                allBoardBlocks.forEach((block) => block.replaceWith(block.cloneNode(true)));
                setTimeout(this.computerGo, 2000);
            }
    }

    startGame = () => {
        this.playSound('sound2');
        if (gameOptionContainer.children.length != 0) {
            info.innerHTML = "Place all your ships!";
        } else {
            this.humanTurn = true;
            turn.textContent = "Your turn!";
            info.textContent = "The game has started!";
            // info.innerHTML = "Congrat!";
            const allBoardBlocks = document.querySelectorAll("#computer div");
            allBoardBlocks.forEach((block) =>
                block.addEventListener("click", this.handleClick)
            );
        }
    }

    checkScore = (user, userHits, userSunkShips) => {
        const checkShip = (shipName, shipLength) => {
            if (
                userHits.filter((storedShipName) => storedShipName === shipName)
                    .length === shipLength
            ) {
                if (user === "human") {
                    info.textContent = `You sunk the computer's ${shipName}`;
                    this.humanHits = userHits.filter(
                        (storedShipName) => storedShipName != shipName
                    );
                }
                if (user === "computer") {
                    info.textContent = `Computer sunk your ${shipName}`;
                    this.computerHits = userHits.filter(
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
        if (this.humanSunkShips.length === 10) {
            this.playSound('victory');
            this.callModal("You won!", 'lightgreen');
            this.gameOver = true;
        }
        if (this.computerSunkShips.length === 10) {
            this.playSound('game-over');
            this.callModal("Computer won!", 'pink');
            this.gameOver = true;
        }
    }

    callModal(resultText, resultColor) {
        let modal = new bootstrap.Modal(document.querySelector('#result'))
        modal.show();
        document.querySelector('#modal-body').textContent = resultText;
        document.querySelector('#modal-content').style.background = resultColor;
        setTimeout(function () {
            modal.hide();
        }, 1500);
    }
}
const gameBoard = new GameBoards(0, 10, false, true, true, false, '', [], [], [], []);
// const gameBoard1 = new GameBoards("deck-one", 1);
// const gameBoard2 = new GameBoards("deck-one", 1);
// gameBoard1.createBoard("#8cd29f", "human");
// gameBoard2.createBoard("#e38a82", "computer");
gameBoard.createBoard("#8cd29f", "human");
gameBoard.createBoard("#e38a82", "computer");

rotateButton.addEventListener("click", gameBoard.rotate);

ships.forEach((ship) => gameBoard.generate("computer", ship));

const optionShips = Array.from(gameOptionContainer.children);

optionShips.forEach((optionShip) =>
    optionShip.addEventListener("dragstart", gameBoard.dragStart)
);

const allUserBlocks = document.querySelectorAll("#human div");
allUserBlocks.forEach((userBlock) => {
    userBlock.addEventListener("dragover", gameBoard.dragOver);
    userBlock.addEventListener("drop", gameBoard.dropShip);
});

startButton.addEventListener("click", gameBoard.startGame);

const reload = () => {
    location.reload();
}
reloadBtn.addEventListener('click', reload);