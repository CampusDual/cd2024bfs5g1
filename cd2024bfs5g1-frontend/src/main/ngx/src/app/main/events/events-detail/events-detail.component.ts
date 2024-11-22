import { Location } from '@angular/common';
import { Component, ViewChild } from "@angular/core";
import { DialogService, OFormComponent, OntimizeService, OSnackBarConfig, OTranslateService, SnackBarService } from "ontimize-web-ngx";
import { UtilsService } from "src/app/shared/services/utils.service";

@Component({
  selector: "app-events-detail",
  templateUrl: "./events-detail.component.html",
  styleUrls: ["./events-detail.component.css"],
})
export class EventsDetailComponent {
  constructor(
    private translate: OTranslateService,
    private utils: UtilsService,
    private location: Location,
    private service: OntimizeService,
    protected snackBarService: SnackBarService,
    protected dialogService: DialogService
  ) { }

  @ViewChild("form") form: OFormComponent;
  public idiomaActual: string;
  public idioma: string;

  formatDate(rawDate: number): string {
    return this.utils.formatDate(rawDate);
  }

  durationConvert(minutes: number): String {
    const DurationHours = this.translate.get("HOURS_MESSAGE");
    const DurationMinutes = this.translate.get("MINUTES_MESSAGE");
    const NoDuration = this.translate.get("NO_DURATION");
    var horas: number = 0;
    var minutosRestantes: number = 0;
    var tiempo: String = "";

    if (minutes == null) {
      tiempo = `${NoDuration}`;
    } else {
      if (minutes >= 60) {
        horas = Math.floor(minutes / 60);
        minutosRestantes = minutes % 60;
        tiempo = `${horas} ${DurationHours} ${minutosRestantes} ${DurationMinutes}`;
      } else {
        tiempo = `${minutes} ${DurationMinutes}`;
      }
    }
    return tiempo;
  }

  goBack(): void {
    this.location.back();
  }

  showConfirm() {
    this.idiomaActual = this.translate.getCurrentLang();
    this.idiomaActual === "es"
      ? (this.idioma = "es-ES")
      : (this.idioma = "en-US");

    const confirmMessageTitle = this.translate.get("BOOKINGS_INSERT");
    const confirmMessage = this.translate.get("BOOKINGS_CONFIRMATION");
    this.dialogService.confirm(confirmMessageTitle, confirmMessage).then((result) => {
      if (result) {
        this.createBookingEvent();
      }
    });
  }

  createBookingEvent() {
    const filter = {
      bke_id_event: +this.form.getFieldValue('id_event'),
    };
    const conf = this.service.getDefaultServiceConfiguration('bookingEvents');
    this.service.configureService(conf);

    this.service.insert(filter, "bookingEvent").subscribe((resp) => {
      if (resp.code === 0) {
        this.showAvailableToast(resp.mensaje);
      }
    });
  }

  showAvailableToast(mensaje: string) {
    const availableMessage =
      this.translate.get(mensaje);
    const configuration: OSnackBarConfig = {
      milliseconds: 3500,
      icon: "info",
      iconPosition: "left",
    };
    this.snackBarService.open(availableMessage, configuration);
  }
}
