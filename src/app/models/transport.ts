import { Destination } from './destination';

export interface Transport {
    id?: number;
    type: string;
    company: string;
    destination: number | Destination;
}