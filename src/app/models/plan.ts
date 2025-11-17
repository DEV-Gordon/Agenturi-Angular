import { Destination } from './destination';
import { Itinerary } from './itinerary';
import { Guide } from './guide';

export interface Plan {
    id?: number;
    name: string;
    description?: string;
    base_price: number;
    destination: number | Destination;
    itineraries?: Itinerary[];
    guides?: Guide[];
}