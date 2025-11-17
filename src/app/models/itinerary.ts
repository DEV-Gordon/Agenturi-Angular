export interface ItineraryI {
    id?: number;
    day: number;
    description?: string;
    plan: number;
}

export interface ItineraryResponseI {
    id?: number;
    day: number;
    description?: string;
    plan: {
    id: number;
    name: string;
    };
}