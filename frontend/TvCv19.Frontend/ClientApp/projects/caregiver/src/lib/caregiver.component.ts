import {
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToolbarService } from 'src/app/toolbar.service';
import {
  PhysicianModel,
  PhysicianService,
} from 'projects/shared/src/public-api';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'lib-caregiver',
  templateUrl: './caregiver.component.html',
  styleUrls: ['./caregiver.component.scss'],
})
export class CaregiverComponent implements OnInit {
  physician: PhysicianModel;
  showQR: boolean;
  showMenu: boolean;
  @ViewChild('drawer') drawer: MatSidenav;
  constructor(
    route: ActivatedRoute,
    toolbarService: ToolbarService,
    physicianService: PhysicianService
  ) {
    route.params.subscribe((s) => {
      physicianService.getPhysician(s['id']).subscribe((p) => {
        this.physician = p;
      });
    });
    toolbarService.menuClick.subscribe((e) => {
      this.showMenu = e.isOpen;
      this.drawer.toggle();
    });
  }

  toggleQr() {
    console.log('clicked');
    this.showQR = !this.showQR;
  }

  ngOnInit(): void {}
}
