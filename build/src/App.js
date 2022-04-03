"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const XBoxController_1 = __importDefault(require("./controller/XBoxController"));
class App {
    // testController: GameController;
    //ptz1 = new PanasonicCameraControl('172.17.121.81');
    constructor() {
        this.controller = new XBoxController_1.default('XBox Controller', 'Microsoft', 1);
        // this.testController = new GameController();
    }
    async run() {
        await this.controller.init();
        this.controller.onLeftStickMotion(event => {
            console.log(event);
        });
        console.log('Wait for commands');
        // this.testController = new GameController();
        // await this.testController.init();
        // this.testController.on('button', (btn: any) => {
        //   // console.log(`Button: ${btn} pressed`);
        //   if (btn === '"TRIGGER_RIGHT"') {
        //     this.ptz1.setZoomSpeed(-50);
        //   }
        //   if (btn === '"TRIGGER_LEFT"') {
        //     this.ptz1.setZoomSpeed(50);
        //   }
        //   if (btn === '"A"') {
        //     this.ptz1.setZoomSpeed(0);
        //   }
        // });
        // this.testController.on('thumbsticks', (val: any) => {
        //   // console.log(val);
        //   const temp = val.replace('[', '').replace(']', '').split(',');
        //   const x = (temp[0] * 100) / 2;
        //   const y = (temp[1] * 100) / 2;
        //   // console.log('Pos: x:' + x.toFixed() + ' y: ' + y.toFixed());
        //   this.ptz1.setPanTiltSpeed(x, y * -1);
        // });
    }
}
exports.default = App;
