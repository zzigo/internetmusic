/**
 * ═══════════════════════════════════════════════════════════════════════════
 * MAIN.JS - MULTI-INSTRUMENT SWIPE NAVIGATION SYSTEM
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * ARCHITECTURE OVERVIEW:
 * ----------------------
 * This application implements a **Plugin Architecture Pattern** where multiple
 * musical instruments (hp-A, hp-B, hp-C) can be dynamically loaded/unloaded.
 * Users navigate between instruments using intuitive swipe gestures.
 * 
 * DESIGN PATTERNS EMPLOYED:
 * -------------------------
 * 1. **Module Pattern**: Each instrument (hp-A.js, hp-B.js, etc.) is a self-
 *    contained module with its own initialization and cleanup logic.
 * 
 * 2. **Lazy Loading Pattern**: Instruments are loaded on-demand when needed,
 *    not all at once. This improves initial page load performance.
 * 
 * 3. **Lifecycle Management Pattern**: Each instrument has load/unload hooks,
 *    ensuring proper resource management (audio contexts, event listeners, DOM).
 * 
 * CORE TECHNOLOGIES:
 * ------------------
 * - **Pointer Events API**: Unified handling of mouse, touch, and pen inputs
 * - **Touch Events API**: Multi-touch gesture recognition (2-finger swipe)
 * - **Wheel Events API**: Trackpad horizontal scroll detection
 * - **Web Audio API**: Each instrument uses Web Audio for sound generation
 * - **Dynamic Script Loading**: JavaScript modules loaded at runtime via DOM
 * - **CSS Modules**: Each instrument has its own stylesheet dynamically loaded
 * 
 * GESTURE SYSTEM:
 * ---------------
 * Three input methods supported:
 * 1. Desktop: Right-click drag (secondary button gesture)
 * 2. Mobile: Two-finger horizontal swipe
 * 3. Trackpad: Two-finger horizontal scroll (wheel event)
 * 
 * Navigation logic:
 * - Swipe/drag RIGHT → Previous instrument (index - 1)
 * - Swipe/drag LEFT  → Next instrument (index + 1)
 * - Circular array: wraps around at boundaries
 * ═══════════════════════════════════════════════════════════════════════════
 */

// ─────────────────────────────────────────────────────────────────────────────
// STATE MANAGEMENT
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Holds reference to the currently active instrument's API object.
 * Each instrument returns an object with methods like noteOn(), noteOff(), unload().
 */
let currentInstrument = null;

/**
 * Name identifier of the current instrument (e.g., "hp-A").
 */
let currentInstrumentName = '';

/**
 * PLUGIN REGISTRY: Array of available instrument module names.
 * Each entry corresponds to files: hp-X.js and hp-X.css.
 * Add new instruments here to expand the collection.
 */
const instruments = ['hp-A', 'hp-B', 'hp-C'];

/**
 * Zero-based index pointing to the current instrument in the array.
 * Used for circular navigation logic.
 */
let currentInstrumentIndex = 0; // Start with hp-A (the FM synth instrument)

// ─────────────────────────────────────────────────────────────────────────────
// DYNAMIC INSTRUMENT LOADING SYSTEM
// ─────────────────────────────────────────────────────────────────────────────

/**
 * CORE LOADER FUNCTION
 * Implements the **Hot-Swapping Pattern** for instruments.
 * 
 * LIFECYCLE PHASES:
 * -----------------
 * 1. CLEANUP: Unload previous instrument (release resources)
 * 2. STYLE INJECTION: Remove old CSS, inject new CSS
 * 3. SCRIPT INJECTION: Load new JavaScript module
 * 4. INITIALIZATION: Call instrument's load function
 * 
 * NAMING CONVENTION:
 * ------------------
 * File "hp-A" maps to function "loadHpA()" (camelCase conversion)
 * File "hp-B" maps to function "loadHpB()"
 * 
 * RESOURCE MANAGEMENT:
 * --------------------
 * Each instrument must implement an unload() method to:
 * - Close audio contexts
 * - Remove event listeners
 * - Clean up DOM elements
 * This prevents memory leaks during instrument switching.
 * 
 * @param {string} instrumentName - Identifier like "hp-A", "hp-B", "hp-C"
 */
