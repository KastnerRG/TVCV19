import { NgModule } from '@angular/core';
import { SharedCaregiverComponent } from './shared-caregiver.component';
import { ChangeShiftComponent } from './change-shift/change-shift.component';
import { LiveVideoComponent } from './live-video/live-video.component';
import { PatientDetailComponent } from './patient-detail/patient-detail.component';
import { PatientListComponent } from './patient-list/patient-list.component';
import { PhysicianHeirachyComponent } from './physician-heirachy/physician-heirachy.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { SharedModule } from 'projects/shared/src/public-api';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatToolbarModule } from '@angular/material/toolbar';
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
import { HttpClientModule } from '@angular/common/http';
import { PhysicianMessagingChecklistComponent } from './physician-messaging-checklist/physician-messaging-checklist.component';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
  declarations: [
    SharedCaregiverComponent,
    ChangeShiftComponent,
    LiveVideoComponent,
    PatientDetailComponent,
    PatientListComponent,
    PhysicianHeirachyComponent,
    ChatComponent,
    PatientStatsDialog,
    PhysicianMessagingChecklistComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    FlexModule,
    MatAutocompleteModule,
    MatIconModule,
    MatGridListModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatDialogModule,
    MatListModule,
    MatCheckboxModule,
    QRCodeModule,
    SharedModule,
    HttpClientModule,
  ],
  exports: [SharedCaregiverComponent],
})
export class SharedCaregiverModule {}
