import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UsuarioService } from '../services/service.index';
import { Usuario } from '../models/usuario.model';

declare function init_plugins();

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit {

  usuario:string;
  recuerdame: boolean = false;
  constructor(
    public router: Router,
    public _usuarioService: UsuarioService) { }

  ngOnInit() {
    init_plugins();
    this.usuario = localStorage.getItem('usuario'+this._usuarioService.keyApp) || '';
    if(this.usuario.length>1){
      this.recuerdame = true;
    }
  }

  ingresar(forma: NgForm){

   if(forma.invalid){
     return;
   }

   let usuario = new Usuario(forma.value.usuario,forma.value.password)

   this._usuarioService.login(usuario, forma.value.recuerdame)
   .subscribe(resp=>this.router.navigate(['/dashboard']));

  }


}
