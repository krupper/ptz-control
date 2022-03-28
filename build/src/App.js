"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const microsoft_xbox_1 = __importDefault(require("./controller/microsoft-xbox"));
const GameController = require("./controller/test-controller.js");
class App {
    constructor() {
        this.controller = new microsoft_xbox_1.default();
        this.testController = new GameController();
    }
    async run() {
        this.testController = new GameController();
        await this.testController.init();
        this.testController.on('button', (btn) => console.log(`Button: ${btn} pressed`));
        this.testController.on('thumbsticks', (val) => {
            console.log(val);
            const temp = val.replace('[', '').replace(']', '').split(',');
            const x = temp[0] * 100;
            const y = temp[1] * 100;
            console.log('Pos: x:' + x.toFixed() + ' y: ' + y.toFixed());
        });
    }
}
exports.default = App;
