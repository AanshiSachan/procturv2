import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddEditComponent } from './add-edit/add-edit.component';
import { ListComponent } from './list/list.component';
import { RoutineComponent } from './routine.component';


const routes: Routes = [
  {
    path: '',
    component: RoutineComponent,
    pathMatch: 'prefix',
    children: [
      {
        path: 'list',
        component: ListComponent
      },
      {
        path: 'create',
        component: AddEditComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoutineRoutingModule { }
