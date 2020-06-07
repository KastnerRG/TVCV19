import { Component, OnInit } from '@angular/core';
import { ActivatedRoute} from '@angular/router';

@Component({
  selector: 'lib-patient-detail',
  templateUrl: './patient-detail.component.html',
  styleUrls: ['./patient-detail.component.scss'],
})
export class PatientDetailComponent implements OnInit {
  room: any;
  id: string;

  constructor(route: ActivatedRoute) {
    route.parent.parent.params.subscribe(p => {
      this.id = p.id;
    })
    
    route.params.subscribe((p) => {
      this.room = p['id'];
    });

  }

  ngOnInit(): void {}
}
