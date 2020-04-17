import { NgModule } from '@angular/core';
import { BedsideComponent } from './bedside.component';
import { RootComponent } from './root/root.component';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';



@NgModule({
  declarations: [BedsideComponent, RootComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: RootComponent }
    ]),
    MatListModule,
    MatButtonModule
  ],
  exports: [BedsideComponent]
})
export class BedsideModule { }
