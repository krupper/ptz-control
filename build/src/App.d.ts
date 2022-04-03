import Controller from './interfaces/Controller';
import XboxController from './controller/XBoxController';
declare class App {
    controller: Controller | XboxController;
    constructor();
    run(): Promise<void>;
}
export default App;
