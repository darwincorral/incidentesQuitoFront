import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse  } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IncidentesService {

  constructor(private http:HttpClient) { }

  obtenerIncidentes(){
    return this.http.get(environment.URL_SERVICIOS+'/incidentes/');
  }
}
