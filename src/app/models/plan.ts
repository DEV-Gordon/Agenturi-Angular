export interface PlanI {
    id?: number;
    name: string;
    description?: string;
    base_price: number;
    destination: number;
}

export interface PlanResponseI {
    id?: number;
    name: string;
    description?: string;
    base_price: number;
    destination: {
    id: number;
    name: string;
    };
}