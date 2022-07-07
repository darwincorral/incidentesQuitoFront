import { Injectable } from '@angular/core';
import Swal from 'sweetalert2'
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UiServicesService {

  constructor(
    private http:HttpClient,
  ) { }

  totalPaginas(totalRegistros, rango){
    let totalPaginas = Math.trunc((totalRegistros)/rango);
    if(parseInt(totalRegistros) > rango){
      let residuo  = (totalRegistros)%rango;
      if(residuo > 0){
        totalPaginas = (totalPaginas+1);
      }
      return totalPaginas
    }else{
      totalPaginas = 1;
      return totalPaginas;
    }
   }

   enviarCorreo(mail:string,text:string, nombres:string) {

    let dataMail:FormData = new FormData();
    dataMail.append('to', mail)
    dataMail.append('subject', 'Recuperación de contraseña del sistema de Teletrabajo AMT')
    dataMail.append('text', text)
    dataMail.append('param1', nombres)
    dataMail.append('param2', '')
    dataMail.append('param3', '')
    dataMail.append('param4', '')
    dataMail.append('param5', '')
    dataMail.append('tipo', '5')

    return this.http.post(environment.URL_SERVICIOS_CORREO,dataMail);
  }

  obtenerOperadores(){
    return this.http.get(environment.URL_SERVICIOS_SEGURIDAD +`/perfil/getListPerfilByIdApp/225`);
  }
}
