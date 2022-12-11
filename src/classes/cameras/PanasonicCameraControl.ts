import IPtzCameras from './PtzCameras';
import axios, { AxiosError } from 'axios';
import BezierEasing from 'bezier-easing';

// build according to
// https://eww.pass.panasonic.co.jp/pro-av/support/content/guide/DEF/HE50_120_IP/HDIntegratedCamera_InterfaceSpecifications-E.pdf
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
    }, PanasonicCameraControl.panasonicMinimalMessageDelayInMs);
  }

  // Iris behaviour:
  //    1366 - 1600 Iris closed
  //    1601 - 4094 Iris open
  private static irisMin = 1600;
  private static irisMax = 4094;
  private static panasonicMinimalMessageDelayInMs = 130; // taken from panasonic specifications
  private lastPanTiltSpeed: string | undefined;
  private lastZoomSpeed: string | undefined;
  private lastFocusSpeed: string | undefined;
  private currentZoomSpeed: number = 0;
  private importantEventsQueue: string[] = [];
  private fluctualEventQueueRoundRobin = 0;
  private fluctualEventQueueRoundRobinParticipants = 3; // pan-tilt speed, zoom speed, focus speed
  private autoZoomAnimationTimer: NodeJS.Timeout | undefined = undefined;

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
      return;
    }

    // set current zoom speed (zoom speed can not be queried from the camera so we have to save it)
    this.currentZoomSpeed = speed;

    // conversion to panasonic scale 01-99
    const panasonic_zoom = (0.49 * speed + 50)
      .toFixed()
      .toString()
      .padStart(2, '0');
    const command = 'Z' + panasonic_zoom;

    return this.sendCommandToPTZ('zoomSpeed', command, false);
  }

  toggleAutoZoom(speed: number) {
    console.log({
      'this.currentZoomSpeed': this.currentZoomSpeed
    });

    const zoomSpeedThreshold = 1;

    // set new zoom speed or stop zoom
    if (this.currentZoomSpeed < zoomSpeedThreshold && this.currentZoomSpeed > zoomSpeedThreshold * -1) {
      this.setZoomSpeed(speed);
    } else {
      this.setZoomSpeed(0);
    }

    // return this.setZoomSpeed(newZoomSpeed);
  }

  setAutoFocus(status: boolean) {
    const command = 'D1' + status ? '0' : '1';
    this.sendCommandToPTZ('other', command, true);
  }

  toggleAutoFocus() {
    const get_command = 'D1';
    return this.sendCommandInstantToPTZ(get_command).then(response => {
      // extract value command
      const currentAutoFocusState = response?.replace('d1', '');

      // check if value present
      if (!currentAutoFocusState) {
        console.log('Could not read current auto focus state.');
        return;
      }

      let newAutoFocusState: boolean;
      if (currentAutoFocusState === '0') {
        newAutoFocusState = true;
      } else {
        newAutoFocusState = false;
      }

      const command = 'D1' + (newAutoFocusState ? '1' : '0');
      this.sendCommandToPTZ('other', command, true);

      // return state
      return Promise.resolve(newAutoFocusState);
    });
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
    const command = 'F' + panasonic_focus;

    return this.sendCommandToPTZ('focusSpeed', command, false);
  }

  setAutoIris(status: boolean) {
    const command = 'D3' + status ? '0' : '1';
    this.sendCommandToPTZ('other', command, true);
  }

  stepFocus(direction: 'near' | 'far', stepSize: number) {
    const get_command = 'AXF';
    this.sendCommandInstantToPTZ(get_command).then(response => {
      // extract value command
      const currentFocusValue = response?.replace('axf', '');
      // console.log('currentFocusValue: ' + currentFocusValue);

      // check if value present
      if (!currentFocusValue) {
        console.log('Could not read current Focus value.');
        return;
      }

      let newFocusValue;

      if (direction === 'near') {
        newFocusValue = PanasonicCameraControl.previousHexStep(
          currentFocusValue,
          stepSize,
          PanasonicCameraControl.irisMin,
          PanasonicCameraControl.irisMax
        );
      }

      if (direction === 'far') {
        newFocusValue = PanasonicCameraControl.nextHexStep(
          currentFocusValue,
          stepSize,
          PanasonicCameraControl.irisMin,
          PanasonicCameraControl.irisMax
        );
      }

      newFocusValue = newFocusValue?.toUpperCase();

      // console.log('newFocusValue: ' + newFocusValue);

      const command = 'AXF' + newFocusValue;
      this.sendCommandToPTZ('other', command, true);
    });
  }

  toggleAutoIris() {
    const get_command = 'D3';
    return this.sendCommandInstantToPTZ(get_command).then(response => {
      // extract value command
      const currentAutoIrisState = response?.replace('d3', '');

      // check if value present
      if (!currentAutoIrisState) {
        console.log('Could not read current auto iris state.');
        return;
      }

      let newAutoIrisState: boolean;
      if (currentAutoIrisState === '0') {
        newAutoIrisState = true;
      } else {
        newAutoIrisState = false;
      }

      const command = 'D3' + (newAutoIrisState ? '1' : '0');
      this.sendCommandToPTZ('other', command, true);

      // return state
      return Promise.resolve(newAutoIrisState);
    });
  }

  stepIris(direction: 'up' | 'down', stepSize: number) {
    const get_command = 'AXI';
    this.sendCommandInstantToPTZ(get_command).then(response => {
      // extract value command
      const currentIrisValue = response?.replace('axi', '');
      // console.log('currentIrisValue: ' + currentIrisValue);

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
          PanasonicCameraControl.irisMin,
          PanasonicCameraControl.irisMax
        );
      }

      if (direction === 'up') {
        newIrisValue = PanasonicCameraControl.nextHexStep(
          currentIrisValue,
          stepSize,
          PanasonicCameraControl.irisMin,
          PanasonicCameraControl.irisMax
        );
      }

      newIrisValue = newIrisValue?.toUpperCase();

      // console.log('newIrisValue: ' + newIrisValue);

      const command = 'AXI' + newIrisValue;
      this.sendCommandToPTZ('other', command, true);
    });
  }

  playbackPreset(presetNumber: number) {
    presetNumber = presetNumber - 1;
    if (presetNumber < 0 || presetNumber > 99) {
      console.log(
        'Preset Number is out of range (0 to 99). Value: ' + presetNumber
      );
    }
    const command = 'R' + presetNumber.toString().padStart(2, '0');
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
      const data = await axios.get(url, { timeout: 500 });
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
      this.executeImportantEventsQueue();
      return;
    }
    this.executeFluctualEventQueue();
  }

  private executeImportantEventsQueue() {
    const nextEvent = this.importantEventsQueue.shift();
    if (nextEvent) this.sendCommandInstantToPTZ(nextEvent);
  }

  private executeFluctualEventQueue() {
    let commandExecuted = false;

    // execute events with round robin logic
    if (this.fluctualEventQueueRoundRobin === 0 && this.lastPanTiltSpeed) {
      this.sendCommandInstantToPTZ(this.lastPanTiltSpeed);
      this.lastPanTiltSpeed = undefined;
      commandExecuted = true;
    } else if (this.fluctualEventQueueRoundRobin === 1 && this.lastZoomSpeed) {
      this.sendCommandInstantToPTZ(this.lastZoomSpeed);
      this.lastZoomSpeed = undefined;
      commandExecuted = true;
    } else if (this.fluctualEventQueueRoundRobin === 2 && this.lastFocusSpeed) {
      this.sendCommandInstantToPTZ(this.lastFocusSpeed);
      this.lastFocusSpeed = undefined;
      commandExecuted = true;
    }

    // iterate round robin & reset
    this.iterateRoundRobin();

    // if something was executed -> job done
    if (commandExecuted) return;

    // otherwise check if there are still remaining commands in the other fluctual queues
    if (this.commandsAvailable()) {
      this.executeFluctualEventQueue();
    }
  }

  private commandsAvailable(): boolean {
    return this.lastPanTiltSpeed || this.lastZoomSpeed || this.lastFocusSpeed
      ? true
      : false;
  }

  private iterateRoundRobin() {
    this.fluctualEventQueueRoundRobin++;
    if (
      this.fluctualEventQueueRoundRobin >=
      this.fluctualEventQueueRoundRobinParticipants
    )
      this.fluctualEventQueueRoundRobin = 0;
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
