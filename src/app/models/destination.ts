import { Accommodation } from './accommodation';
import { Transport } from './transport';

export interface Destination {
    id?: number;
    name: string;
    country?: string;
    city?: string;
    accommodations?: Accommodation[];
    transports?: Transport[];
}