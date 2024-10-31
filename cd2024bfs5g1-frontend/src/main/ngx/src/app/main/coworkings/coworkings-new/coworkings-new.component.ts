import { AfterViewInit, Component, Injector, OnInit, ViewChild } from "@angular/core";
import {
  OFormComponent,
  ODateInputComponent,
  OTranslateService,
} from "ontimize-web-ngx";
import { Router } from "@angular/router";
import { OntimizeService, OSnackBarConfig, SnackBarService } from 'ontimize-web-ngx';
import { OTranslatePipe } from "ontimize-web-ngx";

@Component({
  selector: "app-coworking-new",
  templateUrl: "./coworkings-new.component.html",
  styleUrls: ["./coworkings-new.component.css"],
})

export class CoworkingsNewComponent implements OnInit{
  public today: string = new Date().toLocaleDateString();
  public arrayServices:any=[];
  public exist = false;
  public availableServices:number = 6;
  public selectedServices:number = 0;
  protected service: OntimizeService;

  @ViewChild("coworkingForm") coworkingForm: OFormComponent;
  @ViewChild("startDate") coworkingStartDate: ODateInputComponent;
  @ViewChild("endDate") coworkingEndDate: ODateInputComponent;

  constructor(
    private router: Router,
    private translate: OTranslateService,
    protected injector:Injector,
    protected snackBarService: SnackBarService
  ) {
    this.service = this.injector.get(OntimizeService);
  }

  ngOnInit(): void {
    this.configureService();
  }

  protected configureService(){
    const conf = this.service.getDefaultServiceConfiguration('coworkings');
    this.service.configureService(conf);
  }

  public onInsertSuccess(): void {
    this.coworkingForm.setInitialMode();
    this.router.navigateByUrl("/main/mycoworkings")
  }

  public selectService(id:number, sel:string, serv:string):void{
    this.exist = false;
    for (let i = 0; i < this.arrayServices.length; i++) {
      if(this.arrayServices[i].id === id){
        this.exist = true;
        this.deleteService(i, id, sel, serv);
      }
    }
    if (!this.exist) {
      this.appendService(id, sel, serv);
    }
  }

  public appendService(id:number, idsel:string, serv:string):void{
    this.arrayServices.push({id:id});
    document.getElementById(idsel).style.backgroundColor = "whitesmoke";
    document.getElementById(idsel).style.color = "black";
    document.getElementById(serv).style.backgroundColor = "#e6d5c3";
    document.getElementById(serv).style.color = "black;";
    this.selectedServices ++;
    this.availableServices --;
  }

  public deleteService(index:number, id:number, sel:string, serv:string):void{
    this.arrayServices.splice(index, 1)
    document.getElementById(serv).style.backgroundColor = "whitesmoke";
    document.getElementById(serv).style.color ="black";
    document.getElementById(sel).style.backgroundColor = "#e6d5c3";
    document.getElementById(sel).style.color ="black";
    this.selectedServices --;
    this.availableServices ++;
  }

  public save(){
    const coworking = {
      cw_name:this.coworkingForm.getFieldValue('cw_name'),
      cw_description:this.coworkingForm.getFieldValue('cw_description'),
      cw_address:this.coworkingForm.getFieldValue('cw_address'),
      cw_location:this.coworkingForm.getFieldValue('cw_location'),
      cw_capacity:this.coworkingForm.getFieldValue('cw_capacity'),
      cw_daily_price:this.coworkingForm.getFieldValue('cw_daily_price'),
      cw_image:this.coworkingForm.getFieldValue('cw_image'),
      services:this.arrayServices
    }
    this.insert(coworking);
    this.coworkingForm.clearData();
    this.router.navigateByUrl("/main/mycoworkings");
  }

  public insert(coworking:any){
    this.service.insert(coworking, 'coworking').subscribe(data => {
      console.log(data);
      this.showConfigured();
    });
  }

  public cancel(){
    this.onInsertSuccess();
  }

  isInvalidForm(): boolean {
    let name = this.coworkingForm?.getFieldValue('cw_name');
    let description = this.coworkingForm?.getFieldValue('cw_description');
    let address = this.coworkingForm?.getFieldValue('cw_address');
    let location = this.coworkingForm?.getFieldValue('cw_location');
    let capacity = this.coworkingForm?.getFieldValue('cw_capacity');
    let dailyPrice = this.coworkingForm?.getFieldValue('cw_daily_price');
    if ((name && name.length) && (description && description.length) &&
        (address && address.length) && (location && location.length) &&
        (capacity && capacity != 0) && (dailyPrice && dailyPrice != 0)) {
      return false;
    }else{
      return true;
    }
  }

  public showConfigured() {
    // SnackBar configuration
    const configuration: OSnackBarConfig = {
        action: '¡Coworking creado!',
        milliseconds: 5000,
        icon: 'check_circle',
        iconPosition: 'left'
    };

    // Simple message with icon on the left and action
    this.snackBarService.open('¡Coworking creado!', configuration);
}
}
