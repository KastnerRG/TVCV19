import { Component, OnInit } from '@angular/core';
import { PhysicianService, HierarchyLevel, PhysicianModel } from 'projects/shared/src/public-api';
import { map } from 'rxjs/operators';

@Component({
  selector: 'lib-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss']
})
export class RootComponent implements OnInit {
  bedsideCaregivers: PhysicianModel[];

  constructor(physicianService: PhysicianService) {
    physicianService.getPhysicians()
      .pipe(map(models => models.filter(p => p.hierarchy === HierarchyLevel.FirstLine)))
      .subscribe(p => this.bedsideCaregivers = p);
  }

  ngOnInit(): void {
  }

}
