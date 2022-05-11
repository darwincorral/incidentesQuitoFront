import { Component, OnInit } from '@angular/core';

declare function init_pluginsAMT();

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styles: []
})
export class TemplateComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    init_pluginsAMT();
  }

}
