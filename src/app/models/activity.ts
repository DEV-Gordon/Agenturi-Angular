export interface ActivityI {
    id?: number;
    name: string;
    description?: string;
    extra_cost: number;
    itinerary: number;
}

export interface ActivityResponseI {
    id?: number;
    name: string;
    description?: string;
    extra_cost: number;
    itinerary: {
    id: number;
    day: number;
    };
}