import { Component, ViewChild, OnInit } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import { PatientService, PatientModel } from 'projects/shared/src/public-api';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'lib-patient-table',
  templateUrl: './patient-table.component.html',
  styleUrls: ['./patient-table.component.scss']
})
export class PatientTableComponent implements OnInit {
  displayedColumns = ['name', 'location', 'id', 'role', 'emulate', 'delete'];
  dataSource: MatTableDataSource<PatientModel>;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  patients: PatientModel[];

  constructor(private patientService: PatientService) { 
    patientService.getPatients()
      .subscribe(p => {
        this.dataSource = new MatTableDataSource(p)
        this.dataSource.paginator = this.paginator;
      });
  }

  ngOnInit(): void {
  }

  // method for the search bar copied from filter mat-table
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  
  // delete a patient and refresh the table
  deletePatientRow(id: string) {
    this.patientService.dischargePatient(id).subscribe(p => {
      this.refresh()
    },
      error => console.error(error));
  }
  

  // makes a new call to getPhysicians() and makes that array the new datasource
  refresh() {
    console.log("refresh called");
    this.patientService.getPatients().subscribe(p => {
      this.dataSource = new MatTableDataSource(p)
      this.dataSource.paginator = this.paginator;
    });
  }

}
