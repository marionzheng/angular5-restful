import {Routes} from '@angular/router';
import {NotFoundComponent} from './not-found/not-found.component';
import {RestfulClientComponent} from "./restful-client/restful-client.component";
import {AppComponent} from "./app.component";

export const appRoutes: Routes = [
    {
        path: '',
        redirectTo: '/',
        pathMatch: 'full'
    },
    {
        path: '',
        component: AppComponent
    },
    {
        path: 'restful-client',
        component: RestfulClientComponent
    },
    {
        path: '**', // fallback router must in the last
        component: NotFoundComponent
    }
];
