import { Routes } from '@angular/router';

// accommodation 
import { Getall as AccommodationGetall } from './components/accommodation/getall/getall';
import { Create as AccommodationCreate } from './components/accommodation/create/create';
import { Update as AccommodationUpdate } from './components/accommodation/update/update';
import { Delete as AccommodationDelete } from './components/accommodation/delete/delete';
// activity 
import { Getall as ActivityGetall } from './components/activity/getall/getall';
import { Create as ActivityCreate } from './components/activity/create/create';
import { Update as ActivityUpdate } from './components/activity/update/update';
import { Delete as ActivityDelete } from './components/activity/delete/delete';
// booking
import { Getall as BookingGetall } from './components/booking/getall/getall';
import { Create as BookingCreate } from './components/booking/create/create';
import { Update as BookingUpdate } from './components/booking/update/update';
import { Delete as BookingDelete } from './components/booking/delete/delete';
// customer
import { Getall as CustomerGetall } from './components/customer/getall/getall';
import { Create as CustomerCreate } from './components/customer/create/create';
import { Update as CustomerUpdate } from './components/customer/update/update';
import { Delete as CustomerDelete } from './components/customer/delete/delete';
// destination 
import { Getall as DestinationGetall } from './components/destination/getall/getall';
import { Create as DestinationCreate } from './components/destination/create/create';
import { Update as DestinationUpdate } from './components/destination/update/update';
import { Delete as DestinationDelete } from './components/destination/delete/delete';
//guide
import { Getall as GuideGetall } from './components/guide/getall/getall';
import { Create as GuideCreate } from './components/guide/create/create';
import { Update as GuideUpdate } from './components/guide/update/update';
import { Delete as GuideDelete } from './components/guide/delete/delete';
//itinerary
import { Getall as ItineraryGetall } from './components/itinerary/getall/getall';
import { Create as ItineraryCreate } from './components/itinerary/create/create';
import { Update as ItineraryUpdate } from './components/itinerary/update/update';
import { Delete as ItineraryDelete } from './components/itinerary/delete/delete';
//plan
import { Getall as PlanGetall } from './components/plan/getall/getall';
import { Create as PlanCreate } from './components/plan/create/create';
import { Update as PlanUpdate } from './components/plan/update/update';
import { Delete as PlanDelete } from './components/plan/delete/delete';
//transport
import { Getall as TransportGetall } from './components/transport/getall/getall';
import { Create as TransportCreate } from './components/transport/create/create';
import { Update as TransportUpdate } from './components/transport/update/update';
import { Delete as TransportDelete } from './components/transport/delete/delete';

export const routes: Routes = [
    //default ruta
    {
    path: '',
    redirectTo: '/customers',
    pathMatch: 'full'
    },
    //acomodation
    {
    path: 'accommodations',
    component: AccommodationGetall
    },
    {
    path: 'accommodations/new',
    component: AccommodationCreate
    },
    {
    path: 'accommodations/edit/:id',
    component: AccommodationUpdate
    },
    {
    path: 'accommodations/delete/:id',
    component: AccommodationDelete
    },
    //activity
    {
    path: 'activities',
    component: ActivityGetall
    },
    {
    path: 'activities/new',
    component: ActivityCreate
    },
    {
    path: 'activities/edit/:id',
    component: ActivityUpdate
    },
    {
    path: 'activities/delete/:id',
    component: ActivityDelete
    },
    //booking
    {
    path: 'bookings',
    component: BookingGetall
    },
    {
    path: 'bookings/new',
    component: BookingCreate
    },
    {
    path: 'bookings/edit/:id',
    component: BookingUpdate
    },
    {
    path: 'bookings/delete/:id',
    component: BookingDelete
    },
    //customer
    {
    path: 'customers',
    component: CustomerGetall
    },
    {
    path: 'customers/new',
    component: CustomerCreate
    },
    {
    path: 'customers/edit/:id',
    component: CustomerUpdate
    },
    {
    path: 'customers/delete/:id',
    component: CustomerDelete
    },
    //destination
    {
    path: 'destinations',
    component: DestinationGetall
    },
    {
    path: 'destinations/new',
    component: DestinationCreate
    },
    {
    path: 'destinations/edit/:id',
    component: DestinationUpdate
    },
    {
    path: 'destinations/delete/:id',
    component: DestinationDelete
    },
    //guide
    {
    path: 'guides',
    component: GuideGetall
    },
    {
    path: 'guides/new',
    component: GuideCreate
    },
    {
    path: 'guides/edit/:id',
    component: GuideUpdate
    },
    {
    path: 'guides/delete/:id',
    component: GuideDelete
    },
    //itinerary
    {
    path: 'itineraries',
    component: ItineraryGetall
    },
    {
    path: 'itineraries/new',
    component: ItineraryCreate
    },
    {
    path: 'itineraries/edit/:id',
    component: ItineraryUpdate
    },
    {
    path: 'itineraries/delete/:id',
    component: ItineraryDelete
    },
    //plan
    {
    path: 'plans',
    component: PlanGetall
    },
    {
    path: 'plans/new',
    component: PlanCreate
    },
    {
    path: 'plans/edit/:id',
    component: PlanUpdate
    },
    {
    path: 'plans/delete/:id',
    component: PlanDelete
    },
    //transport
    {
    path: 'transports',
    component: TransportGetall
    },
    {
    path: 'transports/new',
    component: TransportCreate
    },
    {
    path: 'transports/edit/:id',
    component: TransportUpdate
    },
    {
    path: 'transports/delete/:id',
    component: TransportDelete
    },
    //404
    {
    path: '**',
    redirectTo: '/customers'
    }
];
