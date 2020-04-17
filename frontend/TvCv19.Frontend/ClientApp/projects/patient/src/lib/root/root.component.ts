import { Component, OnInit } from '@angular/core';
import { PatientService } from 'projects/shared/src/public-api';

@Component({
  selector: 'lib-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss']
})
export class RootComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
