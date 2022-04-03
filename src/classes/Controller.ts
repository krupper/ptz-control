import StickMotionEvent from '../interfaces/IStickMotionEvent';
abstract class Controller {
  product: string;
  manufacturer: string;
  playerId: number;

  constructor(product: string, manufacturer: string, playerId: number) {
    this.product = product;
    this.manufacturer = manufacturer;
    this.playerId = playerId;
  }

  abstract init(): Promise<void>;
  abstract onLeftStickMotion(callback: (data: StickMotionEvent) => void): void;
}

export default Controller;
