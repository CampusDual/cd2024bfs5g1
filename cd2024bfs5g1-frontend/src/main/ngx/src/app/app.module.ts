import { NgModule } from '@angular/core';
import { ServiceWorkerModule } from '@angular/service-worker';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { APP_CONFIG, ONTIMIZE_MODULES, ONTIMIZE_PROVIDERS, OntimizeWebModule, O_MAT_ERROR_OPTIONS, O_PERMISSION_SERVICE, O_FORM_GLOBAL_CONFIG } from 'ontimize-web-ngx';

import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CONFIG } from './app.config';
import { MainService } from './shared/services/main.service';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CustomPermissionsService } from './shared/services/custom-permissions.service';
import { MatIconModule } from '@angular/material/icon';

import { OMapModule } from 'ontimize-web-ngx-map';
import { CustomGeocodingService } from './shared/services/custom-geocoding.service';
import { O_GEOCODING_SERVICE } from 'ontimize-web-ngx-map';

// Standard providers...
// Defining custom providers (if needed)...
export const customProviders: any = [
  MainService,
  { provide: O_MAT_ERROR_OPTIONS, useValue: { type: 'lite' } },
  { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } }
];

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    OntimizeWebModule.forRoot(CONFIG),
    OntimizeWebModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    MatIconModule,
    OMapModule,
  ],
  declarations: [
    AppComponent
  ],
  bootstrap: [
    AppComponent
  ],
  providers: [
    { provide: APP_CONFIG, useValue: CONFIG },
    ONTIMIZE_PROVIDERS,
    { provide: O_PERMISSION_SERVICE, useValue: CustomPermissionsService },
    { provide: O_FORM_GLOBAL_CONFIG, useValue: { headersActions: 'C,U' } },
    ...customProviders,
    { provide: O_GEOCODING_SERVICE, useValue: CustomGeocodingService }
  ],
})
export class AppModule { }
