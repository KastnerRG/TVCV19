import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToolbarService } from 'src/app/toolbar.service';

@Component({
  selector: 'app-camera-setup',
  templateUrl: './camera-setup.component.html',
  styleUrls: ['./camera-setup.component.scss']
})
export class CameraSetupComponent implements OnInit {
  patientId: string;
  constructor(route: ActivatedRoute, private toolbarService: ToolbarService, private router: Router) {
    route.params.subscribe((p) => {
      this.patientId = p['id'];
    });

  }
   ngOnInit() {
     this.toolbarService.setToolbarData({menu: []})
   }
}
