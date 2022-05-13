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

  title = 'My first AGM project';
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
      this.incidentes = incidentes;
      console.log(incidentes);
    },error => {
      this.isCargando = false;
    this.incidentes = [];
  });
  }

  verIncidente(incidente){
       
    let horaCreacion = moment(incidente.fechaCreacion).format("HH:mm");
    let fechaCreacion = moment(incidente.fechaCreacion).format("YYYY-MM-DD");
    this.incidente = incidente;
    console.log(incidente)
    this.incidente.fechaCreacion =fechaCreacion;
    this.incidente.horaCreacion = horaCreacion;
  }

}
