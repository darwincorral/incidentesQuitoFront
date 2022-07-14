import { Component, OnInit } from '@angular/core';
import { IncidentesService, UiServicesService } from 'src/app/services/service.index';
import Swal from "sweetalert2";

@Component({
  selector: 'app-asignaciones',
  templateUrl: './asignaciones.component.html',
  styleUrls: ['./asignaciones.component.css']
})
export class AsignacionesComponent implements OnInit {

  latitude = -0.15985;
  longitude = -78.42495;

  incidentesFilter = [];
  previous;
  zonas = [];
  poligono = [];
  operadores = [];
  filterTerm: string;

  
  constructor(private uiService: UiServicesService, private incidentesService: IncidentesService) { }

  ngOnInit() {
    this.obtenerOperadores();
    this.obtenerZonas();
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
            this.incidentesService
              .obtenerZonasOperadores()
              .subscribe((operadoresZonasCatalogo: any) => {
                for (let operadorAMT of operadoresAMT) {
                  const result = operadoresZonasCatalogo.filter(
                    (operadorZonaCatalogo) =>
                      operadorZonaCatalogo.nombre ==
                      operadorAMT.numeroIdentificacion
                  );
                  if (result.length == 0) {
                    this.operadores.push({
                      nombres:
                        operadorAMT.nombrePersona +
                        " " +
                        operadorAMT.apellidoPersona,
                      numeroIdentificacion: operadorAMT.numeroIdentificacion,
                      zona: "Sin Asignacion",
                      idCatalogo: null,
                    });
                  } else {
                    this.operadores.push({
                      nombres:
                        operadorAMT.nombrePersona +
                        " " +
                        operadorAMT.apellidoPersona,
                      numeroIdentificacion: operadorAMT.numeroIdentificacion,
                      zona: result[0].valor,
                      idCatalogo: result[0]._id,
                    });
                  }
                }
              });
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
      idPadre: "62ca2b719df419b66a5c47ef",
      nombre: operador.numeroIdentificacion,
      valor: zonaOperador[0]["nombre"],
      tipo: "Texto",
    };
    if (operador.idCatalogo == null) {
      this.incidentesService.asignarZona(formData).subscribe(
        (resultado: any) => {
          Swal.fire("Zona Asignada Correctamente", "", "success");
        },
        (error) => {
          Swal.fire("Ocurrio un error al ingresar los datos", "", "error");
        }
      );
    } else {
      this.incidentesService
        .actualizarZona(formData, operador.idCatalogo)
        .subscribe(
          (resultado: any) => {
            Swal.fire("Zona Actualizada Correctamente", "", "success");
          },
          (error) => {
            Swal.fire("Ocurrio un error al ingresar los datos", "", "error");
          }
        );
    }
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
            for (var incidente of incidentes) {
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

}
