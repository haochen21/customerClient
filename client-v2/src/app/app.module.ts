import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { AppComponent } from './app.component';
import { CoreModule }   from './core/core.module';
import { AppRoutingModule }  from './app.routing';

import { PortalModule } from './portal/portal.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,   
    BrowserAnimationsModule,
    CoreModule,
    PortalModule,
    AppRoutingModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
