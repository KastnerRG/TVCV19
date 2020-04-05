import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'lib-patient-navigation',
  templateUrl: './patient-navigation.component.html',
  styleUrls: ['./patient-navigation.component.scss']
})
export class PatientNavigationComponent {
  patientName: string = "<test patient>";
  patientID: number;
  physicianID: number;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver,
              route: ActivatedRoute) {
    route.params.subscribe(p => {
      this.patientID = p['patient-id'];
    });

    route.parent.params.subscribe(p => {
      this.physicianID = p['physician-id'];
    });
  }

}
