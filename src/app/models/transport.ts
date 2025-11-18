import { DestinationI } from './destination';

export interface TransportI {
    id?: number;
    type: string;
    company: string;
    destination: number;
}

export interface TransportResponseI {
    id?: number;
    type: string;
    company: string;
    destination: DestinationI
}