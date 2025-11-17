import { Destination } from './destination';

export interface Accommodation {
    id?: number;
    name: string;
    type?: string;
    address?: string;
    destination: number | Destination;
}