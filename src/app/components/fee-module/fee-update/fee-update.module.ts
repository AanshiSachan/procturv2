import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeeUpdateRoutingModule } from './fee-update-routing.module';
import { UpdateComponent } from './update/update.component';
import { ViewComponent } from './view/view.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FetchStudentService } from '../../../services/student-services/fetch-student.service';
import { PostStudentDataService } from '../../../services/student-services/post-student-data.service';
import {SharedModule} from '../../shared/shared.module';

@NgModule({
  declarations: [UpdateComponent, ViewComponent],
  imports: [
    CommonModule,
    FeeUpdateRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  providers: [
    FetchStudentService,
    PostStudentDataService
  ]
})
export class FeeUpdateModule { }
