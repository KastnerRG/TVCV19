import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-camera-setup',
  templateUrl: './camera-setup.component.html',
  styleUrls: ['./camera-setup.component.scss']
})
export class CameraSetupComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  next(): void {
    this.router.navigateByUrl('/')
  }

}
