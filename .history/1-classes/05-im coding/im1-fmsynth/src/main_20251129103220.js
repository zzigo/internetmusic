// Example 2: Screen A / Screen B slider
// Goal: teach window-state switching via gestures before attaching audio/video logic.

// -----------------------------
// High-level architecture notes
// -----------------------------
// - We treat the two screens as "states" of the UI.
//   This is a small example of the State Pattern.
// - Gestures are interpreted as "commands" to move left/right
//   (Command-ish behavior without full command objects).
// - We keep everything in main.js for transparency in the course.

// Global state
let screenContainer = null;
let hudLed = null;
let hudScreenLabel = null;

const SCREEN_A = 0;
const SCREEN_B = 1;
let currentScreen = SCREEN_A;

// Gesture state (desktop pointer)
let secondaryDragActive = false; // right button drag gesture
let dragStartX = 0;
let dragHasSwitched = false;

// Gesture state (touch)
let touchSecondaryActive = false; // 2-finger gesture
let touchStartX = 0;

// Gesture state (trackpad wheel)
let lastWheelSwitchTime = 0;
const WHEEL_SWITCH_COOLDOWN_MS = 500;

// -----------------------------
// Utility helpers
// -----------------------------
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function goToScreen(screenIndex) {
  const target = clamp(screenIndex, 0, 1);
  currentScreen = target;

  if (!screenContainer) return;

  // 0 → translateX(0vw)
  // 1 → translateX(-100vw)
  screenContainer.style.transform = `translateX(-${currentScreen * 100}vw)`;

  updateHud();
}

function goNextScreen() {
  if (currentScreen === SCREEN_A) {
    goToScreen(SCREEN_B);
  }
}

function goPrevScreen() {
  if (currentScreen === SCREEN_B) {
    goToScreen(SCREEN_A);
  }
}

// -----------------------------
// HUD
// -----------------------------
function updateHud() {
  if (!hudLed || !hudScreenLabel) return;

  hudLed.classList.remove("a", "b");
  hudLed.classList.add(currentScreen === SCREEN_A ? "a" : "b");

  hudScreenLabel.textContent = currentScreen === SCREEN_A ? "screen a" : "screen b";
}

// -----------------------------
// DOM construction (no HTML markup)
// -----------------------------
function buildUI() {
  const app = document.getElementById("app");
  if (!app) return;

  // Create sliding container
  screenContainer = document.createElement("div");
  screenContainer.className = "screen-container";

  // Screen A
  const screenA = document.createElement("div");
  screenA.className = "screen screen-a";
  const labelA = document.createElement("div");
  labelA.className = "screen-label";
  labelA.textContent = "screen a";
  screenA.appendChild(labelA);

  // Screen B
  const screenB = document.createElement("div");
  screenB.className = "screen screen-b";
  const labelB = document.createElement("div");
  labelB.className = "screen-label";
  labelB.textContent = "screen b";
  screenB.appendChild(labelB);

  screenContainer.appendChild(screenA);
  screenContainer.appendChild(screenB);
  app.appendChild(screenContainer);

  // HUD
  const hud = document.createElement("div");
  hud.className = "hud";

  const row1 = document.createElement("div");
  row1.className = "hud-row";

  hudLed = document.createElement("div");
  hudLed.className = "hud-led a";

  hudScreenLabel = document.createElement("div");
  hudScreenLabel.textContent = "screen a";

  row1.appendChild(hudLed);
  row1.appendChild(hudScreenLabel);

  const row2 = document.createElement("div");
  row2.className = "hud-row hud-hint";
  row2.textContent =
    "shift-screen: right-click drag / two-finger scroll / two-finger swipe";

  hud.appendChild(row1);
  hud.appendChild(row2);
  app.appendChild(hud);

  updateHud();
}

// -----------------------------
// Desktop pointer gestures
// -----------------------------
// We interpret "secondary button drag" as the gesture to slide between screens.
// - Right click press → start gesture.
// - Horizontal drag → if exceeds threshold, switch A↔B.

