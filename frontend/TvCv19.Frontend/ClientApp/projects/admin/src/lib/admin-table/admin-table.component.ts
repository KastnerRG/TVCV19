import { Component, ViewChild, OnInit } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import { PhysicianService, PhysicianModel, Roles } from 'projects/shared/src/public-api';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'lib-admin-table',
  templateUrl: './admin-table.component.html',
  styleUrls: ['./admin-table.component.scss']
})

export class AdminTableComponent implements OnInit {
  displayedColumns = ['name', 'location', 'id', 'role', 'emulate', 'delete'];
  dataSource: MatTableDataSource<PhysicianModel>;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  physicians: PhysicianModel[];
  Roles = Roles; //this line is needed for the physician.hierarchy to be displayed as text instead of numbers

  constructor(private physicianService: PhysicianService) {
    physicianService.getPhysicians()
      .subscribe(p => {
        this.dataSource = new MatTableDataSource(p)
        this.dataSource.paginator = this.paginator;
      });
  }
  
  // delete a physician and refresh the table
  deletePhysicianRow(id: string) {
    this.physicianService.deletePhysician(id).subscribe(p => {
      this.refresh()
    },
      error => console.error(error));
  }

  ngOnInit() {
  }
  
  // method for the search bar copied from filter mat-table
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // makes a new call to getPhysicians() and makes that array the new datasource
  refresh() {
    this.physicianService.getPhysicians().subscribe(p => {
      this.dataSource = new MatTableDataSource(p)
      this.dataSource.paginator = this.paginator;
    });
  }

}

