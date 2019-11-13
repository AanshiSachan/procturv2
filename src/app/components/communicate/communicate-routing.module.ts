import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommunicateComponent } from '.';

const routes: Routes = [
  {
  path:'',
  component:CommunicateComponent
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommunicateRoutingModule { }
