import { Component, OnInit } from '@angular/core';
import { UiServicesService,IncidentesService } from 'src/app/services/service.index';
import * as moment from 'moment';
import { Map, tileLayer, marker, icon  } from 'leaflet';

@Component({
  selector: 'app-incidentes',
  templateUrl: './incidentes.component.html',
  styleUrls: ['./incidentes.component.css']
})
export class IncidentesComponent implements OnInit {
  isCargando:boolean = false;
  incidentes = [];
  incidente = null;
  
  latitude=51.678418;
  longitude=7.809007;

  constructor(
    private incidentesService: IncidentesService,
    private uiService: UiServicesService,
  ) { }

  ngOnInit() {
    this.obtenerIncidentes();
  }

  location(x){
    this.latitude=x.coords.lat;
    this.longitude=x.coords.lng;
  }
  
  obtenerIncidentes(){
    this.isCargando = true;
    this.incidentesService.obtenerIncidentes()
    .subscribe((incidentes:any)=>{
      this.isCargando = false;
      this.incidentes = incidentes.reverse();
    },error => {
      this.isCargando = false;
    this.incidentes = [];
  });
  }

  verIncidente(incidente){
    this.incidente = incidente;
  }

  cancelarIncidente(incidente){
   this.incidentesService.cancelarIncidente(incidente._id,incidente.persona._id)
    .subscribe((incidente:any)=>{
      this.incidentes = [];
      this.obtenerIncidentes();
    },error => {
  });
  }

}
