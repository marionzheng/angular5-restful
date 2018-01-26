import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';
import {appRoutes} from './app.routes';

import {NotFoundComponent} from './not-found/not-found.component';
import { RestfulClientComponent } from './restful-client/restful-client.component';
import {AppComponent} from "./app.component";
import {RestfulModule} from "../../src/http";
import {RestfulClientService} from "./restful-client/restful-client.service";
import {FormsModule} from "@angular/forms";

@NgModule({
  imports: [
      FormsModule,
      BrowserModule,
      RestfulModule,
      RouterModule.forRoot(appRoutes)
  ],
  providers: [RestfulClientService],
  declarations: [AppComponent, NotFoundComponent, RestfulClientComponent],
  bootstrap: [AppComponent]
})
export class AppModule {
}
