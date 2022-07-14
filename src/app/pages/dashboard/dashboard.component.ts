import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import Swal from "sweetalert2";
import { IncidentesService } from "src/app/services/service.index";

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
  zonas = [];
  poligono = [];
  tipoIncidentes= [];
  incidentes = [];

  data: any;
  dataBarra: any;
  constructor(
    private incidentesService: IncidentesService,
  ) {}

  ngOnInit() {
    this.obtenerTotalesIncidentes();
    this.obtenerZonas();
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
            this.obtenerTiposIncidentes();
          },
          (error) => {
            Swal.close();
          }
        );
      },
      allowOutsideClick: () => !Swal.isLoading(),
    });
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
          .obtenerTotalIncidentes('*')
          .subscribe(
            (total: any) => {
              Swal.close();
              this.asignados = total.listAsignados;
              this.nuevos = total.listNuevos;
              this.falsos = total.listFalsos;
              this.atendidos = total.listAtendidos;

              this.data = {
                labels: ["Nuevos","En Revisión" , "Falsos", "Atendidos"],
                datasets: [
                  {
                    data: [
                      this.nuevos,
                      this.asignados,
                      this.falsos,
                      this.atendidos,
                    ],
                    backgroundColor: [
                      "#f5365c",
                      "#36A2EB",
                      "#FFCE56",
                      "#2dce89",
                    ],
                    hoverBackgroundColor: [
                      "#f5365c",
                      "#36A2EB",
                      "#FFCE56",
                      "#2dce89",
                    ],
                  },
                ],
              };
            },
            (error) => {
              Swal.close();
            }
          );
      },
      allowOutsideClick: () => !Swal.isLoading(),
    });
  }

  obtenerTiposIncidentes(){
    Swal.fire({
      title: "Cargando Datos",
      text: "Por Favor espere...",
      type: "info",
      //showCloseButton: true,
      onBeforeOpen: () => {
        Swal.showLoading();
        this.incidentesService.obtenerTipoIncidentes().subscribe(
          (tipoIncidentes: any) => {
            Swal.close();
            this.tipoIncidentes = tipoIncidentes;
            this.obtenerIncidentes();
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
        this.incidentesService.obtenerAllIncidentes().subscribe(
          (incidentes: any) => {
            Swal.close();
            let meses= ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  	        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];



            for (var incidente of incidentes) {

              //Verificar si el incidente dentro de la zona
              if (
                this.isLatLngInZone(
                  this.poligono,
                  incidente.latitud,
                  incidente.longitud
                )
              ) {
                const d = new Date(incidente.fechaCreacion);
                console.log("The current month is " + meses[d.getMonth()]);

                this.dataBarra = {
                  labels: meses,
                  datasets: [
                    {
                      label: "Nuevos",
                      backgroundColor: "#f5365c",
                      borderColor: "#f5365c",
                      data: [4,2],
                    },
                    {
                      label: "En Revisión",
                      backgroundColor: "#36A2EB",
                      borderColor: "#36A2EB",
                      data: [0],
                    },
                    {
                      label: "Falsos o Cancelados",
                      backgroundColor: "#FFCE56",
                      borderColor: "#FFCE56",
                      data: [0],
                    },
                    {
                      label: "Atendidos",
                      backgroundColor: "#2dce89",
                      borderColor: "#2dce89",
                      data: [0],
                    },
                  ],
                };

                this.incidentes.push(incidente);
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

  onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
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

  seleccionarZona(event) {
    this.poligono = JSON.parse(event);
    this.incidentes = [];
    this.obtenerIncidentes();
  }
}