function loadInstrument(instrumentName) {
  // ─── PHASE 1: CLEANUP ─────────────────────────────────────────────────────
  // Call the unload lifecycle hook if the previous instrument defined it
  if (currentInstrument && typeof currentInstrument.unload === 'function') {
    currentInstrument.unload();
  }

  // ─── PHASE 2: STYLE MANAGEMENT ───────────────────────────────────────────
  // Remove previously loaded instrument CSS (prevents style conflicts)
  const oldLink = document.querySelector(`link[data-instrument]`);
  if (oldLink) {
    oldLink.remove();
  }

  // Inject new CSS: Create <link> element and append to <head>
  const cssFile = `${instrumentName}.css`;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `src/${cssFile}`;
  link.dataset.instrument = instrumentName; // Tag for later removal
  document.head.appendChild(link);

  // ─── PHASE 3: SCRIPT LOADING ─────────────────────────────────────────────
  // Dynamically inject JavaScript module into the DOM
  const jsFile = `${instrumentName}.js`;
  const script = document.createElement('script');
  script.src = `src/${jsFile}`;
  
  // ─── PHASE 4: INITIALIZATION ─────────────────────────────────────────────
  // After script loads, call its initialization function
  script.onload = () => {
    currentInstrumentName = instrumentName;
    
    // Convert "hp-A" → "loadHpA" using regex replacement
    // Pattern: Replace "-x" with "X" (uppercase)
    const loadFunctionName = `load${instrumentName.replace(/-(\w)/g, (match, letter) => letter.toUpperCase())}`;
    
    // Call the load function if it exists, store returned API object
    if (typeof window[loadFunctionName] === 'function') {
        currentInstrument = window[loadFunctionName]();
    }
  };
  
  document.body.appendChild(script);
}

// ─────────────────────────────────────────────────────────────────────────────
// GESTURE RECOGNITION STATE MACHINES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * DESKTOP POINTING DEVICE STATE (Mouse, Touchpad, etc.)
 * Uses right-click + drag as a "secondary gesture" distinct from primary interactions.
 */
let secondaryDragActive = false; // Tracks if right button is being held down
let dragStartX = 0;              // X coordinate where drag began
let dragHasSwitched = false;     // Prevents multiple switches in one gesture

/**
 * MOBILE TOUCH STATE
 * Recognizes two-finger horizontal swipes (standard mobile gesture).
 */
let touchSecondaryActive = false; // Tracks if 2-finger gesture is active
let touchStartX = 0;              // Average X position of both fingers at start

/**
 * TRACKPAD WHEEL STATE
 * Detects horizontal scroll (two-finger swipe on trackpad).
 * Uses cooldown to prevent rapid-fire switching.
 */
let lastWheelSwitchTime = 0;           // Timestamp of last successful switch
const WHEEL_SWITCH_COOLDOWN_MS = 500; // Minimum time between switches (ms)

// ─────────────────────────────────────────────────────────────────────────────
// NAVIGATION COMMANDS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Navigate to the next instrument (circular forward motion).
 * Uses modulo arithmetic to wrap around: [A, B, C] → after C comes A.
 */
function goNextInstrument() {
    currentInstrumentIndex = (currentInstrumentIndex + 1) % instruments.length;
    loadInstrument(instruments[currentInstrumentIndex]);
}

/**
 * Navigate to the previous instrument (circular backward motion).
 * Adding array length before modulo handles negative wrap: A → C.
 */
function goPrevInstrument() {
    currentInstrumentIndex = (currentInstrumentIndex - 1 + instruments.length) % instruments.length;
    loadInstrument(instruments[currentInstrumentIndex]);
}

// ─────────────────────────────────────────────────────────────────────────────
// DESKTOP GESTURE HANDLERS (Pointer Events API)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * POINTER DOWN HANDLER
 * Initiates right-click drag gesture tracking.
 * 
 * BUTTON CODES:
 * - 0 = Primary (usually left button)
 * - 1 = Auxiliary (usually middle button)
 * - 2 = Secondary (usually right button) ← We use this
 * 
 * @param {PointerEvent} ev - Contains button info and coordinates
 */
function onPointerDown(ev) {
  // Filter: Only respond to right-button presses
  if (ev.button === 2) {
    secondaryDragActive = true;
    dragStartX = ev.clientX;
    dragHasSwitched = false; // Reset switch flag for new gesture
  }
}

/**
 * POINTER MOVE HANDLER
 * Continuously tracks drag distance and triggers navigation.
 * 
 * THRESHOLD SYSTEM:
 * - Requires 15% of screen width movement to trigger
 * - Prevents accidental switches from small movements
 * - One-shot: Only switches once per gesture
 * 
 * DIRECTION MAPPING:
 * - Positive deltaX (moving right) → Previous instrument
 * - Negative deltaX (moving left)  → Next instrument
 * 
 * @param {PointerEvent} ev - Contains current pointer position
 */
function onPointerMove(ev) {
  if (!secondaryDragActive) return;

  const deltaX = ev.clientX - dragStartX;
  const threshold = window.innerWidth * 0.15; // 15% of viewport width

  if (!dragHasSwitched) {
    if (deltaX > threshold) {
      // Drag right → Previous screen (intuitive swipe-back)
      goPrevInstrument();
      dragHasSwitched = true;
    } else if (deltaX < -threshold) {
      // Drag left → Next screen (intuitive swipe-forward)
      goNextInstrument();
      dragHasSwitched = true;
    }
  }
}

/**
 * GESTURE TERMINATION
 * Resets state when pointer is released or leaves the window.
 * Called by: pointerup, pointercancel, pointerleave events.
 */
function endPointerGesture() {
  secondaryDragActive = false;
  dragHasSwitched = false;
}

// ─────────────────────────────────────────────────────────────────────────────
// TRACKPAD GESTURE HANDLER (Wheel Events API)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * WHEEL EVENT HANDLER
 * Detects horizontal two-finger scrolls on trackpads.
 * 
 * CHALLENGES ADDRESSED:
 * ---------------------
 * 1. **Noise Filtering**: Trackpads emit many small events; threshold filters these
 * 2. **Rate Limiting**: Cooldown prevents multiple rapid switches from one gesture
 * 3. **High-Resolution Timing**: Uses performance.now() for precise cooldown tracking
 * 
 * DELTA VALUES:
 * - deltaX > 0: Scrolling right → Next instrument
 * - deltaX < 0: Scrolling left  → Previous instrument
 * 
 * @param {WheelEvent} ev - Contains deltaX (horizontal scroll amount)
 */
function onWheel(ev) {
    const now = performance.now();
    
    // Rate limiting: Ignore events within cooldown window
    if (now - lastWheelSwitchTime < WHEEL_SWITCH_COOLDOWN_MS) return;
  
    // Noise filtering: Ignore tiny movements (accidental touches)
    if (Math.abs(ev.deltaX) < 20) return;
  
    // Direction logic
    if (ev.deltaX > 0) {
        goNextInstrument();
    } else {
        goPrevInstrument();
    }
  
    lastWheelSwitchTime = now;
  }

// ─────────────────────────────────────────────────────────────────────────────
// MOBILE TOUCH GESTURE HANDLERS (Touch Events API)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * HELPER: Calculate centroid of multiple touch points.
 * For 2-finger gestures, this gives the midpoint between fingers.
 * 
 * WHY AVERAGE?
 * - Provides stable reference even if fingers aren't parallel
 * - Reduces jitter from individual finger movements
 * 
 * @param {TouchList} touches - Array-like collection of Touch objects
 * @returns {number} Average X coordinate across all touches
 */
  function averageTouchX(touches) {
    if (touches.length === 0) return 0;
    let sum = 0;
    for (let i = 0; i < touches.length; i++) {
      sum += touches[i].clientX;
    }
    return sum / touches.length;
  }
  
  /**
   * TOUCH START HANDLER
   * Activates two-finger gesture tracking when exactly 2 touches detected.
   * 
   * STRICT REQUIREMENT:
   * - Must be exactly 2 fingers (not 1, not 3)
   * - Captures initial centroid position as reference
   * 
   * @param {TouchEvent} ev - Contains touches array with all active touch points
   */
  function onTouchStart(ev) {
    if (ev.touches.length === 2) {
      touchSecondaryActive = true;
      touchStartX = averageTouchX(ev.touches);
    }
  }
  
  /**
   * TOUCH MOVE HANDLER
   * Continuously tracks two-finger swipe distance.
   * 
   * STATE VALIDATION:
   * - Gesture must be active (started with 2 fingers)
   * - Must still have exactly 2 fingers down
   * 
   * THRESHOLD & ONE-SHOT:
   * - Same 15% threshold as desktop gestures
   * - Deactivates after first switch to prevent multiple triggers
   * 
   * SCROLL PREVENTION:
   * - ev.preventDefault() stops browser's default scroll behavior
   * - Critical for smooth UX (prevents page bounce)
   * 
   * @param {TouchEvent} ev - Updated touch positions
   */
  function onTouchMove(ev) {
    if (!touchSecondaryActive || ev.touches.length !== 2) return;
  
    const currentX = averageTouchX(ev.touches);
    const deltaX = currentX - touchStartX;
    const threshold = window.innerWidth * 0.15;
  
    if (Math.abs(deltaX) > threshold) {
      if (deltaX > 0) {
        goPrevInstrument();
      } else {
        goNextInstrument();
      }
      // One-shot: Disable gesture after successful switch
      touchSecondaryActive = false;
    }
  
    // Prevent default scroll behavior during gesture recognition
    ev.preventDefault();
  }
  
  /**
   * TOUCH END HANDLER
   * Deactivates gesture when finger count drops below 2.
   * Handles both touchend and touchcancel events.
   * 
   * @param {TouchEvent} ev - Updated touch state
   */
  function onTouchEnd(ev) {
    if (ev.touches.length < 2) {
      touchSecondaryActive = false;
    }
  }

