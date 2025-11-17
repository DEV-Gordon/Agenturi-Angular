import { Itinerary } from './itinerary';

export interface Activity {
    id?: number;
    name: string;
    description?: string;
    extra_cost: number;
    itinerary: number | Itinerary;
}