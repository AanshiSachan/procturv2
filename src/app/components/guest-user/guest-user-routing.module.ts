import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GuestUserComponent } from './guest-user.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes =[
  {
      path: '',
      component: GuestUserComponent,
      pathMatch: 'prefix',
      children: [
        {
            path: 'register',
            component: RegisterComponent,
            pathMatch: 'prefix',
        }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GuestUserRoutingModule { }
