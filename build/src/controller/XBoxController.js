"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Controller_1 = __importDefault(require("../interfaces/Controller"));
const sdl2_gamecontroller_1 = __importDefault(require("sdl2-gamecontroller"));
const events_1 = __importDefault(require("events"));
class XboxController extends Controller_1.default {
    constructor(product, manufacturer, playerId) {
        super(product, manufacturer, playerId);
        this.eventEmitter = new events_1.default();
        // Left stick
        this.leftStickX = 0;
        this.leftStickY = 0;
        this.lefStickTimestamp = 0;
        // Right stick
        this.rightStickX = 0;
        this.rightStickY = 0;
    }
    async init() {
        return new Promise(resolve => {
            // Wait until SDL2 is initialized
            sdl2_gamecontroller_1.default.on('sdl-init', () => {
                console.log('Wait until an XBox controller connects');
                sdl2_gamecontroller_1.default.on('controller-device-added', data => {
                    console.log('Yeaha! Found an', data.name);
                    resolve();
                });
            });
        });
    }
    onLeftStickMotion(event) {
        sdl2_gamecontroller_1.default.on('leftx', (data) => {
            this.leftStickX = data.value;
            if (this.lefStickTimestamp < data.timestamp) {
                const leftStickMotionEvent = {
                    x: this.leftStickX,
                    y: this.leftStickY,
                };
                this.lefStickTimestamp = data.timestamp;
                event(leftStickMotionEvent);
            }
        });
        sdl2_gamecontroller_1.default.on('lefty', (data) => {
            this.leftStickY = data.value;
            if (this.lefStickTimestamp < data.timestamp) {
                const leftStickMotionEvent = {
                    x: this.leftStickX,
                    y: this.leftStickY,
                };
                this.lefStickTimestamp = data.timestamp;
                event(leftStickMotionEvent);
            }
        });
    }
}
exports.default = XboxController;
