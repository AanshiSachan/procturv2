import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LiveClassesComponent } from './live-classes/live-classes.component';
import { EditClassComponent } from './edit-class/edit-class.component';
import { AddClassComponent } from './add-class/add-class.component';
const routes: Routes = [
  {
    path: '',
    component: LiveClassesComponent
},
{
  path: 'add',
  component: AddClassComponent
},
{
  path: 'edit/:id',
  component: EditClassComponent
}
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LiveClassesRoutingModule { }
