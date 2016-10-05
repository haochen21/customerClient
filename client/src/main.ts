import './polyfills.ts';

import { enableProdMode } from '@angular/core';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
platformBrowserDynamic().bootstrapModule(AppModule);


// import {platformBrowser} from '@angular/platform-browser';
// import {AppModuleNgFactory} from './aot/app/app.module.ngfactory';
// platformBrowser().bootstrapModuleFactory(AppModuleNgFactory);