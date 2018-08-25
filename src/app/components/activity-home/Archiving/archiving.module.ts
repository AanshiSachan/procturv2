import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { BsDatepickerModule } from "ngx-bootstrap-custome";
import { SharedModule } from "../../shared/shared.module";
import { NgModule } from "@angular/core";
import { ArchivingRoutingModule } from "./archiving-routing.module";
import { ArchivingComponent } from "./archiving.component";
import { BatchesComponent } from './batches/batches.component';
import { ArchivingHomeComponent } from './archiving-home/archiving-home.component';
import { RouterModule } from "@angular/router";
import { BatchesArchivedReportComponent } from './batches-archived-report/batches-archived-report.component';
import { StudentsComponent } from './students/students.component';
import { StudentsArchivedReportComponent } from './students-archived-report/students-archived-report.component';
import { CoursesServiceService } from "../../../services/archiving-service/courses-service.service";

@NgModule({
    imports: [
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        BsDatepickerModule,
        SharedModule,
        ArchivingRoutingModule
    ],
    declarations: [
        ArchivingComponent,
        BatchesComponent,
        ArchivingHomeComponent,
        BatchesArchivedReportComponent,
        StudentsComponent,
        StudentsArchivedReportComponent,
    ],
    entryComponents:[
        ArchivingComponent,
        BatchesComponent,
        ArchivingHomeComponent,
        BatchesArchivedReportComponent,
        StudentsComponent,
        StudentsArchivedReportComponent
    ],
    providers:[
        CoursesServiceService
    ]
})

export class ArchivingModule{
    
}
    