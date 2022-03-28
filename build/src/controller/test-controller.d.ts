export = GameController;
declare class GameController {
    eventEmitter: EventEmitter;
    SIGNAL_POLL_INTERVAL_MS: number;
    THUMBSTICK_NOISE_THRESHOLD: number;
    on(event: any, cb: any): void;
    init(): Promise<void>;
}
import EventEmitter_1 = require("events");
import EventEmitter = EventEmitter_1.EventEmitter;
