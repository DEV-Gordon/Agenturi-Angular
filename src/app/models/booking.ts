import { Customer } from './customer';
import { Plan } from './plan';
import { Activity } from './activity';

export interface Booking {
    id?: number;
    booking_date: string;
    status: 'pending' | 'paid' | 'canceled';
    customer: number | Customer;
    plan: number | Plan;
    activities?: BookingActivity[];
}

export interface BookingActivity {
    id?: number;
    booking: number | Booking;
    activity: number | Activity;
}

export interface Payment {
    id?: number;
    amount: number;
    payment_date: string;
    method: string;
    booking: number | Booking;
}