import { NgModule } from '@angular/core';
import { PatientComponent } from './patient/patient.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [PatientComponent],
  imports: [RouterModule
  ],
  exports: [PatientComponent]
})
export class PatientModule { }
