import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";

import { UsuarioService } from "../usuario/usuario.service";

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(public _usuarioService: UsuarioService, public router: Router) {}

  canActivate() {
    if (this._usuarioService.rol === "ADMINISTRADOR") {
      return true;
    } else {
      this.router.navigate(["/incidentes"]);
      return false;
    }
  }
}
