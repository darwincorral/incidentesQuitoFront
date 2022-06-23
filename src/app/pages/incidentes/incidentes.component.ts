import { Component, OnInit } from "@angular/core";
import { IncidentesService } from "src/app/services/service.index";
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
  latitude = -0.15985;
  longitude = -78.42495;
  filterTerm: string = "";
  estado = "CHG";
  previous;

  constructor(private incidentesService: IncidentesService) {}

  ngOnInit() {
    this.obtenerIncidentes(this.estado);
    this.obtenerListaAgentes();
  }

  location(x) {
    this.latitude = x.coords.lat;
    this.longitude = x.coords.lng;

    console.log(x);
  }



  markerClicked(infoWindow,incidente) {
    console.log(incidente)
    if (this.previous) {
      this.previous.close();
    }
    this.previous = infoWindow;
  }
  

  obtenerIncidentes(estado) {
    this.estado = estado;
    this.incidentes = [];
    this.isCargando = true;
    this.incidentesService.obtenerIncidentes(estado).subscribe(
      (incidentes: any) => {
        this.isCargando = false;
        this.incidentes = incidentes.reverse();
        let incidenteModificado;
        let incidentesNew = [];
        for (var incidente of this.incidentes) {
          incidenteModificado = incidente;
          incidenteModificado.icono = {
            url: incidente.tipoIncidente.valor,
            scaledSize: {
              width: 40,
              height: 40,
            },
          };
          incidentesNew.push(incidenteModificado);
        }

        this.incidentes = incidentesNew;
      },
      (error) => {
        this.isCargando = false;
        this.incidentes = [];
      }
    );
  }

  verIncidente(incidente) {

    Swal.fire({
      title: 'Cargando Incidente',
      text: "Por Favor espere...",
      type: 'info',
      //showCloseButton: true,
      onBeforeOpen: () => {
        Swal.showLoading()
        this.incidente = null;
        this.incidentesService.obtenerIncidenteById(incidente._id).subscribe(
          (incidente: any) => {
             Swal.close();
            this.incidente = incidente;
          },
          (error) => {
          }
        );
      },
      allowOutsideClick: () => !Swal.isLoading()
    })



  
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
