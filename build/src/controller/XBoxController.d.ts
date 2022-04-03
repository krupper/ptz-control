import Controller from '../interfaces/Controller';
import StickMotionEvent from '../interfaces/IStickMotionEvent';
declare class XboxController extends Controller {
    private eventEmitter;
    private leftStickX;
    private leftStickY;
    private lefStickTimestamp;
    private rightStickX;
    private rightStickY;
    constructor(product: string, manufacturer: string, playerId: number);
    init(): Promise<void>;
    onLeftStickMotion(event: (event: StickMotionEvent) => void): void;
}
export default XboxController;