// ─────────────────────────────────────────────────────────────────────────────
// APPLICATION INITIALIZATION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * BOOTSTRAP FUNCTION
 * Sets up all event listeners and loads initial instrument.
 * 
 * EVENT LISTENER STRATEGY:
 * ------------------------
 * Three parallel input systems run simultaneously:
 * 1. Pointer Events (desktop)
 * 2. Touch Events (mobile)
 * 3. Wheel Events (trackpad)
 * 
 * Browser automatically routes events to correct handler based on input device.
 * 
 * PASSIVE vs NON-PASSIVE:
 * -----------------------
 * - passive: true  → Cannot call preventDefault(), improves scroll performance
 * - passive: false → Can call preventDefault(), needed for touch gesture override
 * 
 * POINTER EVENT COVERAGE:
 * -----------------------
 * Multiple termination events ensure gesture cleanup in all scenarios:
 * - pointerup: Normal release
 * - pointercancel: Browser interrupted (e.g., alert dialog)
 * - pointerleave: Pointer exited window bounds
 */
function init() {
  // ─── LOAD INITIAL INSTRUMENT ─────────────────────────────────────────────
  loadInstrument(instruments[currentInstrumentIndex]);

  // ─── DESKTOP INPUT (Pointer Events API) ──────────────────────────────────
  // Unified API for mouse, pen, touch (we use for right-click drag)
  window.addEventListener("pointerdown", onPointerDown);
  window.addEventListener("pointermove", onPointerMove);
  window.addEventListener("pointerup", endPointerGesture);
  window.addEventListener("pointercancel", endPointerGesture);
  window.addEventListener("pointerleave", endPointerGesture);

  // Disable context menu: right-click is now a gesture, not a menu trigger
  window.addEventListener("contextmenu", (ev) => ev.preventDefault());

  // ─── TRACKPAD INPUT (Wheel Events API) ────────────────────────────────────
  // Two-finger horizontal scroll detection
  // Passive: true → Better performance, we don't need preventDefault
  window.addEventListener("wheel", onWheel, { passive: true });

  // ─── MOBILE INPUT (Touch Events API) ──────────────────────────────────────
  // Two-finger swipe gesture recognition
  // Passive: false → Allows preventDefault() to stop default scrolling
  window.addEventListener("touchstart", onTouchStart, { passive: false });
  window.addEventListener("touchmove", onTouchMove, { passive: false });
  window.addEventListener("touchend", onTouchEnd, { passive: false });
  window.addEventListener("touchcancel", onTouchEnd, { passive: false });
}

// ─── APPLICATION ENTRY POINT ─────────────────────────────────────────────────
// Wait for DOM to be fully parsed before initializing
window.addEventListener('DOMContentLoaded', init);

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * TECHNICAL SUMMARY
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * ARCHITECTURE: Plugin-based hot-swappable instrument system
 * 
 * KEY PATTERNS:
 * - Module Pattern (instrument encapsulation)
 * - Lazy Loading (on-demand resource loading)
 * - Lifecycle Management (load/unload hooks)
 * - State Machine (gesture recognition)
 * - Threshold Detection (noise filtering)
 * 
 * TECHNOLOGIES:
 * - Pointer Events API (unified input)
 * - Touch Events API (multi-touch gestures)
 * - Wheel Events API (trackpad scrolling)
 * - Dynamic Script/CSS injection (runtime loading)
 * - Web Audio API (in individual instruments)
 * 
 * GESTURE MECHANICS:
 * - Desktop: Right-click + horizontal drag
 * - Mobile: Two-finger horizontal swipe
 * - Trackpad: Two-finger scroll (horizontal)
 * - All use 15% viewport width threshold
 * - All implement one-shot switching per gesture
 * 
 * EXTENSIBILITY:
 * - Add new instruments: Create hp-X.js/css, add "hp-X" to instruments array
 * - Each instrument implements: loadHpX() function returning {unload: fn}
 * - Shared utilities available in globals.js
 * ═══════════════════════════════════════════════════════════════════════════
 */
