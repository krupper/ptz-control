/// <reference types="node" />
import Controller from '../interfaces/Controller';
import { EventEmitter } from 'events';
declare class XboxController implements Controller {
    eventEmitter: EventEmitter;
    SIGNAL_POLL_INTERVAL_MS: number;
    THUMBSTICK_NOISE_THRESHOLD: number;
    manufacturer: string;
    vendorId: number;
    product: string;
    productId: number;
    constructor();
    test(): Promise<void>;
    init(): Promise<void>;
    on(event: any, cb: any): void;
}
export default XboxController;
