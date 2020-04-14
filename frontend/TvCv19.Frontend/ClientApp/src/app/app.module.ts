import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PhysicianAdminComponent } from './admin/physician-admin.component';
import { SharedModule } from './shared/shared.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PhysicianMessagingChecklistComponent } from './physician-messaging-checklist/physician-messaging-checklist.component';

@NgModule({
  declarations: [AppComponent, PhysicianAdminComponent, PhysicianMessagingChecklistComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
