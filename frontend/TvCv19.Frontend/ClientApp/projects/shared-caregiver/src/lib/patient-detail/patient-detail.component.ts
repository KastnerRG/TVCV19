import { Component, OnInit } from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import { ToolbarService } from 'src/app/toolbar.service';

@Component({
  selector: 'lib-patient-detail',
  templateUrl: './patient-detail.component.html',
  styleUrls: ['./patient-detail.component.scss'],
})
export class PatientDetailComponent implements OnInit {
  room: any;
  id: string;
  show: boolean =true;

  constructor(route: ActivatedRoute, toolbarService: ToolbarService) {
    route.parent.parent.params.subscribe(p => {
      this.id = p.id;
    })
    
    route.params.subscribe((p) => {
      this.room = p['id'];
    });

    toolbarService.menuClick.subscribe(m => {
      this.show = !m.isOpen;
    })

  }

  ngOnInit(): void {}
}
