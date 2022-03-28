const puppeteer = require('puppeteer');
const EventEmitter = require('events').EventEmitter;
const buttons = require('./xbox.json');
class GameController {
  constructor() {
    this.eventEmitter = new EventEmitter();
    this.SIGNAL_POLL_INTERVAL_MS = 50;
    this.THUMBSTICK_NOISE_THRESHOLD = 0.15;
  }
  on(event, cb) {
    this.eventEmitter.on(event, cb);
  }
  async init() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    // Expose a handler to the page
    await page.exposeFunction('sendEventToProcessHandle', (event, msg) => {
      this.eventEmitter.emit(event, JSON.stringify(msg));
    });
    await page.exposeFunction('consoleLog', e => {
      console.log(e);
    });
    // listen for events of type 'status' and
    // pass 'type' and 'detail' attributes to our exposed function
    await page.evaluate(
      ([buttons, SIGNAL_POLL_INTERVAL_MS, THUMBSTICK_NOISE_THRESHOLD]) => {
        const interval = {};
        window.addEventListener('gamepadconnected', e => {
          let gp = navigator.getGamepads()[e.gamepad.index];
          window.sendEventToProcessHandle('GAMEPAD_CONNECTED');
          interval[e.gamepad.index] = setInterval(() => {
            gp = navigator.getGamepads()[e.gamepad.index];
            // [
            //    0 = THUMBSTICK_LEFT_LEFT_RIGHT,
            //    1 = THUMBSTICK_LEFT_UP_DOWN,
            //    2 = THUMBSTICK_RIGHT_LEFT_RIGHT,
            //    3 = THUMBSTICK_RIGHT_UP_DOWN
            // ]
            const sum = gp.axes.reduce((a, b) => a + b, 0);
            if (Math.abs(sum) > THUMBSTICK_NOISE_THRESHOLD) {
              window.sendEventToProcessHandle('thumbsticks', gp.axes);
            }
            for (let i = 0; i < gp.buttons.length; i++) {
              if (gp.buttons[i].pressed == true) {
                window.sendEventToProcessHandle(buttons[i]);
                window.sendEventToProcessHandle('button', buttons[i]);
              }
            }
          }, SIGNAL_POLL_INTERVAL_MS);
        });
        window.addEventListener('gamepaddisconnected', e => {
          window.sendEventToProcessHandle('GAMEPAD_DISCONNECTED');
          window.consoleLog('Gamepad disconnected at index ' + gp.index);
          clearInterval(interval[e.gamepad.index]);
        });
      },
      [buttons, this.SIGNAL_POLL_INTERVAL_MS, this.THUMBSTICK_NOISE_THRESHOLD]
    );
  }
}

(async () => {
  const gameController = new GameController();
  await gameController.init();
  gameController.on('button', btn => console.log(`Button: ${btn} pressed`));
  gameController.on('thumbsticks', val => console.log(val));
})();
