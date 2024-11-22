import { Location } from "@angular/common";
import {
  Component,
  Inject,
  OnInit,
  ViewChild
} from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import {
  AuthService,
  DialogService,
  OButtonComponent,
  OFormComponent,
  OIntegerInputComponent,
  OntimizeService,
  OPermissions,
  OSnackBarConfig,
  OTextInputComponent,
  OTranslateService,
  SnackBarService,
  Util,
  ODateRangeInputComponent,
} from "ontimize-web-ngx";
@Component({
  selector: "app-coworkings-detail",
  templateUrl: "./coworkings-detail.component.html",
  styleUrls: ["./coworkings-detail.component.css"],
})
export class CoworkingsDetailComponent implements OnInit {
  events: any = [];
  constructor(
    private service: OntimizeService,
    private activeRoute: ActivatedRoute,
    private router: Router,
    protected dialogService: DialogService,
    protected snackBarService: SnackBarService,
    @Inject(AuthService) private authService: AuthService,
    private translate: OTranslateService,
    private location: Location,
    private sanitizer:DomSanitizer
  ) {}

  @ViewChild("sites") coworkingsSites: OIntegerInputComponent;
  @ViewChild("daterange") bookingDate: ODateRangeInputComponent;
  @ViewChild("realCapacity") realCapacity: OIntegerInputComponent;
  @ViewChild("bookingButton") bookingButton: OButtonComponent;
  @ViewChild("name") coworkingName: OTextInputComponent;
  @ViewChild("form") form: OFormComponent;
  @ViewChild("id") idCoworking: OIntegerInputComponent;

  plazasOcupadas: number;
  public idiomaActual: string;
  public idioma: string;
  public serviceList = [];
  public dateArray = [];
  public dateArrayF = [];

  // Formatea los decimales del precio y añade simbolo de euro en las card de coworking
  public formatPrice(price: string): string {
    const price_ = parseFloat(price);
    let [integerPart, decimalPart] = price_.toFixed(2).split(".");
    if (decimalPart == "") {
      decimalPart = "00";
    }
    return `${integerPart},<span class="decimal">${decimalPart}</span> €`;
  }

  getName() {
    return this.coworkingName ? this.coworkingName.getValue() : "";
  }

  ngOnInit() {
    this.showServices();
  }

  currentDate() {
    return new Date();
  }

  showEvents(cw_location: number): void {
    if (cw_location != undefined) {
      let date = new Date();
      let now = `${date.getFullYear()}-${
        date.getMonth() + 1
      }-${date.getDate()}`;
      const filter = {
        "@basic_expression": {
          lop: {
            lop: "locality",
            op: "=",
            rop: cw_location,
          },
          op: "AND",
          rop: {
            lop: "date_event",
            op: ">=",
            rop: now,
          },
        },
      };
      let sqltypes = {
        date_event: 91,
      };
      const conf = this.service.getDefaultServiceConfiguration("events");
      this.service.configureService(conf);
      const columns = [
        "id_event",
        "name",
        "description",
        "date_event",
        "hour_event",
        "address",
        "location",
        "bookings",
        "usr_id",
        "duration",
        "image_event",
      ];
      this.service
        .query(filter, columns, "event", sqltypes)
        .subscribe((resp) => {
          if (resp.code === 0) {
            this.events = resp.data;
            console.log(this.events);
          }
        });
    }
  }

  // Función para convertir la imagen desde la base de datos
  public getImageSrc(base64: any): any {
    return base64 ? this.sanitizer.bypassSecurityTrustResourceUrl('data:image/*;base64,' + base64) : './assets/images/event-default.jpg';
  }

  goEvent(id_event:number):void{
    this.router.navigate(['/myevents', id_event]);
  }

  setDates() {
    const startDate = new Date(
      (this.bookingDate as any).value.value.startDate
    ).toLocaleString("en-CA");
    const endDate = new Date(
      (this.bookingDate as any).value.value.endDate
    ).toLocaleString("en-CA");

    this.dateArray[0] = startDate;
    this.dateArray[1] = endDate;

    const filter = {
      bk_cw_id: this.idCoworking.getValue(),
      bk_date: this.dateArray,
      bk_state: true,
    };

    const conf = this.service.getDefaultServiceConfiguration("bookings");
    this.service.configureService(conf);
    const columns = ["bk_id"];

    this.service.query(filter, columns, "getDatesDisponibility").subscribe(
      (resp) => {
        const data = resp.data.data;
        console.log(data);
        const fechasDisponibles = Object.values(data).every(
          (disponible: boolean) => disponible === true
        );
        if (fechasDisponibles) {
          const fechasDisponibles = Object.entries(data)
            .filter(([fecha, disponible]) => disponible === true)
            .map(([fecha]) => new Date(fecha));
          this.dateArray = fechasDisponibles;
          this.showAvailableToast(this.translate.get("PLAZAS_DISPONIBLES"));
          this.bookingButton.enabled = true;
        } else {
          const fechasNoDisponibles = Object.entries(data)
            .filter(([fecha, disponible]) => disponible === false)
            .map(([fecha]) => new Date(fecha));

          const fechasFormateadas = fechasNoDisponibles.map((fecha) =>
            this.changeFormatDate(fecha.getTime(), this.idioma)
          );

          const mensaje = `${this.translate.get(
            "NO_PLAZAS_DISPONIBLES"
          )}:\n - ${fechasFormateadas.join("\n - ")}`;
          this.showAvailableToast(mensaje);
          this.bookingButton.enabled = false;
        }
      },
      (error) => {
        console.error("Error al consultar capacidad:", error);
        this.bookingButton.enabled = false;
      }
    );
    this.dateArray.splice(0, this.dateArray.length);
  }

  showAvailableToast(mensaje?: string) {
    const availableMessage =
      mensaje || this.translate.get("PLAZAS_DISPONIBLES");
    const configuration: OSnackBarConfig = {
      milliseconds: 7500,
      icon: "info",
      iconPosition: "left",
    };
    this.snackBarService.open(availableMessage, configuration);
  }

  changeFormatDate(milis: number, idioma: string) {
    const fecha = new Date(milis);
    let fechaFormateada;
    fechaFormateada = new Intl.DateTimeFormat(idioma).format(fecha);
    return fechaFormateada;
  }

  showConfirm(evt: any) {
    this.idiomaActual = this.translate.getCurrentLang();
    this.idiomaActual === "es"
      ? (this.idioma = "es-ES")
      : (this.idioma = "en-US");
    const confirmMessageTitle = this.translate.get("BOOKINGS_INSERT");
    const confirmMessageBody = this.translate.get("BOOKINGS_INSERT2");
    const confirmMessageBody2 = this.translate.get("BOOKINGS_INSERT3");
    this.dateArrayF = this.dateArray.map((fecha) =>
      this.changeFormatDate(fecha.getTime(), this.idioma)
    );
    const startDate = this.dateArrayF[0];
    const endDate = this.dateArrayF[this.dateArrayF.length - 1];
    if (this.authService.isLoggedIn()) {
      if (this.dialogService) {
        if (startDate == endDate) {
          this.dialogService.confirm(
            confirmMessageTitle,
            `${confirmMessageBody}  ${
              this.dateArrayF
            } ${confirmMessageBody2} ${this.coworkingName.getValue()} ?`
          );
        } else {
          this.dialogService.confirm(
            confirmMessageTitle,
            `${confirmMessageBody}  ${startDate} - ${endDate} ${confirmMessageBody2} ${this.coworkingName.getValue()} ?`
          );
        }
        this.dialogService.dialogRef.afterClosed().subscribe((result) => {
          if (result) {
            this.createBooking();
          }
        });
      }
    } else {
      this.router.navigate(["/login"]);
    }
  }

  createBooking() {
    const filter = {
      bk_cw_id: +this.idCoworking.getValue(),
      bk_date: this.dateArray,
      bk_state: true,
    };

    const sqltypes = {
      bk_date: 91,
    };

    const conf = this.service.getDefaultServiceConfiguration("bookings");
    this.service.configureService(conf);

    this.service.insert(filter, "rangeBooking").subscribe((resp) => {
      if (resp.code === 0) {
        this.showAvailableToast("BOOKINGS_CONFIRMED");
        this.bookingButton.enabled = false;
        this.bookingDate.clearValue();
      }
    });
  }

  checkAuthStatus() {
    return !this.authService.isLoggedIn();
  }
  parsePermissions(attr: string): boolean {
    // if oattr in form, it can have permissions
    if (!this.form || !Util.isDefined(this.form.oattr)) {
      return;
    }
    const permissions: OPermissions =
      this.form.getFormComponentPermissions(attr);

    if (!Util.isDefined(permissions)) {
      return true;
    }
    return permissions.visible;
  }

  showServices(): any {
    const filter = {
      cw_id: +this.activeRoute.snapshot.params["cw_id"],
    };
    const conf = this.service.getDefaultServiceConfiguration("cw_services");
    this.service.configureService(conf);
    const columns = ["srv_name"];
    return this.service
      .query(filter, columns, "servicePerCoworking")
      .subscribe((resp) => {
        this.serviceList = resp.data;
      });
  }

  serviceIcons = {
    additional_screen: "desktop_windows",
    vending_machine: "kitchen",
    coffee_bar: "local_cafe",
    water_dispenser: "local_drink",
    ergonomic_chair: "event_seat",
    parking: "local_parking",
  };

  goBack(): void {
    this.location.back();
  }
}
