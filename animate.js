// MODEL code

import { Ball } from "./ball.js";
import { Bat } from "./bat.js";
import { detectBoundaryCollision } from './collisions.js';

const container = document.querySelector(".container");

const bat = new Bat(50, 50, 30, 120); // today

window.addEventListener("keydown", keyDownFn);
const currentKeys = {};
function keyDownFn(e) {
  if (currentKeys[e.keyCode]) return;
  currentKeys[e.keyCode] = true;
  console.log(e.keyCode);

  if (e.keyCode !== 38 && e.keyCode !== 40) return;

  if (e.keyCode === 38) {
    bat.velocityTop = -0.2;
  }
  if (e.keyCode === 40) {
    bat.velocityTop = 0.2;
  }
}

window.addEventListener("keyup", keyUpFn);
function keyUpFn(e) {
  currentKeys[e.keyCode] = false;
  if (e.keyCode !== 38 && e.keyCode !== 40) return;

  bat.velocityTop = 0;
}

const bat1View = document.querySelector(".bat");

const ball = new Ball(760, 50, 40, 40);

// VIEW code

const ball1View = document.querySelector("#ball-1");
ball1View.style.left = ball.left + "px";
ball1View.style.width = ball.width + "px";
ball1View.style.height = ball.height + "px";
ball1View.style.top = ball.top + "px";
bat1View.style.top = ball.top + "px"; // today

let t1 = window.performance.now(); // time when page loadded
// console.log(t1);

function updateFrame(t0) {
  const duration = t0 - t1;






  // Stephen's collision detector test -----------------------------------------
  //
  // This collision detector takes care of the right boundary of the container
  // by interpolating the path of the ball from the start to the end of the
  // frame and finding out at exactly which point it hits
  const collision = detectBoundaryCollision(ball, { top: 0, left: 760, height: 800 }, t1, t0);

  // If collision has been detected...
  if (collision) {
    console.log(collision);

    // New (reflected) position
    const p2 = {
        0: collision.pCollision[0] - (collision.p1[0] - collision.pCollision[0]),
        1: collision.p1[1]
    };

    ball.velocityLeft *= -1;
    t1 = t0;
    return;
  }
  // End of Stephen's collision detector ---------------------------------------






  if (/*ball.left + ball.width > 800 || */ball.left < 0) {
    ball.velocityLeft = -ball.velocityLeft;
  }
  if (ball.top + ball.height > 800 || ball.top < 0) {
    ball.velocityTop = -ball.velocityTop;
  }

  ball.move(t0 - t1);

  ball1View.style.left = ball.left + "px";
  ball1View.style.top = ball.top + "px";

  bat.move(t0 - t1); // today
  bat1View.style.top = bat.top + "px";

  if (bat.top + bat.height >= 800) {
    bat.top = 800 - bat.height;
  }
  if (bat.top <= 0) {
    bat.top = 0;
  }
  touch(ball, bat);

  t1 = t0;
}

requestAnimationFrame(function frame(t) {
  updateFrame(t);
  requestAnimationFrame(frame);
});

function touch(ball, bat) {
  // console.log(ball.left, bat.left + bat.width);
  if (ball.left + 10 <= bat.left + bat.width) {
    //console.log(bat.left + bat.width);
    ball.velocityLeft = -ball.velocityLeft;
  }

  // ball.velocityleft = -ball.velocityleft;
}