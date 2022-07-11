import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse  } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IncidentesService {

  constructor(private http:HttpClient) { }

  obtenerIncidentes(estado){
    return this.http.get(environment.URL_SERVICIOS+'/incidentes/'+estado);
  }

  obtenerIncidenteById(idIncidente){
    return this.http.get(environment.URL_SERVICIOS+'/incidentes/findByIdIncidente/'+idIncidente);
  }

  cancelarIncidente(idIncidente,idPersona){
    return this.http.put(environment.URL_SERVICIOS+`/incidentes/reportarIncidenteFalso/${idIncidente}/CAN/${idPersona}`,'');
  }

  asignarIncidenteAgente(idIncidente,idAgente){
    let data = {
      idAgente,
      estado:'CHG'
    }
    return this.http.put(environment.URL_SERVICIOS+'/incidentes/'+idIncidente,data);
  }

  obtenerListaAgentes(){
    return this.http.get(environment.URL_SERVICIOS_SEGURIDAD +`/personal/findAll_Persona01_ByCriterio/*/*/*/*/*/1/500`);
  }

  obtenerTotalIncidentes(tipoIncidente){
    return this.http.get(environment.URL_SERVICIOS+'/incidentes/findCountAll/'+tipoIncidente);
  }

  
  obtenerZonas(){
    return this.http.get(environment.URL_SERVICIOS+'/catalogo/findIdPadre/62c149bed2543a1ac1d61fdb');
  }

  obtenerZonasOperadores(){
    return this.http.get(environment.URL_SERVICIOS+'/catalogo/findIdPadre/62ca2b719df419b66a5c47ef');
  }

  asignarZona(formData){
    return this.http.post(environment.URL_SERVICIOS+'/catalogo/',formData);
  }

  actualizarZona(formData,idCatalogo){
    return this.http.put(environment.URL_SERVICIOS+'/catalogo/'+idCatalogo,formData);
  }
}
