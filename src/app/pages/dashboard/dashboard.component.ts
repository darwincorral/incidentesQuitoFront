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
  tipoIncidente="*";

  total=0;

   nuevosMes =[0,0,0,0,0,0,0,0,0,0,0,0];
   asignadosMes =[0,0,0,0,0,0,0,0,0,0,0,0];
   canceladosMes =[0,0,0,0,0,0,0,0,0,0,0,0];
   resueltosMes =[0,0,0,0,0,0,0,0,0,0,0,0];

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
                labels: ["Nuevos","En Proceso" , "Falsos", "Atendidos"],
                datasets: [
                  {
                    data: [
                      this.nuevos,
                      this.asignados,
                      this.falsos,
                      this.atendidos,
                    ],
                    backgroundColor: [
                      "#FFCE56",
                      "#36A2EB",
                      "#f5365c",
                      "#2dce89",
                    ],
                    hoverBackgroundColor: [
                      "#FFCE56",
                      "#36A2EB",
                      "#f5365c",
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

            let i =[0,0,0,0,0,0,0,0,0,0,0,0];
            this.nuevosMes =[0,0,0,0,0,0,0,0,0,0,0,0];
            this.asignadosMes =[0,0,0,0,0,0,0,0,0,0,0,0];
            this.canceladosMes =[0,0,0,0,0,0,0,0,0,0,0,0];
            this.resueltosMes =[0,0,0,0,0,0,0,0,0,0,0,0];

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
                if(meses[0]== meses[d.getMonth()] && (incidente.tipoIncidente.nombre ==this.tipoIncidente|| this.tipoIncidente =='*')){
                  i[0]= i[0]+1;
                  this.sumaIncidentes(incidente,0 );
                }
                if(meses[1]== meses[d.getMonth()] && (incidente.tipoIncidente.nombre ==this.tipoIncidente|| this.tipoIncidente =='*')){
                  i[1]= i[1]+1;
                  this.sumaIncidentes(incidente,1);
                }
                if(meses[2]== meses[d.getMonth()] && (incidente.tipoIncidente.nombre ==this.tipoIncidente|| this.tipoIncidente =='*')){
                  i[2]= i[2]+1;
                  this.sumaIncidentes(incidente,2);
                }
                if(meses[3]== meses[d.getMonth()] && (incidente.tipoIncidente.nombre ==this.tipoIncidente|| this.tipoIncidente =='*')){
                  i[3]= i[3]+1;
                  this.sumaIncidentes(incidente,3);
                }
                if(meses[4]== meses[d.getMonth()] && (incidente.tipoIncidente.nombre ==this.tipoIncidente|| this.tipoIncidente =='*')){
                  i[4]= i[4]+1;
                  this.sumaIncidentes(incidente,4);
                }
                if(meses[5]== meses[d.getMonth()] && (incidente.tipoIncidente.nombre ==this.tipoIncidente|| this.tipoIncidente =='*')){
                  i[5]= i[5]+1;
                  this.sumaIncidentes(incidente,5);
                }
                if(meses[6]== meses[d.getMonth()] && (incidente.tipoIncidente.nombre ==this.tipoIncidente|| this.tipoIncidente =='*')){
                  i[6]= i[6]+1;
                  this.sumaIncidentes(incidente,6);
                }
                if(meses[7]== meses[d.getMonth()] && (incidente.tipoIncidente.nombre ==this.tipoIncidente|| this.tipoIncidente =='*')){
                  i[7]= i[7]+1;
                  this.sumaIncidentes(incidente,7);
                }
                if(meses[8]== meses[d.getMonth()] && (incidente.tipoIncidente.nombre ==this.tipoIncidente|| this.tipoIncidente =='*')){
                  i[8]= i[8]+1;
                  this.sumaIncidentes(incidente,8);
                }
                if(meses[9]== meses[d.getMonth()] && (incidente.tipoIncidente.nombre ==this.tipoIncidente|| this.tipoIncidente =='*')){
                  i[9]= i[9]+1;
                  this.sumaIncidentes(incidente,9);
                }
                if(meses[10]== meses[d.getMonth()] && (incidente.tipoIncidente.nombre ==this.tipoIncidente|| this.tipoIncidente =='*')){
                  i[10]= i[10]+1;
                  this.sumaIncidentes(incidente,10);
                }
                if(meses[11]== meses[d.getMonth()] && (incidente.tipoIncidente.nombre ==this.tipoIncidente|| this.tipoIncidente =='*')){
                  i[11]= i[11]+1;
                  this.sumaIncidentes(incidente,11);
                }
   
              }
            }
            const reducer = (accumulator, curr) => accumulator + curr;
            this.total =i.reduce(reducer);

            this.dataBarra = {
              labels: meses,
              datasets: [
                {
                  label: "Total",
                  backgroundColor: "#404e67",
                  borderColor: "#404e67",
                  data: i,
                },
                {
                  label: "Nuevos",
                  backgroundColor: "#FFCE56",
                  borderColor: "#FFCE56",
                  data: this.nuevosMes,
                },
                {
                  label: "En Proceso",
                  backgroundColor: "#36A2EB",
                  borderColor: "#36A2EB",
                  data: this.asignadosMes,
                },
                {
                  label: "Cancelados",
                  backgroundColor: "#f5365c",
                  borderColor: "#f5365c",
                  data: this.canceladosMes,
                },
                {
                  label: "Atendidos",
                  backgroundColor: "#2dce89",
                  borderColor: "#2dce89",
                  data: this.resueltosMes,
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

  sumaIncidentes(incidente,i){
    if(incidente.estado == 'GEN'){
      return this.nuevosMes[i]= this.nuevosMes[i]+1;
    }
    if(incidente.estado == 'CHG'){
      return this.asignadosMes[i]= this.asignadosMes[i]+1;
    }
    if(incidente.estado == 'CAN'){
      return this.canceladosMes[i]= this.canceladosMes[i]+1;
    }
    if(incidente.estado == 'AFE'){
      return this.resueltosMes[i]= this.resueltosMes[i]+1;
    }
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
    this.obtenerIncidentes();
  }

  seleccionarTipoIncidente(event) {
    this.tipoIncidente = event;
    this.obtenerIncidentes();
  }
}
