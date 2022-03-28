import Controller from '../interfaces/Controller';
import * as puppeteer from 'puppeteer';
import {EventEmitter} from 'events';

class XboxController implements Controller {
  eventEmitter: EventEmitter;
  SIGNAL_POLL_INTERVAL_MS = 50;
  THUMBSTICK_NOISE_THRESHOLD = 0.15;

  manufacturer = 'Microsoft';
  vendorId = 1118;
  product = 'Xbox Wireless Controller';
  productId = 2835;

  constructor() {
    this.eventEmitter = new EventEmitter();
  }

  async test(): Promise<void> {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    page.on('console', (message: any) => console.log(message.text()));

    await page.evaluate(() => {
      console.info('A console message within the page');
      window.addEventListener('gamepadconnected', e => {
        const gp = navigator.getGamepads()[e.gamepad.index];

        console.log(gp);
      });
    });

    await page.close();
  }

  async init(): Promise<void> {}
  on(event: any, cb: any) {
    this.eventEmitter.on(event, cb);
  }
}

export default XboxController;
