import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-camera-setup',
  templateUrl: './camera-setup.component.html',
  styleUrls: ['./camera-setup.component.scss']
})
export class CameraSetupComponent {
  patientId: string;
  constructor(route: ActivatedRoute, private router: Router) {
    route.params.subscribe((p) => {
      this.patientId = p['id'];
    });

  }
}
