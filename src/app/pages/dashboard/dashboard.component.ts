import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import Swal from "sweetalert2";
import { IncidentesService } from "src/app/services/service.index";
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

  constructor(private incidentesService: IncidentesService) { }

  ngOnInit() {
    this.obtenerTotalesIncidentes();
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
          (error) => {}
        );
      },
      allowOutsideClick: () => !Swal.isLoading(),
    });
  }

}
