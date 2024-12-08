import { HttpClient } from '@angular/common/http';
import { Component, Injector, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import {
  DialogService,
  OComboComponent,
  ODateInputComponent,
  OFormComponent,
  OntimizeService, OSnackBarConfig,
  OTextInputComponent,
  OTranslateService,
  SnackBarService,
} from "ontimize-web-ngx";
import { OMapComponent } from "ontimize-web-ngx-map";

@Component({
  selector: "app-coworking-new",
  templateUrl: "./coworkings-new.component.html",
  styleUrls: ["./coworkings-new.component.css"],
})

export class CoworkingsNewComponent implements OnInit {
  public today: string = new Date().toLocaleDateString();
  public arrayServices: any = [];
  public exist = false;
  public availableServices: number = 6;
  public selectedServices: number = 0;
  protected service: OntimizeService;
  leafletMap: any;
  protected validAddress: boolean;
  protected mapLat: string = ""; //Latitud
  protected mapLon: string = ""; //Longitud
  protected coords = this.mapLat + ";" + this.mapLon; //Coordenadas a guardar en la DB a futuro

  @ViewChild("coworkingForm") coworkingForm: OFormComponent;
  @ViewChild("startDate") coworkingStartDate: ODateInputComponent;
  @ViewChild("endDate") coworkingEndDate: ODateInputComponent;
  @ViewChild("coworking_map") coworking_map: OMapComponent;
  @ViewChild('combo') combo: OComboComponent;
  @ViewChild('address') address: OTextInputComponent;

  constructor(
    private router: Router,
    private translate: OTranslateService,
    protected injector: Injector,
    protected snackBarService: SnackBarService,
    protected dialogService: DialogService,
    private http: HttpClient
  ) {
    this.service = this.injector.get(OntimizeService);
  }

  ngOnInit(): void {
    this.configureService();

    // Usa un timeout para asegurarte de que el mapa esté listo
    setTimeout(() => {
      this.leafletMap = this.coworking_map.getMapService().getMap();
      if (this.leafletMap) {
        console.log('Mapa inicializado correctamente:', this.leafletMap);
      } else {
        console.error('El mapa aún no está listo.');
      }
    }, 500);
  }

  protected configureService() {
    const conf = this.service.getDefaultServiceConfiguration('coworkings');
    this.service.configureService(conf);
  }

  public onInsertSuccess(): void {
    this.coworkingForm.setInitialMode();
    this.router.navigateByUrl("/main/mycoworkings")
  }

  public selectService(id: number, serv: string): void {
    this.exist = false;
    for (let i = 0; i < this.arrayServices.length; i++) {
      if (this.arrayServices[i].id === id) {
        this.exist = true;
        this.deleteService(i, id, serv);
      }
    }
    if (!this.exist) {
      this.appendService(id, serv);
    }
  }

  public appendService(id: number, serv: string): void {
    this.arrayServices.push({ id: id });
    document.getElementById(serv).style.backgroundColor = "#b9cebf";
    document.getElementById(serv).style.color = "black";
    document.getElementById(serv).style.borderRadius = "6px";
    this.selectedServices++;
    this.availableServices--;
  }

  public deleteService(index: number, id: number, serv: string): void {
    this.arrayServices.splice(index, 1)
    document.getElementById(serv).style.backgroundColor = "#e9e9e9";
    document.getElementById(serv).style.color = "black";
    this.selectedServices--;
    this.availableServices++;
  }

  public async save() {
    if (!this.validAddress) {
      const confirmSave = await this.showConfirm();
      if (!confirmSave) {
        return;
      }
    }
    //Ordenamos el array de coworkings
    this.arrayServices.sort((a: any, b: any) => a.id - b.id);
    const coworking = {
      cw_name: this.coworkingForm.getFieldValue('cw_name'),
      cw_description: this.coworkingForm.getFieldValue('cw_description'),
      cw_address: this.coworkingForm.getFieldValue('cw_address'),
      cw_location: this.coworkingForm.getFieldValue('cw_location'),
      cw_capacity: this.coworkingForm.getFieldValue('cw_capacity'),
      cw_daily_price: this.coworkingForm.getFieldValue('cw_daily_price'),
      cw_image: this.coworkingForm.getFieldValue('cw_image'),
      cw_lat: this.mapLat,
      cw_lon: this.mapLon,
      services: this.arrayServices
    }
    this.insert(coworking);
    this.coworkingForm.clearData();
    this.router.navigateByUrl("/main/mycoworkings");
  }

  public insert(coworking: any) {
    this.service.insert(coworking, 'coworking').subscribe(data => {
      this.showConfigured();
    });
  }

  public cancel() {
    this.onInsertSuccess();
  }

  isInvalidForm(): boolean {
    return !this.coworkingForm || this.coworkingForm.formGroup.invalid;
  }

  public showConfigured() {
    const action = this.translate.get('COWORKING_CREATE')
    const configuration: OSnackBarConfig = {
      action: action,
      milliseconds: 5000,
      icon: 'check_circle',
      iconPosition: 'left'
    };
    this.snackBarService.open('', configuration);
  }

  // ---------------------- MAPA ----------------------
  onAddressBlur(): void {
    const selectedCityId = this.combo.getValue();
    const address = this.address.getValue();
    const cityObject = this.combo.dataArray.find(city => city.id_city === selectedCityId);
    const cityName = cityObject ? cityObject.city : null;

    if (!cityName || !address) {
      this.snackBar(this.translate.get("INVALID_LOCATION"));
      return;
    }

    const addressComplete = address ? `${address}, ${cityName}` : cityName;
    this.getCoordinatesForCity(addressComplete).then((results) => {
      if (results) {
        let [lat, lon] = results.split(';')
        this.mapLat = lat;
        this.mapLon = lon;
        if (this.coworking_map && this.coworking_map.getMapService()) {
          if (this.leafletMap) {
            this.leafletMap.setView([+lat, +lon], 16);
          } else {
            console.error('El mapa no está inicializado.');
          }
        } else {
          console.error('El servicio del mapa no está disponible.');
        }
        this.validAddress = true;
        this.coworking_map.addMarker(
          'coworking_marker',           // id
          lat,                 // latitude
          lon,                 // longitude
          { draggable: true },       // options
          this.translate.get("COWORKING_MARKER"),     // popup
          false,                     // hidden
          true,                      // showInMenu
          this.translate.get("COWORKING_MARKER")   // menuLabel
        );
      } else {
        //Si se ingresa una direccion que la api no reconoce -> Reseteo de la vista a Madrid y zoom 6
        this.snackBar(this.translate.get("ADDRESS_NOT_FOUND"));
        this.leafletMap.setView([40.416775, -3.703790], 6);
      }
    });
  }

  //Es async porque realiza una solicitud HTTP para obtener datos de una API externa. responde = await porque se espera a que la solicitud HTTP se complete y devuelva una respuesta.
  private async getCoordinatesForCity(location: string): Promise<string | null> {
    try {
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&countrycodes=es&format=json`;
      const response = await this.http.get<any>(url).toPromise();
      console.log(response);
      if (response?.length > 0) {
        const { lat, lon } = response[0];
        this.mapLat = lat;
        this.mapLon = lon;
        console.log(`${lat};${lon}`);
        return `${lat};${lon}`;
      }
    } catch (error) {
      this.snackBar(this.translate.get("API_ERROR") + error);
    }
    return null;
  }

  private snackBar(message: string): void {
    this.snackBarService.open(message, {
      milliseconds: 5000,
      icon: 'error',
      iconPosition: 'left'
    });
  }

  private async showConfirm(): Promise<boolean> {
    return new Promise((resolve) => {
      const confirmMessageTitle = this.translate.get("BOOKINGS_INSERT");
      const confirmMessage = this.translate.get("INVALID_LOCATION_CONFIRM");
      this.dialogService.confirm(confirmMessageTitle, confirmMessage).then((result) => {
        if (result) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }
}
