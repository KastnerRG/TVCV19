import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToolbarService } from 'src/app/toolbar.service';

@Component({
  selector: 'lib-patient-feed',
  templateUrl: './patient-feed.component.html',
  styleUrls: ['./patient-feed.component.scss']
})
export class PatientFeedComponent implements OnInit {
  room: string;

  constructor(route: ActivatedRoute, private toolbar: ToolbarService) {
    route.params.subscribe((p) => {
      this.room = p['id'];
    });
  }

  showMenu: boolean = false;
  toggleMenu(){
    this.showMenu = !this.showMenu;
  }

  ngOnInit(): void {
    this.toolbar.hide();
  }

}
