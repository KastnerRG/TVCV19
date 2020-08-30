import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RootComponent } from './root/root.component';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { HttpClientModule } from '@angular/common/http';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AppToolbarComponent } from './app-toolbar/app-toolbar.component';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { EscalatePatientDialog } from './escalate-patient/escalate-patient.dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material/core";
import {MomentModule} from "ngx-moment";
import {MomentDateAdapter} from '@angular/material-moment-adapter';

export const ISO_FORMAT = {
  parse: {
      dateInput: 'YYYY-MM-DD',
  },
  display: {
      dateInput: 'L',
      monthYearLabel: 'YYYY',
      dateA11yLabel: 'LL',
      monthYearA11yLabel: 'YYYY',
  },
};

@NgModule({
  declarations: [
    AppComponent,
    RootComponent,
    AppToolbarComponent,
    EscalatePatientDialog
  ],
  imports: [
    BrowserModule,
    CommonModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    MatListModule,
    MatButtonModule,
    MatToolbarModule,
    MatInputModule,
    FormsModule,
    MatDialogModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MomentModule
  ],
  providers: [{provide: DateAdapter, useClass: MomentDateAdapter},
  {provide: MAT_DATE_FORMATS, useValue: ISO_FORMAT}],
  bootstrap: [AppComponent]
})
export class AppModule { }
