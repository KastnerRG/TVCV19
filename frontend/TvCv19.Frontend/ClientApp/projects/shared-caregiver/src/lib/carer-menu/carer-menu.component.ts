import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  PhysicianModel,
  PhysicianService,
} from 'projects/shared/src/public-api';
import { ToolbarService } from 'src/app/toolbar.service';

@Component({
  selector: 'lib-carer-menu',
  templateUrl: './carer-menu.component.html',
  styleUrls: ['./carer-menu.component.scss'],
})
export class CarerMenuComponent  {
  physician: PhysicianModel;
  showQR: boolean;

  constructor(route: ActivatedRoute, physicianService: PhysicianService, private toolbarService: ToolbarService) { 
    route.params.subscribe(params => {
      physicianService.getPhysician(params['id']).subscribe(physician => {
        this.physician = physician;
      });
    })
  }
  toggleQr() {
    this.showQR = !this.showQR;
  }
  close() {
     this.toolbarService.onMenuClick();
  }
}
