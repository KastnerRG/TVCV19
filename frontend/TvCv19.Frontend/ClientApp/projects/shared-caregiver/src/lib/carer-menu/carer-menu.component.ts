import { Component, OnInit } from '@angular/core';
import { ToolbarService } from 'src/app/toolbar.service';
import { ActivatedRoute } from '@angular/router';
import {
  PhysicianModel,
  CaregiverRouteDataModel,
} from 'projects/shared/src/public-api';

@Component({
  selector: 'lib-carer-menu',
  templateUrl: './carer-menu.component.html',
  styleUrls: ['./carer-menu.component.scss'],
})
export class CarerMenuComponent implements OnInit {
  physician: PhysicianModel;
  showQR: boolean;

  constructor(private toolbar: ToolbarService, private route: ActivatedRoute) {
    toolbar.setToolbarData({ menu: [], title: 'TV CV19', back: false });
  }

  ngOnInit(): void {
    this.route.data.subscribe(
      async (data: { model: CaregiverRouteDataModel }) => {
        this.physician = data.model.physician;
      }
    );
  }
  toggleQr() {
    this.showQR = !this.showQR;
  }
}
