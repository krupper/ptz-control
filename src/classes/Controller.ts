import StickMotionEvent from '../interfaces/IStickMotionEvent';
abstract class Controller {
  product: string;
  manufacturer: string;
  playerId: number;
  joystickDeviceIndex: number; // also called "which"

  constructor(
    product: string,
    manufacturer: string,
    playerId: number,
    joystickDeviceIndex: number
  ) {
    this.product = product;
    this.manufacturer = manufacturer;
    this.playerId = playerId;
    this.joystickDeviceIndex = joystickDeviceIndex;
  }

  abstract onLeftStickMotion(callback: (data: StickMotionEvent) => void): void;
}

export default Controller;
