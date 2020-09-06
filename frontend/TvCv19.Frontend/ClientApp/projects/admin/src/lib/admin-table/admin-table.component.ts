import { Component, ViewChild, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {
  PhysicianService,
  PhysicianModel,
  Roles,
  PatientService,
  UserType,
} from 'projects/shared/src/public-api';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'admin-table',
  templateUrl: './admin-table.component.html',
  styleUrls: ['./admin-table.component.scss'],
})
export class AdminTableComponent implements OnInit {
  displayedColumns = ['name', 'location', 'id', 'role', 'username', 'delete'];
  dataSource: MatTableDataSource<AdminTableData>;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  physicians: PhysicianModel[];

  constructor(
    private physicianService: PhysicianService,
    private patientService: PatientService
  ) {
    this.setData();
  }

  delete(id: string, type: UserType) {
    if (type == UserType.Caregiver) {
      this.deletePhysician(id);
    }

    if (type == UserType.Patient) {
      this.deletePatient(id);
    }
  }

  ngOnInit() {}


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  private setData(): void {
    this.physicianService.getPhysicians().subscribe((physicians) => {
      let caregiverData = physicians.map((p) => {
        return {
          name: p.name,
          id: p.id,
          role: Roles[p.hierarchy],
          location: p.location,
          username: p.username,
          type: UserType.Caregiver,
        };
      });
      this.patientService.getPatients().subscribe((patients) => {
        let patientData = patients.map((p) => {
          return {
            name: p.name,
            id: p.id,
            role: Roles[Roles.Patient],
            location: p.location,
            username: p.username,
            type: UserType.Patient,
          };
        });
        this.dataSource = new MatTableDataSource(caregiverData.concat(patientData));
        this.dataSource.paginator = this.paginator;
      });
    });
  }

  private deletePhysician(id: string) {
    this.physicianService.deletePhysician(id).subscribe((p) => {
      this.setData();
    });
  }

  private deletePatient(id: string) {
    this.patientService.dischargePatient(id).subscribe((p) => {
      this.setData();
    });
  }
}

export interface AdminTableData {
  name: string;
  id: string;
  role: string;
  location: string;
  username: string;
  type: UserType;
}
