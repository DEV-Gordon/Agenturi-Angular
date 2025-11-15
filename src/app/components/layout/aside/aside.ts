import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { PanelMenu } from 'primeng/panelmenu';

@Component({
  selector: 'app-aside',
  standalone: true,
  imports: [PanelMenu],
  templateUrl: './aside.html',
  styleUrl: './aside.css'
})
export class Aside {
items: MenuItem[] | undefined;
ngOnInit() {
    this.items = [
      {
        label: 'Clientes',
        icon: 'pi pi-fw pi-users',
        items: [
          {
            label: 'Ver Clientes',
            icon: 'pi pi-fw pi-list',
            routerLink: '/customers'
          },
          {
            label: 'Nuevo Cliente',
            icon: 'pi pi-fw pi-plus',
            routerLink: '/customers/new'
          }
        ]
      },
      {
        label: 'Reservas',
        icon: 'pi pi-fw pi-calendar',
        items: [
          {
            label: 'Ver Reservas',
            icon: 'pi pi-fw pi-list',
            routerLink: '/bookings'
          },
          {
            label: 'Nueva Reserva',
            icon: 'pi pi-fw pi-plus',
            routerLink: '/bookings/new'
          }
        ]
      },
      {
        label: 'Destinos',
        icon: 'pi pi-fw pi-map-marker',
        items: [
          {
            label: 'Ver Destinos',
            icon: 'pi pi-fw pi-list',
            routerLink: '/destinations'
          },
          {
            label: 'Nuevo Destino',
            icon: 'pi pi-fw pi-plus',
            routerLink: '/destinations/new'
          },
          {
            separator: true
          },
          {
            label: 'Alojamientos',
            icon: 'pi pi-fw pi-home',
            items: [
              {
                label: 'Ver Alojamientos',
                icon: 'pi pi-fw pi-list',
                routerLink: '/accommodations'
              },
              {
                label: 'Nuevo Alojamiento',
                icon: 'pi pi-fw pi-plus',
                routerLink: '/accommodations/new'
              }
            ]
          },
          {
            label: 'Transportes',
            icon: 'pi pi-fw pi-car',
            items: [
              {
                label: 'Ver Transportes',
                icon: 'pi pi-fw pi-list',
                routerLink: '/transports'
              },
              {
                label: 'Nuevo Transporte',
                icon: 'pi pi-fw pi-plus',
                routerLink: '/transports/new'
              }
            ]
          }
        ]
      },
      {
        label: 'Planes Turísticos',
        icon: 'pi pi-fw pi-briefcase',
        items: [
          {
            label: 'Ver Planes',
            icon: 'pi pi-fw pi-list',
            routerLink: '/plans'
          },
          {
            label: 'Nuevo Plan',
            icon: 'pi pi-fw pi-plus',
            routerLink: '/plans/new'
          },
          {
            separator: true
          },
          {
            label: 'Itinerarios',
            icon: 'pi pi-fw pi-compass',
            items: [
              {
                label: 'Ver Itinerarios',
                icon: 'pi pi-fw pi-list',
                routerLink: '/itineraries'
              },
              {
                label: 'Nuevo Itinerario',
                icon: 'pi pi-fw pi-plus',
                routerLink: '/itineraries/new'
              }
            ]
          },
          {
            label: 'Actividades',
            icon: 'pi pi-fw pi-ticket',
            items: [
              {
                label: 'Ver Actividades',
                icon: 'pi pi-fw pi-list',
                routerLink: '/activities'
              },
              {
                label: 'Nueva Actividad',
                icon: 'pi pi-fw pi-plus',
                routerLink: '/activities/new'
              }
            ]
          },
          {
            label: 'Guías',
            icon: 'pi pi-fw pi-id-card',
            items: [
              {
                label: 'Ver Guías',
                icon: 'pi pi-fw pi-list',
                routerLink: '/guides'
              },
              {
                label: 'Nuevo Guía',
                icon: 'pi pi-fw pi-plus',
                routerLink: '/guides/new'
              }
            ]
          }
        ]
      }
    ];
  }
}