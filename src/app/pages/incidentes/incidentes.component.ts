import { Component, OnInit } from "@angular/core";
import { IncidentesService } from "src/app/services/service.index";
import Swal from "sweetalert2";
declare const google: any;
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

  paths = [
    { lat: 0.021867, lng: -78.498062 },
    { lat: -0.004002, lng: -78.528904 },
    { lat: -0.022052, lng: -78.477204 },
    { lat: -0.049494, lng: -78.495418 },
    { lat: -0.068423, lng: -78.495151 },
    { lat: -0.072269, lng: -78.488571 },
    { lat: -0.077411, lng: -78.49686 },
    { lat: -0.076052, lng: -78.503039 },
    { lat: -0.07991, lng: -78.504813 },
    { lat: -0.077833, lng: -78.527076 },
    { lat: -0.086549, lng: -78.534138 },
    { lat: -0.098271, lng: -78.53821 },
    { lat: -0.112385, lng: -78.535466 },
    { lat: -0.103252, lng: -78.517592 },
    { lat: -0.114625, lng: -78.511434 },
    { lat: -0.125179, lng: -78.531197 },
    { lat: -0.168452, lng: -78.501821 },
    { lat: -0.177036, lng: -78.519313 },
    { lat: -0.196053, lng: -78.52012 },
    { lat: -0.204454, lng: -78.510256 },
    { lat: -0.205502, lng: -78.51505 },
    { lat: -0.200393, lng: -78.52479 },
    { lat: -0.253077, lng: -78.55572 },
    { lat: -0.251722, lng: -78.565555 },
    { lat: -0.273532, lng: -78.586753 },
    { lat: -0.339329, lng: -78.582543 },
    { lat: -0.356277, lng: -78.545081 },
    { lat: -0.335837, lng: -78.527332 },
    { lat: -0.329631, lng: -78.521328 },
    { lat: -0.311251, lng: -78.517737 },
    { lat: -0.315934, lng: -78.505498 },
    { lat: -0.337317, lng: -78.502195 },
    { lat: -0.366427, lng: -78.476492 },
    { lat: -0.308421, lng: -78.44559 },
    { lat: -0.323721, lng: -78.412276 },
    { lat: -0.395314, lng: -78.377958 },
    { lat: -0.394251, lng: -78.355715 },
    { lat: -0.299326, lng: -78.380903 },
    { lat: -0.276968, lng: -78.441677 },
    { lat: -0.221079, lng: -78.457838 },
    { lat: -0.232989, lng: -78.452178 },
    { lat: -0.237597, lng: -78.442553 },
    { lat: -0.237732, lng: -78.388146 },
    { lat: -0.223983, lng: -78.367036 },
    { lat: -0.196423, lng: -78.376736 },
    { lat: -0.183168, lng: -78.412509 },
    { lat: -0.137784, lng: -78.409692 },
    { lat: -0.22811, lng: -78.352265 },
    { lat: -0.241182, lng: -78.336708 },
    { lat: -0.234154, lng: -78.325704 },
    { lat: -0.093299, lng: -78.274166 },
    { lat: -0.069019, lng: -78.28615 },
    { lat: -0.045729, lng: -78.335648 },
    { lat: -0.044439, lng: -78.430316 },
    { lat: -0.001763, lng: -78.427046 },
    { lat: 0.016234, lng: -78.451513 },
    { lat: 0.023968, lng: -78.498461 },
  ];

  constructor(private incidentesService: IncidentesService) {}

  ngOnInit() {
   // this.obtenerIncidentes(this.estado);
    this.obtenerListaAgentes();
  }


  onMapReady(map) {
    this.initDrawingManager(map);
  }

  initDrawingManager(map: any) {
    var that = this;
    const options = {
      drawingControl: true,
      drawingControlOptions: {
        drawingModes: ["polygon"]
      },
      polygonOptions: {
        draggable: true,
        editable: true
      },
   //   drawingMode: google.maps.drawing.OverlayType.POLYGON
    };

    const drawingManager = new google.maps.drawing.DrawingManager(options);
    drawingManager.setMap(map);
    google.maps.event.addListener(drawingManager, 'polygoncomplete', function (polygon) {
      const len = polygon.getPath().getLength();
      const polyArrayLatLng = [];

      for (let i = 0; i < len; i++) {
        const vertex = polygon.getPath().getAt(i);
        const vertexLatLng = {lat: vertex.lat(), lng: vertex.lng()};
        polyArrayLatLng.push(vertexLatLng);
      }
      // the last point of polygon should be always the same as the first point (math rule)
      polyArrayLatLng.push(polyArrayLatLng[0]);
      that.paths = polyArrayLatLng;
      drawingManager.setDrawingMode(null);
    });


  }


  location(x) {
    this.latitude = x.coords.lat;
    this.longitude = x.coords.lng;

    console.log(x);
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

  trabajarPoligono(){
    this.obtenerIncidentes('GEN');
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
              this.paths,
              incidente.latitud,
              incidente.longitud
            )
          ) {
            incidentesNew.push(incidenteModificado);
          }
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
