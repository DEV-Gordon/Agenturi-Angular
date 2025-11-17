
export interface AccommodationI {
    id?: number;
    name: string;
    type?: string;
    address?: string;
    destination: number;
}

export interface AccommodationResponseI {
    id?: number;
    name: string;
    type?: string;
    address?: string;
    destination: {
    id: number;
    name: string;
    };
}