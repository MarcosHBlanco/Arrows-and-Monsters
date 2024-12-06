let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

//60s timer
let timer = 60;
let gameTimer;
let gameStop = false; //to stop the game when the timer end
let score = 0; //set the starting score with zero
let gameStart = true; //game start flag
let sound = new Audio("./sounds/Super_Duper_Modified.mp3");

//function for score recording
function scoreCounter(point) {
	score += Number(point);
	console.log(point);
}

//display score
function displayScore() {
	ctx.font = "30px Arial";
	ctx.fillStyle = "red";
	ctx.fillText("Score: " + score, canvas.width - 185, 85);
}

//Archer's death
function archerDie() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawBackground();

	if (deadCurrentFrame < deadFrameCount) {
		let frameX = deadCurrentFrame * archerWidth;
		ctx.drawImage(
			deathArcher,
			frameX,
			0,
			archerWidth,
			archerHeight,
			0,
			posY,
			archerWidth,
			archerHeight
		);
		deadCurrentFrame++;
		setTimeout(archerDie, 320);
		sound.pause();
		sound.currentTime = 0;
	} else {
		endingScreen();
	}
}

// start the timer
function startTimer() {
	gameTimer = setInterval(() => {
		timer--;
		if (timer == 0) {
			clearInterval(gameTimer);
			gameStop = true;
			archerDie();
		}
	}, 1000);
}

//display timer
function displayTimer() {
	ctx.font = "30px Arial";
	ctx.fillStyle = "red";
	ctx.fillText("Time Left: " + timer, canvas.width - 200, 50);
}

//Start game - first screen
function startScreen() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.drawImage(startGameScreen, 0, 0, canvas.width, canvas.height);
}

//Game over img shows after game end
function endingScreen() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.drawImage(
		gameOver,
		0,
		0,
		canvas.width / 1.5 + 300,
		canvas.height / 1.5 + 150
	);

	ctx.font = "40px Times New Roman";
	ctx.fillStyle = "#000";

	ctx.fillText("Your Total Score: " + score, canvas.width / 2 - 160, 400); //score

	ctx.font = "italic 22px Times New Roman";
	ctx.fillStyle = "#000";
	ctx.fillText("Press 'R' to Restart the Game", canvas.width / 2 - 140, 430); //press 'R' restart
}

// Reset game
function restartGame() {
	score = 0;
	timer = 60;
	gameStop = false;
	orcPosX = canvas.width;
	slimePosX = canvas.width;
	deadCurrentFrame = 0;
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	startTimer();
	animate();
}

// game elements
let archer = new Image();
archer.src = "./Archer/Run.png";
let arrow = new Image();
arrow.src = "./Archer/Arrow.png";
let slime = new Image();
slime.src = "./Slime3/Walk/Slime3_Walk_body.png";
let background = new Image();
background.src = "./Background/Battleground1.png";
let idleArcher = new Image();
idleArcher.src = "./Archer/Idle_2.png";
let shootingArcher = new Image();
shootingArcher.src = "./Archer/Shot_1.png";
let orc = new Image();
orc.src = "./Orc2/Orc2_run_attack/orc2_run_attack_full.png";
let deathArcher = new Image(); //dead archer image
deathArcher.src = "Archer/Dead.png";
let gameOver = new Image();
gameOver.src = "Archer/gameOver.JPG"; //game over img
let startGameScreen = new Image();
startGameScreen.src = "./Archer/startscreen.jpg";

// player dimensions and frame
const archerWidth = 128;
const archerHeight = 128;
const frameCount = 8;
let currentFrame = 0;
let posX = 1;
let posY = canvas.height / 3;
const movSpeed = 10;
const idleFrameCount = 4;
let idleCurrentFrame = 0;
const shootingFrameCount = 14;
let shootingCurrentFrame = 0;
const deadFrameCount = 3;
let deadCurrentFrame = 0;

// Limit to player Y-Axis
const playerYBoundarie = canvas.height / 2 - archerHeight;

// Orc initial positioning, dimensions and frame values
let orcPosX = canvas.width;
let orcPosY =
	Math.random() * (canvas.height - playerYBoundarie - archerHeight) +
	playerYBoundarie;
