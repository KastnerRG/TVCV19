import { NgModule } from '@angular/core';
import { SharedCaregiverComponent } from './shared-caregiver.component';
import { ChangeShiftComponent } from './change-shift/change-shift.component';
import { LiveVideoComponent } from './live-video/live-video.component';
import { PatientDetailComponent } from './patient-detail/patient-detail.component';
import { PatientListComponent } from './patient-list/patient-list.component';
import { PhysicianHierarchyComponent } from './physician-hierarchy/physician-hierarchy.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { SharedModule } from 'projects/shared/src/public-api';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { QRCodeModule } from 'angularx-qrcode';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { FlexModule } from '@angular/flex-layout';
import { ChatComponent } from './chat/chat.component';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { PatientStatsDialog } from './patient-stats/patient-stats.dialog';
import { MatTreeModule } from '@angular/material/tree';
import { HierarchyComponent } from './physician-hierarchy/hierarchy.component';
import { NursesDoctorsMenuComponent } from './nurses-doctors-menu/nurses-doctors-menu.component';
import { CarerMenuComponent } from './carer-menu/carer-menu.component';
import { MatListModule } from '@angular/material/list';

@NgModule({
  declarations: [
    SharedCaregiverComponent,
    ChangeShiftComponent,
    LiveVideoComponent,
    PatientDetailComponent,
    PatientListComponent,
    PhysicianHierarchyComponent,
    ChatComponent,
    PatientStatsDialog,
    HierarchyComponent,
    NursesDoctorsMenuComponent,
    CarerMenuComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    FlexModule,
    MatAutocompleteModule,
    MatIconModule,
    MatTreeModule,
    MatGridListModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatDialogModule,
    QRCodeModule,
    SharedModule,
    MatChipsModule,
    MatListModule
  ],
  exports: [SharedCaregiverComponent],
})
export class SharedCaregiverModule {}
