import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import Swal from "sweetalert2";
import { IncidentesService } from "src/app/services/service.index";
import { UiServicesService } from "../../services/servicios/ui-services.service";
@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent implements OnInit {
  nuevos = 0;
  asignados = 0;
  falsos = 0;
  atendidos = 0;
  tipoIncidente = "*";
  operadores = [];
  incidentes = [];
  incidentesFilter = [];
  latitude = -0.15985;
  longitude = -78.42495;
  previous;
  zonas = [];
  poligono = [];

  constructor(
    private incidentesService: IncidentesService,
    private uiService: UiServicesService
  ) {}

  ngOnInit() {
    this.obtenerTotalesIncidentes();
    this.obtenerOperadores();
    this.obtenerZonas();
    this.obtenerIncidentes();
  }

  obtenerTotalesIncidentes() {
    Swal.fire({
      title: "Cargando Datos",
      text: "Por Favor espere...",
      type: "info",
      //showCloseButton: true,
      onBeforeOpen: () => {
        Swal.showLoading();
        this.incidentesService
          .obtenerTotalIncidentes(this.tipoIncidente)
          .subscribe(
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

  obtenerIncidentes() {
    Swal.fire({
      title: "Cargando Datos",
      text: "Por Favor espere...",
      type: "info",
      //showCloseButton: true,
      onBeforeOpen: () => {
        Swal.showLoading();
        this.incidentesService.obtenerIncidentes("GEN").subscribe(
          (incidentes: any) => {
            Swal.close();
            this.incidentes = incidentes;
            for (var incidente of this.incidentes) {
              //Verificar si el incidente dentro de la zona
              if (
                this.isLatLngInZone(
                  this.poligono,
                  incidente.latitud,
                  incidente.longitud
                )
              ) {
                //Cargar Iconos
                incidente.icono = {
                  url: incidente.tipoIncidente.valor,
                  scaledSize: {
                    width: 40,
                    height: 40,
                  },
                };
                this.incidentesFilter.push(incidente);
              }
            }
          },
          (error) => {
            Swal.close();
          }
        );
      },
      allowOutsideClick: () => !Swal.isLoading(),
    });
  }

  obtenerOperadores() {
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
            console.log(this.operadores);
          },
          (error) => {
            Swal.close();
          }
        );
      },
      allowOutsideClick: () => !Swal.isLoading(),
    });
  }

  obtenerZonas() {
    Swal.fire({
      title: "Cargando Datos",
      text: "Por Favor espere...",
      type: "info",
      //showCloseButton: true,
      onBeforeOpen: () => {
        Swal.showLoading();
        this.incidentesService.obtenerZonas().subscribe(
          (zonas: any) => {
            Swal.close();
            this.zonas = zonas;
            this.poligono = JSON.parse(zonas[0].valor);
          },
          (error) => {
            Swal.close();
          }
        );
      },
      allowOutsideClick: () => !Swal.isLoading(),
    });
  }

  seleccionarZona(event) {
    this.poligono = JSON.parse(event);
    this.incidentesFilter = [];
    this.obtenerIncidentes();
  }

  markerClicked(infoWindow) {
    if (this.previous) {
      this.previous.close();
    }
    this.previous = infoWindow;
  }

  isLatLngInZone(latLngs, lat, lng) {
    const vertices_y = new Array();
    const vertices_x = new Array();
    const longitude_x = lng;
    const latitude_y = lat;

    var r = 0;
    var i = 0;
    var j = 0;
    var c;
    var point = 0;

    for (r = 0; r < latLngs.length; r++) {
      vertices_y.push(latLngs[r].lat);

      vertices_x.push(latLngs[r].lng);
    }
    const points_polygon = vertices_x.length;
    for (i = 0, j = points_polygon; i < points_polygon; j = i++) {
      point = i;
      if (point == points_polygon) point = 0;
      if (
        vertices_y[point] > latitude_y != vertices_y[j] > latitude_y &&
        longitude_x <
          ((vertices_x[j] - vertices_x[point]) *
            (latitude_y - vertices_y[point])) /
            (vertices_y[j] - vertices_y[point]) +
            vertices_x[point]
      )
        c = !c;
    }
    return c;
  }
}
