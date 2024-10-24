import { Component, ElementRef, Inject, Injector, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, OEmailInputComponent, OFormComponent, OntimizeService, OPasswordInputComponent, OTextInputComponent } from 'ontimize-web-ngx'; // Servicio para que se pueda usar en el TS las funciones de Ontimize
import { ValidationErrors, FormControl } from '@angular/forms';

@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.css']
})

export class UserRegisterComponent {
  @ViewChild('registerForm') public registerForm: OFormComponent;
  @ViewChild('nameInput') public userCtrl: OTextInputComponent;
  @ViewChild('emailInput') public emailCtrl: OEmailInputComponent;
  @ViewChild('passInput') public pwdCtrl: OPasswordInputComponent;

  protected service: OntimizeService;
  private redirect = '/main';

  constructor(protected injector: Injector,
    @Inject(AuthService) private authService: AuthService,
    private router: Router) {
    this.service = this.injector.get(OntimizeService);
    this.configureService()
  }

  protected configureService() {
    const conf = this.service.getDefaultServiceConfiguration('users');
    this.service.configureService(conf);
  }

  checkEmail() {
    const email = this.emailCtrl.getValue();
    if (email && email.length > 0) {
      const filter = { 'usr_email': email };
      const columns = ['usr_id'];
      this.service.query(filter, columns, 'user').subscribe(resp => {
        if (resp.data && resp.data.length > 0) {
          alert('Email ya existe')
          this.emailCtrl.setValue('');
        }
      });
    }
  }

  checkUserName() {
    const user = this.userCtrl.getValue();
    if (user && user.length > 0) {
      const filter = { 'usr_login': user };
      const columns = ['usr_id'];
      this.service.query(filter, columns, 'user').subscribe(resp => {
        if (resp.data && resp.data.length > 0) {
          alert('Usuario ya existe')
          this.userCtrl.setValue('');
        }
      });
    }
  }

  disableHeader() {
    this.registerForm.showHeader = false;
  }

  logUser() {
      const userName = this.userCtrl.getValue();
      const password = this.pwdCtrl.getValue();
      const self = this;
      this.authService.login(userName, password)
        .subscribe(() => {
          self.router.navigate([this.redirect]);
        });
  }
}
