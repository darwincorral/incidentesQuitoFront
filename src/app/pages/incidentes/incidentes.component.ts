import { Component, OnInit } from '@angular/core';
import { UiServicesService,IncidentesService } from 'src/app/services/service.index';

@Component({
  selector: 'app-incidentes',
  templateUrl: './incidentes.component.html',
  styleUrls: ['./incidentes.component.css']
})
export class IncidentesComponent implements OnInit {
  isCargando:boolean = false;
  incidentes = [];

  constructor(
    private incidentesService: IncidentesService,
    private uiService: UiServicesService,
  ) { }

  ngOnInit() {
    this.obtenerIncidentes();
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

}
