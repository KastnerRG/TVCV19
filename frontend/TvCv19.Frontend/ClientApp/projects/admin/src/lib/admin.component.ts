import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'lib-admin',
  template: `
    <router-outlet></router-outlet>
  `,
  styles: [
  ],
})
export class AdminComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
