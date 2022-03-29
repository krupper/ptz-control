"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer = __importStar(require("puppeteer"));
const events_1 = require("events");
class XboxController {
    constructor() {
        this.SIGNAL_POLL_INTERVAL_MS = 50;
        this.THUMBSTICK_NOISE_THRESHOLD = 0.15;
        this.manufacturer = 'Microsoft';
        this.vendorId = 1118;
        this.product = 'Xbox Wireless Controller';
        this.productId = 2835;
        this.eventEmitter = new events_1.EventEmitter();
    }
    async test() {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        page.on('console', (message) => console.log(message.text()));
        await page.evaluate(() => {
            console.info('A console message within the page');
            window.addEventListener('gamepadconnected', e => {
                const gp = navigator.getGamepads()[e.gamepad.index];
                console.log(gp);
            });
        });
        await page.close();
    }
    async init() { }
    on(event, cb) {
        this.eventEmitter.on(event, cb);
    }
}
exports.default = XboxController;
