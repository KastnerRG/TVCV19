import { Component, OnInit } from '@angular/core';
import { ToolbarService, ToolBarData } from '../toolbar.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-toolbar',
  templateUrl: './app-toolbar.component.html',
  styleUrls: ['./app-toolbar.component.scss'],
})
export class AppToolbarComponent implements OnInit {
  data: ToolBarData;
  constructor(private toolbarService: ToolbarService, private location: Location) {
    this.toolbarService.toolBarData.subscribe((d) => (this.data = d));
  }

  back() {
    this.location.back();
  }

  ngOnInit(): void {
    
  }
}
