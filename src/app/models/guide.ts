export interface GuideI {
    id?: number;
    name: string;
    phone: string;
    language: string;
    plan: number;
}

export interface GuideResponseI {
    id?: number;
    name: string;
    phone: string;
    language: string;
    plan: {
    id: number;
    name: string;
    };
}