let setFevicon = () => {
  var favicon = document.querySelector("#favicon");
  var newIcon = favicon.cloneNode(true);
  newIcon.setAttribute("href", canvas.toDataURL());
  favicon.parentNode.replaceChild(newIcon, favicon);
};

let colors = ["blue", "#F21170", "#FA9905", "#FF5200"];

let canvas = document.querySelector("canvas");
canvas.width = 16;
canvas.height = 16;
document.body.style.zoom = 30.0;

let c = canvas.getContext("2d");

keys = {
  up: false,
  down: false,
  right: false,
  left: false,
};

addEventListener("keydown", (event) => {
  if (event.key == "ArrowUp") keys.up = true;
  if (event.key == "ArrowDown") keys.down = true;
  if (event.key == "ArrowRight") keys.right = true;
  if (event.key == "ArrowLeft") keys.left = true;
  player.updatePosition();
});
addEventListener("keyup", (event) => {
  if (event.key == "ArrowUp") keys.up = false;
  if (event.key == "ArrowDown") keys.down = false;
  if (event.key == "ArrowRight") keys.right = false;
  if (event.key == "ArrowLeft") keys.left = false;
  player.updatePosition();
});

playerPosition = {
  x: undefined,
  y: undefined,
}; //for enemy to keep an eye on this numbers and see if touched

class Circle {
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
  }

  drawCircle = () => {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.strokeStyle = "white";
    c.stroke();
    c.fillStyle = "red";
    c.fill();
  };

  updatePosition = () => {
    if (this.y > 0 && keys.up) this.y -= 0.5;
    if (this.y < canvas.height && keys.down) this.y += 0.5;
    if (this.x < canvas.width && keys.right) this.x += 0.5;
    if (this.x > 0 && keys.left) this.x -= 0.5;
    playerPosition.x = this.x;
    playerPosition.y = this.y;
    this.drawCircle();
  };
}
class Square {
  constructor(x, y, velocityX, velocityY, color) {
    this.x = x;
    this.y = y;
    this.width = 2;
    this.height = 2;
    this.velocityX = velocityX;
    this.velocityY = velocityY;
    this.color = color;
  }
  draw = () => {
    c.fillStyle = this.color;
    c.fillRect(this.x, this.y, this.width, this.height);
  };
  checkOnPlayer = () => {
    //keeps checking if this has touched the player
    if (
      playerPosition.x > this.x &&
      playerPosition.x < this.x + this.width &&
      playerPosition.y > this.y &&
      playerPosition.y < this.y + this.height
    )
      console.log("touching");
  };
  updatePositionAndCheckTouch = () => {
    this.x += this.velocityX;
    this.y += this.velocityY;
    this.draw();
    this.checkOnPlayer();
  };
}

let player = new Circle(canvas.width / 2, canvas.height / 2, 1);

let enemyArray = [];

setInterval(() => {
  enemyX = 0;
  enemyY = 0;
  let situation = Math.floor(Math.random() * 4);

  if (situation == 0) {
    enemyX = 0;
    enemyY = Math.random() * canvas.height;
  }
  if (situation == 1) {
    enemyX = Math.random() * canvas.width;
    enemyY = 0;
  }
  if (situation == 2) {
    enemyX = canvas.width;
    enemyY = Math.random() * canvas.height;
  }
  if (situation == 3) {
    enemyX = Math.random() * canvas.height;
    enemyY = canvas.height;
  }
  theta = Math.atan((playerPosition.y - enemyY) / (playerPosition.x - enemyX));

  enemyArray.push(
    new Square(
      enemyX,
      enemyY,
      0.1 * Math.cos(theta),
      0.1 * Math.sin(theta),
      colors[Math.floor(Math.random() * 5)]
    )
  );
}, 2000);

let animate = () => {
  requestAnimationFrame(animate);
  c.fillStyle = "rgba(0,0,0,0.02)";
  c.fillRect(0, 0, innerWidth, innerHeight);
  setFevicon();

  player.updatePosition();

  enemyArray.forEach((ele) => {
    ele.updatePositionAndCheckTouch();
  });
  //
};
animate();
