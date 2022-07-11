import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import Swal from "sweetalert2";
import { CatalogosService, IncidentesService } from "src/app/services/service.index";
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

  incidentes = [];
  incidentesFilter = [];

  latitude = -0.15985;
  longitude = -78.42495;
  previous;
  zonas = [];
  poligono = [];
  operadores = [];
  filterTerm: string;
  constructor(
    private incidentesService: IncidentesService,
    private uiService: UiServicesService,
    private catalogosService: CatalogosService
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
              this.asignados = total.listAsignados;
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
            let operadoresAMT = operadores.retorno[1].listPerfilListUsuarioDTO;
            this.incidentesService.obtenerZonasOperadores().subscribe(
              (operadoresZonasCatalogo: any) => {
                for (let operadorAMT of operadoresAMT) {
                  const result = operadoresZonasCatalogo.filter(operadorZonaCatalogo => operadorZonaCatalogo.nombre == operadorAMT.numeroIdentificacion);
                      if(result.length==0){
                        this.operadores.push({
                        nombres: operadorAMT.nombrePersona + " "+ operadorAMT.apellidoPersona,
                        numeroIdentificacion:operadorAMT.numeroIdentificacion,
                        zona: 'Sin Asignacion',
                        idCatalogo: null
                      });
                      }else{
                        this.operadores.push({
                          nombres: operadorAMT.nombrePersona + " "+ operadorAMT.apellidoPersona,
                          numeroIdentificacion:operadorAMT.numeroIdentificacion,
                          zona: result[0].valor,
                          idCatalogo: result[0]._id
                        });
                      }
                }
              }
            );
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

  seleccionarZonaOperador(idZona, operador) {
    let zonaOperador = this.zonas.filter((value) => value._id === idZona);
    let formData = {
      "idPadre":"62ca2b719df419b66a5c47ef",
      "nombre":operador.numeroIdentificacion,
      "valor": zonaOperador[0]['nombre'],
      "tipo":"Texto"
    };
    if(operador.idCatalogo ==null){
      this.incidentesService.asignarZona(formData).subscribe(
      (resultado: any) => {
        Swal.fire("Zona Asignada Correctamente", "", "success");
      },
      (error) => {
        Swal.fire("Ocurrio un error al ingresar los datos", "", "error");
      }
    );
    }else{
      this.incidentesService.actualizarZona(formData,operador.idCatalogo).subscribe(
        (resultado: any) => {
          Swal.fire("Zona Actualizada Correctamente", "", "success");
        },
        (error) => {
          Swal.fire("Ocurrio un error al ingresar los datos", "", "error");
        });
    }
  }

}
