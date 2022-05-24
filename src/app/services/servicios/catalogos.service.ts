import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse  } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CatalogosService {

  constructor(private http:HttpClient) { }

  obtenerCatalogos(idPadre){
    return this.http.get(environment.URL_SERVICIOS+'/catalogo/findIdPadre/'+idPadre);
  }


  crearCatalogo(formData){
    return this.http.post(environment.URL_SERVICIOS+'/catalogo/',formData);
  }

  editarCatalogo(idCatalogo,formData){
    return this.http.put(environment.URL_SERVICIOS+'/catalogo/'+idCatalogo,formData);
  }

  eliminarCatalogo(idCatalogo){
    return this.http.delete(environment.URL_SERVICIOS+'/catalogo/'+idCatalogo);
  }
}
