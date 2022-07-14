import { Component, OnInit } from "@angular/core";
import { IncidentesService } from "src/app/services/service.index";
import * as XLSX from "xlsx";

@Component({
  selector: "app-reportes",
  templateUrl: "./reportes.component.html",
  styleUrls: ["./reportes.component.css"],
})
export class ReportesComponent implements OnInit {
  incidentes = [];
  isCargando: boolean = false;
  filterTerm: string = "";
  constructor(private incidentesService: IncidentesService) {}

  ngOnInit() {
    this.obtenerIncidentes();
  }

  obtenerIncidentes() {
    this.incidentes = [];
    this.isCargando = true;
    this.incidentesService.obtenerAllIncidentes().subscribe(
      (incidentes: any) => {
        this.isCargando = false;
        this.incidentes = incidentes;
      },
      (error) => {
        this.isCargando = false;
        this.incidentes = [];
      }
    );
  }

  descargarInfo() {
    const data = this.incidentes.map((c) => ({
      Estado: c.estado,
      Identificacion: c.persona.identificacion,
      Nombres: c.persona.nombres +' '+c.persona.apellidos,
      'Agente Asignado': c.idAgente,
      Operador: c.operador,
     'Tipo de Incidente': c.tipoIncidente.nombre,
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Reporte");
    /* save to file */
    XLSX.writeFile(wb, "Reporte.xlsx");
  }
}