const orcWidth = 64;
const orcHeight = 64;
const scaledOrcWidth = orcWidth * 2.3;
const scaledOrcHeight = orcHeight * 2.3;
const orcFrameCount = 8;
let orcFrame = 0;

// slime initial positiong, dimensions and frame values
let slimePosX = canvas.width;
let slimePosY =
	Math.random() * (canvas.height - playerYBoundarie - archerHeight) +
	playerYBoundarie;
const slimeWidth = 64;
const slimeHeight = 64;
const scaledSlimeWidth = slimeWidth * 1.8;
const scaledSlimeHeight = slimeHeight * 1.8;
const slimeFrameCount = 8;
let slimeFrame = 0;

// arrow initial positioning
let arrowPosX = null;
let arrowPosY = null;
let isShooting = false;

// Walking flag
let isWalking = false;

// Keyboard events
document.addEventListener("keydown", (event) => {
	if (event.key === "w" || event.key === "W") {
		isWalking = true;
		if (posY < playerYBoundarie) {
			isWalking = false;
		} else {
			posY = Math.max(0, posY - movSpeed); // Move up with boundary check
		}
	} else if (event.key === "s" || event.key === "S") {
		if (posY > canvas.height) {
			isWalking = false;
		} else {
			isWalking = true;
			posY = Math.min(canvas.height - archerHeight, posY + movSpeed); // Move down with boundary check
		}
	}
});
document.addEventListener("keypress", (event) => {
	if (event.key === "a") {
		if (!isShooting) {
			isShooting = true;
			updateShooting();
		}
	}
});
document.addEventListener("keyup", (event) => {
	if (event.key === "w" || event.key === "W") {
		isWalking = false;
	} else if (event.key === "s" || event.key === "S") {
		isWalking = false;
	}
});
document.addEventListener("keydown", (event) => {
	//press R/r to restart the game
	if (event.key === "r" || event.key === "R") {
		if (gameStop || gameStart) {
			gameStart = false;
			restartGame();
			sound.currentTime = 0;
			sound.play();
		}
	}
});

// Draw Battleground
function drawBackground() {
	ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
}
// Define arrow spawn point
function spawnArrow() {
	arrowPosX = posX + archerWidth / 3;
	arrowPosY = posY + archerHeight / 2 + arrow.height / 3;
}
// Arrow movement and position reset
function updateArrow() {
	if (arrowPosX !== null) {
		// Move the arrow
		arrowPosX += 40;

		// Draw the arrow
		ctx.drawImage(arrow, arrowPosX, arrowPosY);

		// Reset the arrow when it leaves the screen
		if (arrowPosX > canvas.width) {
			arrowPosX = null;
			arrowPosY = null;
		}
	}
}
// Updates Orc X-axis if it goes out of bounds
// and spawns it at random Y-axis coor
function updateOrc() {
	orcPosX -= 8;
	if (orcPosX < -scaledOrcWidth) {
		orcPosX = canvas.width;
		orcPosY =
			Math.random() * (canvas.height - playerYBoundarie - archerHeight) +
			playerYBoundarie;
	}
	let frameX = orcFrame * orcWidth;
	ctx.drawImage(
		orc,
		frameX,
		128,
		orcWidth,
		orcHeight,
		orcPosX,
		orcPosY,
		scaledOrcWidth,
		scaledOrcHeight
	);
	orcFrame = (orcFrame + 1) % orcFrameCount;
}

