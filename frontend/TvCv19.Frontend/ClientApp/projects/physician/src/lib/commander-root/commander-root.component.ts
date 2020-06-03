import { Component, OnInit } from '@angular/core';
import { PhysicianService, HierarchyLevel, PhysicianModel } from 'projects/shared/src/public-api';
import { map } from 'rxjs/operators';
@Component({
  selector: 'lib-commander-root',
  templateUrl: './commander-root.component.html',
  styleUrls: ['./commander-root.component.scss']
})
export class CommanderRootComponent implements OnInit {
  physicians: PhysicianModel[];
  constructor(physicianService: PhysicianService) { 
    physicianService.getPhysicians()
    .pipe(map(models => models.filter(p => p.hierarchy == HierarchyLevel.Commander)))
    .subscribe(p => this.physicians = p);
  }

  ngOnInit(): void {
  }

}


