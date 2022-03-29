"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameController = require("./controller/test-controller.js");
const panasonic_camera_control_1 = __importDefault(require("./ptz/panasonic-camera-control"));
class App {
    constructor() {
        this.ptz1 = new panasonic_camera_control_1.default('172.17.121.81');
        // this.controller = new XboxController();
        this.testController = new GameController();
    }
    async run() {
        this.testController = new GameController();
        await this.testController.init();
        this.testController.on('button', (btn) => {
            // console.log(`Button: ${btn} pressed`);
            if (btn === '"TRIGGER_RIGHT"') {
                this.ptz1.setZoomSpeed(-50);
            }
            if (btn === '"TRIGGER_LEFT"') {
                this.ptz1.setZoomSpeed(50);
            }
            if (btn === '"A"') {
                this.ptz1.setZoomSpeed(0);
            }
        });
        this.testController.on('thumbsticks', (val) => {
            // console.log(val);
            const temp = val.replace('[', '').replace(']', '').split(',');
            const x = (temp[0] * 100) / 2;
            const y = (temp[1] * 100) / 2;
            // console.log('Pos: x:' + x.toFixed() + ' y: ' + y.toFixed());
            this.ptz1.setPanTiltSpeed(x, y * -1);
        });
    }
}
exports.default = App;
