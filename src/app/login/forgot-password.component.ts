import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UsuarioService } from '../services/service.index';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'
import { UiServicesService } from '../services/servicios/ui-services.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styles: []
})
export class ForgotPasswordComponent implements OnInit {

  user:string;
  constructor(
    public router: Router,
    public _usuarioService: UsuarioService,
    public _uiService: UiServicesService
    ) { }

  ngOnInit() {
  }


  recuperarPass(form: NgForm){

    if(form.invalid){
      return;
    }
 
    let user = form.value.user;
    Swal.fire({
      title: 'Enviando Correo',
      text: "Por Favor espere...",
      type: 'info',
      //showCloseButton: true,
      onBeforeOpen: () => {
        Swal.showLoading()
        this._usuarioService.recuperarPass(user).subscribe((respuesta:any)=>{
          if(respuesta.codRetorno=='0001'){
            let mail = respuesta.retorno.correo;
            let pass = respuesta.retorno.newPassword;
            let nombres = respuesta.retorno.nombres;
            this._uiService.enviarCorreo(mail,'Tu clave temporal es '+ pass, nombres).subscribe((resp:any)=>{
              let totalLetrasMail = mail.indexOf("@")-2;
              let mailProtegido = mail.replace(mail.substring(1,totalLetrasMail), '*'.repeat(totalLetrasMail-1));
                Swal.fire({
                  title: 'Correo Enviado Exitosamente',
                  text: 'Se envió una clave temporal al correo '+mailProtegido,
                  type: 'success',
                })
                this.router.navigate(['/login'])
            })
          }else{
            this.alertUserError();
            this.user = "";
          }
        },error => {
          this.alertUserError();
          this.user = "";
      });
      },
      allowOutsideClick: () => !Swal.isLoading()
    })
 
   }

   alertUserError(){
    Swal.fire({
      text: 'No se encuentra el usuario, intente nuevamente',
      type: 'error',
      confirmButtonText: 'Aceptar'
    })
   }

   alertCorreoError(){
    Swal.fire({
      text: 'No se encuentra el usuario, intente nuevamente',
      type: 'error',
      confirmButtonText: 'Aceptar'
    })
   }
}
