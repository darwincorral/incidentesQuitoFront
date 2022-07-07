import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import Swal from "sweetalert2";
import { IncidentesService } from "src/app/services/service.index";
import { UiServicesService } from '../../services/servicios/ui-services.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  nuevos = 0;
  asignados = 0;
  falsos = 0;
  atendidos = 0;
  tipoIncidente = '*';
  operadores = [];
  incidentes = [];
  latitude = -0.15985;
  longitude = -78.42495;
  previous;


  constructor(private incidentesService: IncidentesService, private uiService: UiServicesService) { }

  ngOnInit() {
    this.obtenerTotalesIncidentes();
    this.obtenerOperadores();
    this.obtenerIncidentes();
  }

  obtenerTotalesIncidentes(){
    Swal.fire({
      title: "Cargando Datos",
      text: "Por Favor espere...",
      type: "info",
      //showCloseButton: true,
      onBeforeOpen: () => {
        Swal.showLoading();
        this.incidentesService.obtenerTotalIncidentes(this.tipoIncidente).subscribe(
          (total: any) => {
            Swal.close();
            this.nuevos = total.listAsignados;
            this.nuevos = total.listNuevos;
            this.falsos = total.listFalsos;
            this.atendidos = total.listAtendidos;
          },
          (error) => {
            Swal.close();
          }
        );
      },
      allowOutsideClick: () => !Swal.isLoading(),
    });
  }


  obtenerIncidentes(){
    Swal.fire({
      title: "Cargando Datos",
      text: "Por Favor espere...",
      type: "info",
      //showCloseButton: true,
      onBeforeOpen: () => {
        Swal.showLoading();
        this.incidentesService.obtenerIncidentes('GEN').subscribe(
          (incidentes: any) => {
            Swal.close();
            this.incidentes = incidentes;
            console.log(incidentes)

            let incidentesNew = [];
            for (var incidente of this.incidentes) {
    
              //Cargar Iconos
              incidente.icono = {
                url: incidente.tipoIncidente.valor,
                scaledSize: {
                  width: 40,
                  height: 40,
                },
              };
    
                incidentesNew.push(incidente);
            }
    
            this.incidentes = incidentesNew;
          },
          (error) => {
            Swal.close();
          }
        );
      },
      allowOutsideClick: () => !Swal.isLoading(),
    });
  }
  
  obtenerOperadores(){
    Swal.fire({
      title: "Cargando Datos",
      text: "Por Favor espere...",
      type: "info",
      //showCloseButton: true,
      onBeforeOpen: () => {
        Swal.showLoading();
        this.uiService.obtenerOperadores().subscribe(
          (operadores: any) => {
            Swal.close();
            this.operadores = operadores.retorno[1].listPerfilListUsuarioDTO;
           console.log(this.operadores)
          },
          (error) => {
            Swal.close();
          }
        );
      },
      allowOutsideClick: () => !Swal.isLoading(),
    });
  }

  markerClicked(infoWindow) {
    if (this.previous) {
      this.previous.close();
    }
    this.previous = infoWindow;
  }
}
