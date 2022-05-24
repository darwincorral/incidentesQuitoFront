import { Component, OnInit } from "@angular/core";
import {
  UiServicesService,
  IncidentesService,
} from "src/app/services/service.index";
import * as moment from "moment";
import { Map, tileLayer, marker, icon } from "leaflet";
import Swal from "sweetalert2";
@Component({
  selector: "app-incidentes",
  templateUrl: "./incidentes.component.html",
  styleUrls: ["./incidentes.component.css"],
})
export class IncidentesComponent implements OnInit {
  isCargando: boolean = false;
  incidentes = [];
  incidente = null;
  agentes = [];
  latitude = 51.678418;
  longitude = 7.809007;
  filterTerm: string = "";
  estado = "GEN";
  constructor(
    private incidentesService: IncidentesService,
    private uiService: UiServicesService
  ) {}

  ngOnInit() {
    this.obtenerIncidentes(this.estado);
    this.obtenerListaAgentes();
  }

  location(x) {
    this.latitude = x.coords.lat;
    this.longitude = x.coords.lng;
  }

  obtenerIncidentes(estado) {
    this.estado = estado;
    this.incidentes = [];
    this.isCargando = true;
    this.incidentesService.obtenerIncidentes(estado).subscribe(
      (incidentes: any) => {
        this.isCargando = false;
        this.incidentes = incidentes.reverse();
      },
      (error) => {
        this.isCargando = false;
        this.incidentes = [];
      }
    );
  }

  verIncidente(incidente) {
    this.incidente = incidente;
  }

  cancelarIncidente(incidente) {
    Swal.fire({
      title: "Importante!",
      text: "Esta seguro de cancelar el Incidente?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Si, Continuar",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.value) {
        this.incidentesService
          .cancelarIncidente(incidente._id, incidente.persona._id)
          .subscribe(
            (incidente: any) => {
              this.obtenerIncidentes(this.estado);
            },
            (error) => {}
          );
      }
    });
  }

  obtenerListaAgentes() {
    this.incidentesService.obtenerListaAgentes().subscribe(
      (agentes: any) => {
        this.agentes = agentes.retorno;
      },
      (error) => {}
    );
  }

  asignarIncidenteAgente(agente) {
    Swal.fire({
      title: "Importante!",
      text: "Esta seguro de asignar el Incidente?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Si, Continuar",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.value) {
        this.incidentesService
          .asignarIncidenteAgente(this.incidente._id, agente.acNAct)
          .subscribe(
            (incidente: any) => {
              this.obtenerIncidentes(this.estado);
            },
            (error) => {}
          );
      }
    });
  }
}
