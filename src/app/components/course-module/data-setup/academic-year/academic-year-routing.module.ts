import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { AcademicYearComponent } from './academic-year.component';
import { HomeComponent } from './home/home.component';

@NgModule({
    imports: [
      RouterModule.forChild([
          {
              path: '',
              component: AcademicYearComponent,
              pathMatch: 'prefix',
              children: [
                  {
                      path: '',
                      component: HomeComponent
                  },
                  {
                      path: 'list',
                      component: HomeComponent,
                      pathMatch: 'prefix',
                  },
              ]
          }
      ])
  ],
  exports: [
      RouterModule
  ],
  providers: [
  ],
  declarations: [
  ]
})


export class AcademicYearRoutingModule {

}
