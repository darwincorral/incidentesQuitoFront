import { Injectable } from '@angular/core';
import { HttpClient  } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Usuario } from '../../models/usuario.model';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import Swal from 'sweetalert2'

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  usuario: string;
  nombre: string;
  menu: any[] = [];
  keyApp = '_'+environment.nombreAplicaion + '_' + parseInt(environment.idAplicacion);
  rol: string;
  constructor(
    private http:HttpClient,
    public router: Router
    ) {
   this.cargarStorage();
   }

  estaLogueado(){
    return (this.usuario.length>1)? true:false;
  }


  cargarStorage() {
    if ( JSON.parse(localStorage.getItem('key'+this.keyApp)) == this.keyApp && localStorage.getItem('login'+this.keyApp)) {
      this.usuario = localStorage.getItem('login'+this.keyApp) ;
      this.nombre = localStorage.getItem('nombreUsuario'+this.keyApp) ;
      this.rol = localStorage.getItem('rol'+this.keyApp);
      this.menu = JSON.parse( localStorage.getItem('menu'+this.keyApp))
    } else {
      this.usuario = "";
      this.nombre="";
      this.rol = "";
      this.menu = [];
    }
  }


  guardarStorage( usuario:string,menu:any, rol:string, nombre:string ) {
    localStorage.setItem('key'+this.keyApp, JSON.stringify(this.keyApp));
    localStorage.setItem('login'+this.keyApp, usuario );
    localStorage.setItem('rol'+this.keyApp, rol );
    localStorage.setItem('nombreUsuario'+this.keyApp,nombre);
    localStorage.setItem('menu'+this.keyApp, JSON.stringify(menu));
    this.usuario = usuario;
    this.nombre = nombre;
    this.rol = rol;
    this.menu = menu;
  }

  logout() {
    this.usuario = "";
    this.nombre = "";
    this.rol = "";
    this.menu = [];
    localStorage.removeItem('login'+this.keyApp);
    localStorage.removeItem('menu'+this.keyApp);
    localStorage.removeItem('rol'+this.keyApp);
    localStorage.removeItem('key'+this.keyApp);
    localStorage.removeItem('nombreUsuario'+this.keyApp);

    this.router.navigate(['/login']);
  }

  login(usuario: Usuario, recordar: boolean = false){
    if(recordar){
      localStorage.setItem('usuario'+this.keyApp,usuario.usuario)
    }else{
      localStorage.removeItem('usuario'+this.keyApp);
    }
    let url = environment.URL_SERVICIOS_SEGURIDAD + '/usuario/login/';
    return this.http.get(url+usuario.usuario.toUpperCase()+"/"+usuario.password+"/"+environment.idAplicacion)
    .map((resp:any)=>{
      if(resp.codRetorno == '0010'){
        Swal.fire({
          title: 'Error!',
          text: 'Usuario y/o contraseña inválidos',
          type: 'error',
          confirmButtonText: 'Aceptar'
        })
        return false;
      }else{
        let respuesta = resp.retorno
        this.guardarStorage(respuesta.usuario.usuario, respuesta.lsMenu, respuesta.perfil.nombrePerfil, respuesta.cabeceraPersona.nombrePersona+' '+respuesta.cabeceraPersona.apellidoPersona);
        return true;
      }
      })
      .catch(err=>{
          Swal.fire({
            title: 'Error!',
            text: err.error.message,
            type: 'error',
            confirmButtonText: 'Aceptar'
          })
          return throwError(err);
      });
  }

  cambiarPassword(formPassword){
      let form = {
        'login':this.usuario,
        'oldPassword':formPassword.passwordOld,
        'newPassword':formPassword.passwordNew
      }
      return this.http.post(environment.URL_SERVICIOS_SEGURIDAD+'/usuario/updatePassword',form)
  }

  getPersona(){
    return this.http.get(environment.URL_SERVICIOS_SEGURIDAD+'/usuario/perfil/'+this.usuario+'/'+environment.idAplicacion)
  }


  updateUser(formUser,persona){
    let form = {
      'idCabeceraPersona': persona.cabeceraPersona.idCabeceraPersona,
      'telefonoCelular':formUser.contacto,
      'direccionDomicilio': formUser.direccion,
      'detallePersona':{
        'idDetallePersona': persona.cabeceraPersona.detallePersona.idDetallePersona,
        'mail':formUser.correo
      }
    }
    return this.http.post(environment.URL_SERVICIOS_SEGURIDAD+'/usuario/updateCabeceraPersona',form)
  }

  recuperarPass(cedula){
    return this.http.get(environment.URL_SERVICIOS_SEGURIDAD+'/usuario/forgotPassword/'+cedula)
  }

}
