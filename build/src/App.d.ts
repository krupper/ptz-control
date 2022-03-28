import Controller from './interfaces/Controller';
import GameController = require('./controller/test-controller.js');
declare class App {
    controller: Controller;
    testController: GameController;
    constructor();
    run(): Promise<void>;
}
export default App;
