import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface EscalationData {
  message: string;
  isEscalation: boolean;
  title: string;
  placeholder: string;
}

@Component({
  selector: 'app-escalate-patient',
  templateUrl: './escalate-patient.dialog.html',
  styleUrls: ['./escalate-patient.dialog.scss'],
})
export class EscalatePatientDialog {
  constructor(
    public dialogRef: MatDialogRef<EscalatePatientDialog>,
    @Inject(MAT_DIALOG_DATA) public data: EscalationData
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
