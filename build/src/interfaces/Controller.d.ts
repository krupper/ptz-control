import StickMotionEvent from './IStickMotionEvent';
declare abstract class Controller {
    product: string;
    manufacturer: string;
    playerId: number;
    constructor(product: string, manufacturer: string, playerId: number);
    abstract init(): Promise<void>;
    abstract onLeftStickMotion(callback: (event: StickMotionEvent) => void): void;
}
export default Controller;
