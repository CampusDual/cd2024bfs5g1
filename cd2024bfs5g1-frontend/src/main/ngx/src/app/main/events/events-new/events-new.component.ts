import { Component, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import {
  OFormComponent,
  OntimizeService,
  OSnackBarConfig,
  OTextInputComponent,
  OTimeInputComponent,
  OTranslateService,
  SnackBarService,
} from "ontimize-web-ngx";

@Component({
  selector: "app-events-new",
  templateUrl: "./events-new.component.html",
  styleUrls: ["./events-new.component.css"],
})
export class EventsNewComponent {
  @ViewChild("nameInput") public nameCtrl: OTextInputComponent;
  @ViewChild("timeInput") public timeCtrl: OTimeInputComponent;
  @ViewChild("form") public formCtrl: OFormComponent;

  constructor(
    private router: Router,
    private translate: OTranslateService,
    private service: OntimizeService,
    protected snackBarService: SnackBarService
  ) {
    const conf = this.service.getDefaultServiceConfiguration("events");
    this.service.configureService(conf);
  }

  //Devuelve la fecha actual
  currentDate() {
    return new Date();
  }

  //Función para crear un evento
  createEvent() {
    this.router.navigate(["/main/myevents"]);
  }

  //Función que deshabilita el botón de guardar mientras no se introduzcan datos
  isInvalidForm(): boolean {
    return !this.formCtrl || this.formCtrl.formGroup.invalid;
  }

  //Función que limpia el formulario y redirige a myevents
  public cancel() {
    this.formCtrl.setInitialMode();
    this.router.navigateByUrl("/main/myevents");
  }

  //Recupera los datos del formalario de nuevo evento y llama a la función de insert
  public save() {
    const sqlTypes = {
      hour_event: 12,
    };

    const event = {
      name: this.formCtrl.getFieldValue("name"),
      description: this.formCtrl.getFieldValue("description"),
      date_event: new Date(
        this.formCtrl.getFieldValue("date_event")
      ).toLocaleString(),
      hour_event: new Date(
        this.formCtrl.getFieldValue("hour_event")
      ).toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }),
      address: this.formCtrl.getFieldValue("address"),
      locality: this.formCtrl.getFieldValue("locality"),
      image_event: this.formCtrl.getFieldValue("image_event"),
      duration: this.formCtrl.getFieldValue("duration"),
      bookings: this.formCtrl.getFieldValue("bookings"),
      price: this.formCtrl.getFieldValue("price") ?? 0,
    };
    console.log("Event: ", event);
    this.insert(event, sqlTypes);
    this.formCtrl.clearData();
    this.router.navigateByUrl("/main/myevents");
  }

  //Inserta el evento creado
  public insert(event: any, sqlTypes: any) {
    this.service.insert(event, "event", sqlTypes).subscribe((data) => {
      console.log(data);
      this.showConfigured();
    });
  }

  //Muestra toast de evento creado
  public showConfigured() {
    const action = this.translate.get("EVENT_CREATE");
    const configuration: OSnackBarConfig = {
      action: action,
      milliseconds: 5000,
      icon: "check_circle",
      iconPosition: "left",
    };
    this.snackBarService.open("", configuration);
  }
}
