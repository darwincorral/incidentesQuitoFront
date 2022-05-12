import { Component, OnInit } from '@angular/core';
import { FormGroup,  Validators, FormControl } from '@angular/forms';
import { UsuarioService } from '../../services/service.index';

import Swal from 'sweetalert2'

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styles: []
})
export class PerfilComponent implements OnInit {
  userForm: FormGroup;
  passwordForm: FormGroup;

  persona:any=null;

  nombre;
  usuario;

  constructor(public _usuarioService: UsuarioService) { }


  sonIguales(campo1:string, campo2: string){
     return (group: FormGroup)=>{
      let passNew = group.controls[campo1].value;
      let passConfirm = group.controls[campo2].value;

      if(passNew === passConfirm){
        return null;
      }

      return{
         sonIguales:true
       };

     };
  }


  ngOnInit() {
    this.userForm = new FormGroup({
      correo: new FormControl('', [Validators.required, Validators.email]),
      contacto: new FormControl(''),
      direccion: new FormControl('')
    });

    this.passwordForm = new FormGroup({
      passwordOld: new FormControl('', Validators.required ),
      passwordNew: new FormControl('', Validators.required ),
      passwordConfirm: new FormControl('', Validators.required)
    },{validators: this.sonIguales('passwordNew','passwordConfirm')});

    this._usuarioService.getPersona().subscribe((resp:any)=>{
      this.persona = resp.retorno;
      this.userForm.get('correo').setValue(this.persona.cabeceraPersona.detallePersona.mail)
      this.userForm.get('contacto').setValue(this.persona.cabeceraPersona.telefonoCelular)
      this.userForm.get('direccion').setValue(this.persona.cabeceraPersona.direccionDomicilio)
    })

    this.nombre = this._usuarioService.nombre;
    this.usuario = this._usuarioService.usuario;

  }

  updateUser(){

   Swal.fire({
    title: 'Importante!',
    text: 'Esta seguro de actualizar sus datos?',
    type: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Si, Actualizar!',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.value) {
      this._usuarioService.updateUser(this.userForm.value,this.persona).subscribe((resp:any)=>{
        if(resp.codRetorno == '0001'){
          this.alertConfirm();
        }else{
          this.alertError('Ocurrio un error vuelva a intentarlo');
        }
      },error=>{
        this.alertError('Ocurrio un error vuelva a intentarlo');
      })
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      this.alertError('Acción Cancelada');
    }
  });
  }

  updatePassword(){
    if(this.passwordForm.invalid){
      return;
    }

    Swal.fire({
      title: 'Importante!',
      text: 'Esta seguro de actualizar su contraseña?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, Actualizar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        this._usuarioService.cambiarPassword(this.passwordForm.value).subscribe((resp:any)=>{
          if(resp.codRetorno=='0001'){
            this.passwordForm.reset();
            this.alertConfirm();
          }else{
            this.alertError(resp.retorno);
          }
        },error=>{
          this.alertError('Ocurrio un error vuelva a intentarlo');
        })
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.alertError('Acción Cancelada');
      }
    });
   }

   alertConfirm(){
    Swal.fire(
      'Actualizado!',
      'Sus Datos fueron actualizados correctamente',
      'success'
    )
   }

   alertError(message){
    Swal.fire(
      message,
      '',
      'error'
    )
   }

}