// Updates slime X-axis if it goes out of bounds
// and spawns it at random Y-axis coord
function updateSlime() {
	slimePosX -= 4;
	if (slimePosX < -scaledSlimeWidth) {
		slimePosX = canvas.width;
		slimePosY =
			Math.random() * (canvas.height - playerYBoundarie - archerHeight) +
			playerYBoundarie;
	}

	let frameX = slimeFrame * slimeWidth;
	ctx.drawImage(
		slime,
		frameX,
		128,
		slimeWidth,
		slimeHeight,
		slimePosX,
		slimePosY,
		scaledSlimeWidth,
		scaledSlimeHeight
	);
	slimeFrame = (slimeFrame + 1) % frameCount;
}
// Idle stance for our Archer
function updateIdle() {
	let frameX = idleCurrentFrame * archerWidth;
	ctx.drawImage(
		idleArcher,
		frameX,
		0,
		archerWidth,
		archerHeight,
		0,
		posY,
		archerWidth,
		archerHeight
	);
	idleCurrentFrame = (idleCurrentFrame + 1) % idleFrameCount;
}
// Frames for "moving" Archer
function updateArcher() {
	let frameX = currentFrame * archerWidth;
	ctx.drawImage(
		archer,
		frameX,
		0,
		archerWidth,
		archerHeight,
		0,
		posY,
		archerWidth,
		archerHeight
	);
	currentFrame = (currentFrame + 1) % frameCount;
}
// Shooting stance for Archer
function updateShooting() {
	let frameX = shootingCurrentFrame * archerWidth;

	// Draw the shooting frame
	ctx.drawImage(
		shootingArcher,
		frameX,
		0,
		archerWidth,
		archerHeight,
		0,
		posY,
		archerWidth,
		archerHeight
	);

	// Move to the next frame
	shootingCurrentFrame += 2;

	// End the shooting animation when all frames are played
	if (shootingCurrentFrame >= shootingFrameCount) {
		shootingCurrentFrame = 0; // Reset the frame counter
		spawnArrow();
		isShooting = false; // End the shooting state
		// arrowSpawned = false; // Reset the arrow spawn flag
	}
}
// Collision checks
function collisionCheckOrc() {
	if (
		arrowPosX + 48 > orcPosX &&
		arrowPosX < orcPosX + scaledOrcWidth &&
		arrowPosY > orcPosY &&
		arrowPosY + 48 < orcPosY + scaledOrcHeight
	) {
		scoreCounter(5); // add 5 points, orc
		return true;
	} else {
		return false;
	}
}
function collisionCheckSlime() {
	if (
		arrowPosX + 48 > slimePosX &&
		arrowPosX < slimePosX + scaledSlimeWidth &&
		arrowPosY > slimePosY &&
		arrowPosY + 48 < slimePosY + scaledSlimeHeight
	) {
		scoreCounter(10); //add 10 points, slime
		return true;
	} else {
		return false;
	}
}
function collisionCheckArcher() {
	if (
		posX < slimePosX + scaledSlimeWidth && // Archer's left edge is left of slime's right edge
		posX + 50 > slimePosX && // Archer's right edge is right of slime's left edge
		posY < slimePosY + scaledSlimeHeight && // Archer's top edge is above slime's bottom edge
		posY + 50 > slimePosY
	) {
		return true;
	} else if (
		posX < orcPosX + scaledOrcWidth && // Archer's left edge is left of slime's right edge
		posX + 50 > orcPosX && // Archer's right edge is right of slime's left edge
		posY < orcPosY + scaledOrcHeight && // Archer's top edge is above slime's bottom edge
		posY + 50 > orcPosY
	) {
		return true;
	} else {
		return false;
	}
}

// Function that handles animation for arrows, slime and archer frames
function animate() {
	if (gameStop) return; //stop animation when the timer ended

	ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
	drawBackground(); // Draw the background

	// Determine what to animate for the archer
	if (isShooting) {
		updateShooting();
	} else if (isWalking) {
		updateArcher(); // Walking animation
	} else {
		updateIdle(); // Idle animation
	}
	updateSlime();
	updateOrc();
	updateArrow();
	if (collisionCheckSlime()) {
		arrowPosX = null;
		arrowPosY = null;
		slimePosX = canvas.width;
		slimePosY =
			Math.random() * (canvas.height - playerYBoundarie - archerHeight) +
			playerYBoundarie;
		console.log("collision!");
	}
	if (collisionCheckOrc()) {
		arrowPosX = null;
		arrowPosY = null;
		orcPosX = canvas.width;
		orcPosY =
			Math.random() * (canvas.height - playerYBoundarie - archerHeight) +
			playerYBoundarie;
	}
	if (collisionCheckArcher()) {
		archerDie();
		gameStop = true;
	}
	setTimeout(() => {
		animate();
	}, 80);

	displayTimer();
	displayScore();
}

startGameScreen.onload = background.onload = () => {
	if (gameStart) {
		startScreen();
	} else {
		startTimer(); //do the start Timer function
		animate();
	}
};
