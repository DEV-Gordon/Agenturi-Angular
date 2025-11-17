import { Plan } from './plan';
import { Activity } from './activity';

export interface Itinerary {
    id?: number;
    day: number;
    description?: string;
    plan: number | Plan;
    activities?: Activity[];
}