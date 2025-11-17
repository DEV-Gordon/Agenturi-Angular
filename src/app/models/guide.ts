import { Plan } from './plan';

export interface Guide {
    id?: number;
    name: string;
    phone: string;
    language: string;
    plan: number | Plan;
}