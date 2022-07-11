import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { UsuarioService } from '../usuario/usuario.service';

@Injectable()
export class LoginGuardGuard implements CanActivate {

  constructor(
    public _usuarioService: UsuarioService,
    public router: Router
  ) {}

  canActivate() {

    if ( this._usuarioService.estaLogueado() ) {

    /*  if ( this._usuarioService.rol === 'ADMINISTRADOR' ) {
        return true;
      }else {
        console.log(this._usuarioService.rol)
        this.router.navigate(['/incidentes']);
        return false;
      }*/
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
