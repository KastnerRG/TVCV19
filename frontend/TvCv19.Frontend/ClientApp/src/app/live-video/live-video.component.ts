import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-live-video',
  templateUrl: './live-video.component.html',
  styleUrls: ['./live-video.component.scss']
})
export class LiveVideoComponent implements OnInit {
  public id: number;

  constructor(route: ActivatedRoute) {
    this.id = route['id'];
  }

  ngOnInit(): void {
  }

}
