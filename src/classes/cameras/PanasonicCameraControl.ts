import IPtzCameras from './PtzCameras';
import axios, {AxiosError} from 'axios';
export default class PanasonicCameraControl extends IPtzCameras {
  constructor(
    cameraIdentifier: string,
    vendor: string,
    model: string,
    ip: string
  ) {
    super(cameraIdentifier, vendor, model, ip);

    setInterval(() => {
      this.runMessageQueue();
    }, this.panasonicMinimalMessageDelayInMs);
  }

  // Iris behaviour:
  //    1366 - 1600 Iris closed
  //    1601 - 4094 Iris open
  private irisMin = 1600;
  private irisMax = 4094;
  private panasonicMinimalMessageDelayInMs = 130;
  private lastPanTiltSpeed: string | undefined;
  private lastZoomSpeed: string | undefined;
  private lastFocusSpeed: string | undefined;
  private importantEventsQueue: string[] = [];

  setPanTiltSpeed(pan: number, tilt: number) {
    if (pan < -100 || pan > 100) {
      console.log('Pan speed is out of range (-100 to 100). Value: ' + pan);
    }
    if (tilt < -100 || tilt > 100) {
      console.log('Tilt speed is out of range (-100 to 100). Value: ' + tilt);
    }

    // conversion to panasonic scale 01-99
    const panasonic_pan = (0.49 * pan + 50)
      .toFixed()
      .toString()
      .padStart(2, '0');
    const panasonic_tilt = (0.49 * tilt + 50)
      .toFixed()
      .toString()
      .padStart(2, '0');
    const command = 'PTS' + panasonic_pan + panasonic_tilt;

    return this.sendCommandToPTZ('panTiltSpeed', command, false);
  }

  setZoomSpeed(speed: number) {
    if (speed < -100 || speed > 100) {
      console.log('Zoom speed is out of range (-100 to 100). Value: ' + speed);
    }

    // conversion to panasonic scale 01-99
    const panasonic_zoom = (0.49 * speed + 50)
      .toFixed()
      .toString()
      .padStart(2, '0');
    const command = 'Z' + panasonic_zoom;
    console.log(command);

    return this.sendCommandToPTZ('zoomSpeed', command, false);
  }

  setAutoFocus(status: boolean) {
    const command = 'D1' + status ? '0' : '1';
    this.sendCommandToPTZ('other', command, true);
  }

  setFocusSpeed(speed: number) {
    if (speed < -100 || speed > 100) {
      console.log('Focus speed is out of range (-100 to 100). Value: ' + speed);
    }

    // conversion to panasonic scale 01-99
    const panasonic_focus = (0.49 * speed + 50)
      .toFixed()
      .toString()
      .padStart(2, '0');
    const command = 'Z' + panasonic_focus;

    return this.sendCommandToPTZ('focusSpeed', command, false);
  }

  setAutoIris(status: boolean) {
    const command = 'D3' + status ? '0' : '1';
    this.sendCommandToPTZ('other', command, true);
  }

  stepIris(direction: 'up' | 'down', stepSize: number) {
    const get_command = 'AXI';
    this.sendCommandInstantToPTZ(get_command).then(response => {
      // extract value command
      const currentIrisValue = response?.replace('axi', '');
      console.log('currentIrisValue: ' + currentIrisValue);

      // check if value present
      if (!currentIrisValue) {
        console.log('Could not read current Iris value.');
        return;
      }

      let newIrisValue;

      if (direction === 'down') {
        newIrisValue = PanasonicCameraControl.previousHexStep(
          currentIrisValue,
          stepSize,
          this.irisMin,
          this.irisMax
        );
      }

      if (direction === 'up') {
        newIrisValue = PanasonicCameraControl.nextHexStep(
          currentIrisValue,
          stepSize,
          this.irisMin,
          this.irisMax
        );
      }

      newIrisValue = newIrisValue?.toUpperCase();

      console.log('newIrisValue: ' + newIrisValue);

      const command = 'AXI' + newIrisValue;
      this.sendCommandToPTZ('other', command, true);
    });
  }

  playbackPreset(presetNumber: number) {
    if (presetNumber < 0 || presetNumber > 99) {
      console.log(
        'Focus presetNumber is out of range (-100 to 100). Value: ' +
          presetNumber
      );
    }
    const command = 'R' + presetNumber;
    this.sendCommandToPTZ('other', command, true);
  }

  private sendCommandToPTZ(
    type: 'panTiltSpeed' | 'zoomSpeed' | 'focusSpeed' | 'other',
    command: string,
    importantEvent: boolean
  ): void {
    if (importantEvent) {
      this.importantEventsQueue.push(command);
      return;
    }
    switch (type) {
      case 'panTiltSpeed':
        this.lastPanTiltSpeed = command;
        break;
      case 'zoomSpeed':
        this.lastZoomSpeed = command;
        break;
      case 'focusSpeed':
        this.lastFocusSpeed = command;
        break;
      default:
        break;
    }
  }

  private async sendCommandInstantToPTZ(
    command: string
  ): Promise<string | undefined> {
    const url =
      'http://' + this.ip + '/cgi-bin/aw_ptz?cmd=%23' + command + '&res=1';
    console.log(url);
    try {
      const data = await axios.get(url, {timeout: 500});
      return data.data;
    } catch (err) {
      const error = err as Error | AxiosError;
      console.log(
        'Error sending command to camera: ' + error.message + ' ' + url
      );
      return;
    }
  }

  private runMessageQueue() {
    if (this.importantEventsQueue.length) {
      const nextEvent = this.importantEventsQueue.shift();
      if (nextEvent) this.sendCommandInstantToPTZ(nextEvent);
      return;
    }
    if (this.lastPanTiltSpeed) {
      this.sendCommandInstantToPTZ(this.lastPanTiltSpeed);
      this.lastPanTiltSpeed = undefined;
      return;
    }
    if (this.lastZoomSpeed) {
      this.sendCommandInstantToPTZ(this.lastZoomSpeed);
      this.lastZoomSpeed = undefined;
      return;
    }
    if (this.lastFocusSpeed) {
      this.sendCommandInstantToPTZ(this.lastFocusSpeed);
      this.lastFocusSpeed = undefined;
      return;
    }
  }

  private static hexToNumber(hex: string): number {
    return parseInt(hex, 16);
  }

  private static numberToHex(number: number): string {
    return number.toString(16);
  }

  private static nextHexStep(
    hex: string,
    step: number,
    min: number,
    max: number
  ): string {
    let number = this.hexToNumber(hex);
    number = number + step;
    if (number < min || number > max) {
      console.log('Hex value out of range');
      number = max;
    }
    return this.numberToHex(number);
  }

  private static previousHexStep(
    hex: string,
    step: number,
    min: number,
    max: number
  ): string {
    let number = this.hexToNumber(hex);
    number = number - step;
    if (number < min || number > max) {
      console.log('Hex value out of range');
      number = min;
    }
    return this.numberToHex(number);
  }
}
