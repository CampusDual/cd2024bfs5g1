import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoworkingsRoutingModule } from './coworkings-routing.module';
import { CoworkingsDetailComponent } from './coworkings-detail/coworkings-detail.component';
import { OntimizeWebModule } from 'ontimize-web-ngx';
import { CoworkingsNewComponent } from './coworkings-new/coworkings-new.component';


@NgModule({
  declarations: [
    CoworkingsDetailComponent,
    CoworkingsNewComponent
  ],
  imports: [
    CommonModule,
    CoworkingsRoutingModule,
    OntimizeWebModule
  ]
})
export class CoworkingsModule { }
