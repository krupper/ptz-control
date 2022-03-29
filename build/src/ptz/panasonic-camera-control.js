"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios = require('axios');
class PanasonicCameraControl {
    constructor(ip) {
        this.irisMin = 1366;
        this.irisMax = 4094;
        this.panasonicMinimalMessageDelayInMs = 130;
        this.importantEventsQueue = [];
        this.ip = ip;
        setInterval(() => {
            this.runMessageQueue();
        }, 130);
    }
    setPanTiltSpeed(pan, tilt) {
        if (pan < -100 || pan > 100) {
            console.log('Pan speed is out of range (-100 to 100). Value: ' + pan);
        }
        if (tilt < -100 || tilt > 100) {
            console.log('Tilt speed is out of range (-100 to 100). Value: ' + tilt);
        }
        // conversion to panasonic scale 0-99
        const panasonic_pan = (0.495 * pan + 49.67)
            .toFixed()
            .toString()
            .padStart(2, '0');
        const panasonic_tilt = (0.495 * tilt + 49.67)
            .toFixed()
            .toString()
            .padStart(2, '0');
        const command = 'PTS' + panasonic_pan + panasonic_tilt;
        return this.sendCommandToPTZ(command, false);
    }
    setZoomSpeed(speed) {
        if (speed < -100 || speed > 100) {
            console.log('Zoom speed is out of range (-100 to 100). Value: ' + speed);
        }
        // conversion to panasonic scale 0-99
        const panasonic_zoom = (0.495 * speed + 49.67)
            .toFixed()
            .toString()
            .padStart(2, '0');
        const command = 'Z' + panasonic_zoom;
        // console.log(command);
        return this.sendCommandToPTZ(command, false);
    }
    setAutoFocus(status) {
        const command = 'D1' + status ? '0' : '1';
        this.sendCommandToPTZ(command, true);
    }
    setFocusSpeed(speed) {
        if (speed < -100 || speed > 100) {
            console.log('Focus speed is out of range (-100 to 100). Value: ' + speed);
        }
        // conversion to panasonic scale 0-99
        const panasonic_focus = (0.495 * speed + 49.67)
            .toFixed()
            .toString()
            .padStart(2, '0');
        const command = 'Z' + panasonic_focus;
        return this.sendCommandToPTZ(command, false);
    }
    setAutoIris(status) {
        const command = 'D3' + status ? '0' : '1';
        this.sendCommandToPTZ(command, true);
    }
    stepIris(direction, stepSize) {
        const get_command = 'AXI';
        this.sendCommandInstantToPTZ(get_command).then(response => {
            // extract value command
            const currentIrisValue = response === null || response === void 0 ? void 0 : response.replace('axi', '');
            console.log('currentIrisValue: ' + currentIrisValue);
            // check if value present
            if (!currentIrisValue) {
                console.log('Could not read current Iris value.');
                return;
            }
            let newIrisValue;
            if (direction === 'down') {
                newIrisValue = this.previousHexStep(currentIrisValue, stepSize, this.irisMin, this.irisMax);
            }
            if (direction === 'up') {
                newIrisValue = this.nextHexStep(currentIrisValue, stepSize, this.irisMin, this.irisMax);
            }
            newIrisValue = newIrisValue === null || newIrisValue === void 0 ? void 0 : newIrisValue.toUpperCase();
            console.log('newIrisValue: ' + newIrisValue);
            const command = 'AXI' + newIrisValue;
            this.sendCommandToPTZ(command, true);
        });
    }
    playbackPreset(presetNumber) {
        if (presetNumber < 0 || presetNumber > 99) {
            console.log('Focus presetNumber is out of range (-100 to 100). Value: ' +
                presetNumber);
        }
        const command = 'R' + presetNumber;
        this.sendCommandToPTZ(command, true);
    }
    sendCommandToPTZ(command, importantEvent) {
        if (this.importantEventsQueue.length && !importantEvent) {
            // console.log(
            //   'Skipped event due to Panasonic minimal message delay of ' +
            //     this.panasonicMinimalMessageDelayInMs +
            //     ' ms'
            // );
            return;
        }
        // console.log(command);
        this.importantEventsQueue.push(command);
    }
    async sendCommandInstantToPTZ(command) {
        try {
            const data = await axios.get('http://' + this.ip + '/cgi-bin/aw_ptz?cmd=%23' + command + '&res=1');
            return data.data;
        }
        catch (error) {
            console.log(error);
            return;
        }
    }
    runMessageQueue() {
        const nextEvent = this.importantEventsQueue.shift();
        if (nextEvent)
            this.sendCommandInstantToPTZ(nextEvent);
    }
    hexToNumber(hex) {
        return parseInt(hex, 16);
    }
    numberToHex(number) {
        return number.toString(16);
    }
    nextHexStep(hex, step, min, max) {
        let number = this.hexToNumber(hex);
        number = number + step;
        if (number < min || number > max) {
            console.log('Hex value out of range');
            number = max;
        }
        return this.numberToHex(number + step);
    }
    previousHexStep(hex, step, min, max) {
        let number = this.hexToNumber(hex);
        number = number - step;
        if (number < min || number > max) {
            console.log('Hex value out of range');
            number = min;
        }
        return this.numberToHex(number - step);
    }
}
exports.default = PanasonicCameraControl;
