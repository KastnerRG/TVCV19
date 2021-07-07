import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthorizationService, PhysicianService } from 'projects/shared/src/public-api';

@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss']
})
export class RootComponent implements OnInit {

  constructor(private router: Router, private physicianService: PhysicianService, private authService: AuthorizationService) { }

  ngOnInit(): void {
    const roles = this.authService.getRoles();
    if (roles.has("physician")) {
      this.physicianService.getCurrentPhysician().subscribe(physician => this.router.navigateByUrl(`/caregiver/${physician.id}/patients`));
    }
  }

}
