"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const panasonic_camera_control_1 = require("./ptz/panasonic-camera-control");
class App {
    //   constructor() {
    //   }
    run() {
        console.log('Hello World');
        const ptz1 = new panasonic_camera_control_1.default('172.17.121.84');
        ptz1.stepIris('down', 100);
    }
}
exports.default = App;
