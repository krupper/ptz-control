import GameController = require('./controller/test-controller.js');
import PanasonicCameraControl from './ptz/panasonic-camera-control';
declare class App {
    testController: GameController;
    ptz1: PanasonicCameraControl;
    constructor();
    run(): Promise<void>;
}
export default App;
