import { NgModule } from '@angular/core';
import { OntimizeWebModule } from 'ontimize-web-ngx';
import { CommonModule } from '@angular/common';

import { RegisterRoutingModule } from './register-routing.module';
import { UserRegisterComponent } from './user-register/user-register.component';


@NgModule({
  declarations: [
    UserRegisterComponent
  ],
  imports: [
    CommonModule,
    OntimizeWebModule,
    RegisterRoutingModule
  ]
})
export class RegisterModule { }
