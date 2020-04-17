import { NgModule } from '@angular/core';
import { BedsideComponent } from './bedside.component';
import { RootComponent } from './root/root.component';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { PhysicianHeirachyComponent, PhysicianRouteResolverService } from 'projects/shared/src/public-api';
import { BedsideRootComponent } from './bedside-root/bedside-root.component';



@NgModule({
  declarations: [BedsideComponent, RootComponent, BedsideRootComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: RootComponent },
      { path: ':id', component: BedsideRootComponent, children: [
        { path: '',
            component: PhysicianHeirachyComponent,
            resolve: {
              model: PhysicianRouteResolverService
            }
        },
      ]}
    ]),
    MatListModule,
    MatButtonModule
  ],
  exports: [BedsideComponent]
})
export class BedsideModule { }
