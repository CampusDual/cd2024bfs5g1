import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Router } from "@angular/router";
import * as L from 'leaflet';
import { OntimizeService, OTranslateService, Subject } from 'ontimize-web-ngx';
import { OMapComponent } from "ontimize-web-ngx-map";
@Injectable({
  providedIn: 'root'
})

export class CustomMapService {

  constructor(protected injector: Injector, private http: HttpClient, protected router: Router, private translate: OTranslateService,) {
    this.service = this.injector.get(OntimizeService);
  }
  protected mp: any; //Mapa

  protected service: OntimizeService;
  public mostrarDiv: boolean = false;
  private location$ = new Subject<{ latitude: number, longitude: number }>;
  private location = this.location$.asObservable();
  selectedCoworking: any = null;

  protected mapLat: number; //Latitud
  protected mapLon: number; //Longitud

  public coworkings: Coworking[] = [];
  leafletMap: any;

  public async getMap(mapa: OMapComponent, address: ImapAddress): Promise<[number, number]> {

    if (address[0].lat && address[0].lon) {
      this.addMark(mapa, address[0].lat, address[0].lon);
    } else {
      const coordinates = await this.getCoordinates(address[0].city, address[0].address);
      if (!coordinates[0] || !coordinates[1]) {
        const [lat, lon] = coordinates[0].split(';').map(Number);
        this.addMark(mapa, lat, lon);
      }
      if (coordinates) {
        const [lat, lon] = coordinates.split(';').map(Number);
        this.addMark(mapa, lat, lon);
        return [lat, lon];
      }
    }
  }

  public async getCityCoordinates(city: string): Promise<string | null> {
    const encodedCity = encodeURIComponent(city);
    const encodedCountry = encodeURIComponent("Spain");

    try {
      const url = `https://nominatim.openstreetmap.org/search?city=${encodedCity}&country=${encodedCountry}&format=json&addressdetails=1`;
      const response = await this.http.get<any>(url).toPromise();
      if (response?.length > 0) {
        const { lat, lon } = response[response.length - 1]; //Obtiene la última posición de la respuesta que es la más precisa
        return `${lat};${lon}`;
      }
    } catch (error) {
      console.log("API_ERROR" + error);
    }
    return null;
  }

  public async getCoordinates(city: string, street: string): Promise<string | null> {
    const encodedCity = encodeURIComponent(city);
    const encodedStreet = encodeURIComponent(street);
    const encodedCountry = encodeURIComponent("Spain");

    try {
      const url = `https://nominatim.openstreetmap.org/search?city=${encodedCity}&street=${encodedStreet}&country=${encodedCountry}&format=json&addressdetails=1`;
      const response = await this.http.get<any>(url).toPromise();
      if (response?.length > 0) {
        const { lat, lon } = response[response.length - 1]; //Obtiene la última posición de la respuesta que es la más precisa
        return `${lat};${lon}`;
      }
    } catch (error) {
      console.log("API_ERROR" + error);
    }
    return null;
  }

  public addMyMarker(leafletMap: L, lat: number, lon: number) {
    const myIcon = L.divIcon({
      className: 'custom-icon',
      html: '<img src="assets/icons/pocoyo.gif" style="width: 42px; height: 42px;" />',
      iconSize: [42, 42],
      iconAnchor: [20, 42], // Ajustar el ancla del icono para que la punta esté en la posición correcta
    });

    // Crear el marcador con el icono personalizado
    const marker = L.marker([lat, lon], {
      icon: myIcon,
      draggable: false,
    });

    // Añadir un popup al marcador
    marker.bindPopup(this.translate.get("MY_UBICATION"), {
      offset: L.point(0, -42), // Ajustar el offset del popup para que aparezca sobre el icono
    }).openPopup();

    // Añadir el marcador al mapa
    marker.addTo(leafletMap);

  }


  public addMark(mapa: OMapComponent, lat: number, lon: number): void {
    this.mp = mapa.getMapService().getMap();
    if (!this.mp) {
      return
    }
    this.mp.setView([+lat, +lon], 4);
    mapa.addMarker('coworking_marker',           // id
      lat,                        // latitude
      lon,                        // longitude
      { draggable: true },          // options
      this.translate.get("COWORKING_MARKER"), // popup
      false,                        // hidden
      true,                         // showInMenu
      this.translate.get("COWORKING_MARKER")  // menuL);
    );
  }

  public updateMapAndMarker(mapa: OMapComponent, lat: number, lon: number, markerLabel: string | null, marker: L.marker | null, latToSave: number | null, lonToSave: number | null) {
    this.mp = mapa.getMapService().getMap();
    this.mp.setView([+lat, +lon], 16);
    // Eliminar el marcador actual si existe
    if (marker) {
      this.mp.removeLayer(marker);
    }
    // Crear y agregar el nuevo marcador
    marker = L.marker([lat, lon], { title: markerLabel, draggable: true }).addTo(this.mp);
    marker.options.id = 1; // Añadir la ID al marcador
    // Evento click del marcador
    marker.on('click', (event: any) => {
      let id = event.target.options.id;
    });
    // Evento dragend del marcador
    marker.on('dragend', (event) => {
      const { lat, lng } = event.target.getLatLng(); // Obtener latitud y longitud
      latToSave = lat;
      lonToSave = lng;
    });
  }

  public addMarkers(
    layerGroup: L.LayerGroup,
    coworkings: Coworking[]
  ): void {
    coworkings.forEach((coworking) => {
      const marker = L.marker([coworking.lat, coworking.lon], {
        draggable: false
      }).bindTooltip(coworking.name, { permanent: false, direction: 'top' });




      marker.on('click', () => {
        this.router.navigate(['/coworkings', coworking.id], { queryParams: { isdetail: true } });
      });
      layerGroup.addLayer(marker);
    });
  }

  public setUserMap(mapaLocal: OMapComponent) {
    this.leafletMap = mapaLocal.getMapService().getMap();
  }

  public async getUserGeolocation(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Suponiendo que usas navigator.geolocation para obtener la geolocalización
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.setLocation(position.coords.latitude, position.coords.longitude);
          this.mapLat = position.coords.latitude;
          this.mapLon = position.coords.longitude;
          this.leafletMap.setView([this.mapLat, this.mapLon], 14);
          this.addMyMarker(this.leafletMap, this.mapLat, this.mapLon);
          resolve();
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  public setLocation(latitude: number, longitude: number) {
    this.location$.next({ latitude: latitude, longitude: longitude });
  }

  public getLocation() {
    let location = new Map<string, string>();
    location.set("Lat", this.mapLat.toString());
    location.set("Lon", this.mapLon.toString());
    return location;
  }

  public async obtenerCoworkings(): Promise<Coworking[]> {
    return new Promise((resolve, reject) => {
      let coworkings: Coworking[] = [];

      const filter = {
        LAT_ORIGEN: this.mapLat,
        LON_ORIGEN: this.mapLon,
        DISTANCE: 5,
      };
      const columns = ["cw_id", "cw_name", "cw_lat", "cw_lon", "distancia_km"];

      const conf = this.service.getDefaultServiceConfiguration("coworkings");
      this.service.configureService(conf);

      this.service.query(filter, columns, "coworkingNearby").subscribe(
        (resp) => {
          if (resp.code == 0) {

            coworkings = resp.data.map(item => ({
              id: item.cw_id,
              name: item.cw_name,
              lat: +item.cw_lat,
              lon: +item.cw_lon,
              distance_km: item.distancia_km
            }));

            resolve(coworkings);
          } else {
            reject(new Error('Error en la consulta de coworkings'));
          }
        },
        (error) => {
          reject(error);
        }
      );
    });
  }
}

export interface ImapAddress {
  lat: number;
  lon: number;
  address: string;
  city: string;
}

export interface Coworking {
  id: number;
  lat: number;
  lon: number;
  name: string;
  distance_km: number;
}



