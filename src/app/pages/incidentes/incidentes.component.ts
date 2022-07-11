import { Component, OnInit } from "@angular/core";
import {
  IncidentesService,
  UsuarioService,
} from "src/app/services/service.index";
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
  estado = "GEN";
  previous;
  operador;
  zonas = [];
  poligono = [];
  zona = null;

  constructor(
    private incidentesService: IncidentesService,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit() {
    this.obtenerZonas();
    this.obtetenerZonaOperador();
    this.obtenerListaAgentes();
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

  markerClicked(event, infoWindow, incidente) {
    console.log(incidente);
    if (this.previous) {
      this.previous.close();
    }
    this.previous = infoWindow;
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
          },
          (error) => {
            Swal.close();
          }
        );
      },
      allowOutsideClick: () => !Swal.isLoading(),
    });
  }

  obtetenerZonaOperador() {
    this.operador = this.usuarioService.persona;
    console.log(this.operador);
      this.incidentesService .obtenerZonasOperadores().subscribe((zonaOperadores: any) => {
          for (let zonaOperador of zonaOperadores)
            if (zonaOperador.nombre == this.operador.numeroIdentificacion) {
              this.zona = zonaOperador.valor;
              const result = this.zonas.filter(zona => zona.nombre == zonaOperador.valor);
              this.poligono = JSON.parse(result[0].valor);
              this.obtenerIncidentes('GEN');
            }
        });
  }

  obtenerIncidentes(estado) {
    this.estado = estado;
    this.incidentes = [];
    this.isCargando = true;
    this.incidentesService.obtenerIncidentes(estado).subscribe(
      (incidentes: any) => {
        this.isCargando = false;
        this.incidentes = incidentes.reverse();
        if(estado =='GEN'){
          let incidenteModificado;
          let incidentesNew = [];
          for (var incidente of this.incidentes) {
            incidenteModificado = incidente;
  
            //Cargar Iconos
            incidenteModificado.icono = {
              url: incidente.tipoIncidente.valor,
              scaledSize: {
                width: 40,
                height: 40,
              },
            };
  
            //Verificar si el incidente fue dentro de Quito
            if (
              this.isLatLngInZone(
                this.poligono,
                incidente.latitud,
                incidente.longitud
              )
            ) {
              incidentesNew.push(incidenteModificado);
            }
          }
          this.incidentes = incidentesNew;
        }
      },
      (error) => {
        this.isCargando = false;
        this.incidentes = [];
      }
    );
  }

  verIncidente(incidente) {
    Swal.fire({
      title: "Cargando Incidente",
      text: "Por Favor espere...",
      type: "info",
      //showCloseButton: true,
      onBeforeOpen: () => {
        Swal.showLoading();
        this.incidente = null;
        this.incidentesService.obtenerIncidenteById(incidente._id).subscribe(
          (incidente: any) => {
            Swal.close();
            this.incidente = incidente;
          },
          (error) => {}
        );
      },
      allowOutsideClick: () => !Swal.isLoading(),
    });
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
          .cancelarIncidente(incidente._id, incidente.persona._id,this.operador.numeroIdentificacion)
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
          .asignarIncidenteAgente(this.incidente._id, agente.cpNomb +' '+agente.cpApel,this.operador.numeroIdentificacion)
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
