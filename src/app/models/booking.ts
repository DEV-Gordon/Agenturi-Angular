export interface BookingI {
    id?: number;
    booking_date: string;
    status: "pending" | "paid" | "canceled";
    customer: number;
    plan: number;
}

export interface BookingResponseI {
    id?: number;
    booking_date: string;
    status: "pending" | "paid" | "canceled";
    customer: {
    id: number;
    first_name: string;
    last_name: string;
    };
    plan: {
    id: number;
    name: string;
    };
}