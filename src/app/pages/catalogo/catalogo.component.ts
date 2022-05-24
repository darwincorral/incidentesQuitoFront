import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { CatalogosService } from "src/app/services/service.index";
import Swal from "sweetalert2";
@Component({
  selector: "app-catalogo",
  templateUrl: "./catalogo.component.html",
  styleUrls: ["./catalogo.component.css"],
})
export class CatalogoComponent implements OnInit {
  isCargando: boolean = false;

  catalogos = [];
  catalogo = null;
  catalogoForm: FormGroup;
  idCatalogo = null;

  subCatalogos = [];


  constructor(private catalogosService: CatalogosService) {}

  ngOnInit() {
    this.obtenerCatalogos();
    this.formCatalogo();
  }

  formCatalogo() {
    this.idCatalogo = null;
    this.catalogoForm = new FormGroup({
      idPadre: new FormControl("0", Validators.required),
      nombre: new FormControl("", Validators.required),
      valor: new FormControl("", Validators.required),
      tipo: new FormControl("Texto", Validators.required),
    });
  }

  obtenerCatalogos() {
    this.isCargando = true;
    this.catalogosService.obtenerCatalogos(0).subscribe(
      (catalogos: any) => {
        this.isCargando = false;
        this.catalogos = catalogos;
      },
      (error) => {
        this.isCargando = false;
        this.catalogos = [];
      }
    );
  }

  verSubCatalogos(catalogo) {
    this.subCatalogos = [];
    this.catalogo = catalogo;
    this.catalogosService.obtenerCatalogos(catalogo._id).subscribe(
      (subCatalogos: any) => {
        this.subCatalogos = subCatalogos;
      },
      (error) => {
        this.subCatalogos = [];
      }
    );
  }

  crearCatalogo() {
    this.catalogoForm.controls['valor'].setValue("Ninguna");
    if (this.catalogoForm.valid) {
      this.catalogosService.crearCatalogo(this.catalogoForm.value).subscribe(
        (catalogo: any) => {
          this.catalogos = [];
          this.formCatalogo();
          this.obtenerCatalogos();
        },
        (error) => {
          this.alertError("Ocurrio un error al ingresar los datos");
        }
      );
    }else{
      this.alertError("Completar todos los campos");
    }
  }

  editarCatalogo() {
    this.catalogoForm.controls['valor'].setValue("Ninguna");
    if (this.catalogoForm.valid) {
      this.catalogosService.editarCatalogo(this.idCatalogo,this.catalogoForm.value).subscribe(
        (catalogo: any) => {
          this.catalogos = [];
          this.catalogo = null;
          this.formCatalogo();
          this.obtenerCatalogos();
        },
        (error) => {
          this.alertError("Ocurrio un error al ingresar los datos");
        }
      );
    }else{
      this.alertError("Completar todos los campos");
    }
  }

  verCatalogo(catalogo) {
    this.idCatalogo = catalogo._id;
    this.catalogoForm.controls['idPadre'].setValue("0");
    this.catalogoForm.controls['nombre'].setValue(catalogo.nombre);
    //this.catalogoForm.controls['valor'].setValue(catalogo.valor);
    this.catalogoForm.controls['tipo'].setValue(catalogo.tipo);

  }

  eliminarCatalogo(id,tipo) {
    this.catalogosService.eliminarCatalogo(id).subscribe(
      (catalogo: any) => {
        if(tipo == 1){
          this.catalogos = [];
          this.obtenerCatalogos();
        }else{
          this.verSubCatalogos(this.catalogo);
        }
      
      },
      (error) => {
        this.alertError("Ocurrio un error al eliminar el registro");
      }
    );
  }

  alertError(message) {
    Swal.fire(message, "", "error");
  }


  crearSubCatalogo() {
    this.catalogoForm.value.idPadre = this.catalogo._id;
    this.catalogoForm.value.tipo = this.catalogo.tipo;
    if (this.catalogoForm.valid) {
      this.catalogosService.crearCatalogo(this.catalogoForm.value).subscribe(
        (catalogo: any) => {
          this.formCatalogo();
          this.verSubCatalogos(this.catalogo);
        },
        (error) => {
          this.alertError("Ocurrio un error al ingresar los datos");
        }
      );
    }
  }


  subirImagen(event){
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        this.catalogoForm.value.valor = reader.result;
    };
  }
}
