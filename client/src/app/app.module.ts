import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { CoreModule }   from './core/core.module';
import { routing }  from './app.routing';

import { PortalModule } from './portal/portal.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,   
    CoreModule,
    PortalModule,
    routing
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
