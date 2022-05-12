import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class RedirectGuard implements CanActivate  {
  constructor(
    public _usuarioService: UsuarioService,
    public router: Router
  ) { }

  canActivate() {

    if ( this._usuarioService.estaLogueado() ) {
      //console.log( 'PASO EL GUARD');
      this.router.navigate(['/incidentes'])
      return false;
    } else {
      //console.log( 'Bloqueado por guard' );
      return true;
    }
//return true
  }
}