function onPointerDown(ev) {
  // Ignore left button; we use right button (button === 2) as "second button".
  if (ev.button === 2) {
    secondaryDragActive = true;
    dragStartX = ev.clientX;
    dragHasSwitched = false;
  }
}

function onPointerMove(ev) {
  if (!secondaryDragActive) return;

  const deltaX = ev.clientX - dragStartX;
  const threshold = window.innerWidth * 0.15; // 15% of width

  if (!dragHasSwitched) {
    if (deltaX > threshold) {
      // drag right → go to previous screen
      goPrevScreen();
      dragHasSwitched = true;
    } else if (deltaX < -threshold) {
      // drag left → go to next screen
      goNextScreen();
      dragHasSwitched = true;
    }
  }
}

function endPointerGesture() {
  secondaryDragActive = false;
  dragHasSwitched = false;
}

// -----------------------------
// Trackpad two-finger scroll (wheel)
// -----------------------------
// Two-finger horizontal scroll on a trackpad triggers a wheel event with deltaX.
// We use it as a high-level gesture to switch screens.

function onWheel(ev) {
  const now = performance.now();
  if (now - lastWheelSwitchTime < WHEEL_SWITCH_COOLDOWN_MS) return;

  if (Math.abs(ev.deltaX) < 20) return; // ignore small noise

  if (ev.deltaX > 0) {
    goNextScreen();
  } else {
    goPrevScreen();
  }

  lastWheelSwitchTime = now;
}

// -----------------------------
// Mobile: two-finger horizontal swipe (touch events)
// -----------------------------
// For clarity we use the classic Touch API here.
// - When 2 touches appear: record average X as start.
// - While 2 touches move: compute deltaX and switch similarly to desktop.

function averageTouchX(touches) {
  if (touches.length === 0) return 0;
  let sum = 0;
  for (let i = 0; i < touches.length; i++) {
    sum += touches[i].clientX;
  }
  return sum / touches.length;
}

function onTouchStart(ev) {
  if (ev.touches.length === 2) {
    touchSecondaryActive = true;
    touchStartX = averageTouchX(ev.touches);
  }
}

function onTouchMove(ev) {
  if (!touchSecondaryActive || ev.touches.length !== 2) return;

  const currentX = averageTouchX(ev.touches);
  const deltaX = currentX - touchStartX;
  const threshold = window.innerWidth * 0.15;

  if (Math.abs(deltaX) > threshold) {
    if (deltaX > 0) {
      goPrevScreen();
    } else {
      goNextScreen();
    }
    // After one switch, stop for this gesture.
    touchSecondaryActive = false;
  }

  // prevent page scrolling while we interpret gesture
  ev.preventDefault();
}

function onTouchEnd(ev) {
  if (ev.touches.length < 2) {
    touchSecondaryActive = false;
  }
}

// -----------------------------
// Init and wiring
// -----------------------------
function init() {
  console.log("IMI Example 2 · Screen switcher initialized");

  buildUI();
  goToScreen(SCREEN_A);

  // Pointer events for desktop secondary button drag
  window.addEventListener("pointerdown", onPointerDown);
  window.addEventListener("pointermove", onPointerMove);
  window.addEventListener("pointerup", endPointerGesture);
  window.addEventListener("pointercancel", endPointerGesture);
  window.addEventListener("pointerleave", endPointerGesture);

  // Suppress default context menu so right button feels like a pure gesture
  window.addEventListener("contextmenu", (ev) => ev.preventDefault());

  // Wheel for two-finger trackpad scroll
  window.addEventListener("wheel", onWheel, { passive: true });

  // Touch events for mobile two-finger swipe
  window.addEventListener("touchstart", onTouchStart, { passive: false });
  window.addEventListener("touchmove", onTouchMove, { passive: false });
  window.addEventListener("touchend", onTouchEnd, { passive: false });
  window.addEventListener("touchcancel", onTouchEnd, { passive: false });
}

window.addEventListener("DOMContentLoaded", init);