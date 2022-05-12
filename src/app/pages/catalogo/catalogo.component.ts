import { Component, OnInit } from '@angular/core';
import { CatalogosService } from 'src/app/services/service.index';

@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.css']
})
export class CatalogoComponent implements OnInit {
  isCargando:boolean = false;
  catalogos = [];
  constructor(
    private catalogosService: CatalogosService,
  ) { }

  ngOnInit() {
    this.obtenerCatalogos();
  }

  obtenerCatalogos(){
    this.isCargando = true;
    this.catalogosService.obtenerCatalogos(0)
    .subscribe((catalogos:any)=>{
      this.isCargando = false;
      this.catalogos = catalogos;
      console.log(catalogos);
    },error => {
      this.isCargando = false;
    this.catalogos = [];
  });
  }
}
