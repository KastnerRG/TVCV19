import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface StatsData {
  pr: string;
  tv: string;
  pp: string;
  ie: string;
  mp: string;
  o2: string;
}

@Component({
  selector: 'lib-patient-stats',
  templateUrl: './patient-stats.dialog.html',
  styleUrls: ['./patient-stats.dialog.scss'],
})
export class PatientStatsDialog {
  constructor(
    public dialogRef: MatDialogRef<PatientStatsDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { stats: StatsData }
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
