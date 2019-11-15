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
import { CoursesServiceService } from "../../../services/archiving-service/courses-service.service";
import { CoursesComponent } from './courses/courses.component';
import { CoursesArchivedReportComponent } from './courses-archived-report/courses-archived-report.component';

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
        CoursesComponent,
        CoursesArchivedReportComponent,
    ],
    entryComponents:[
        ArchivingComponent,
        BatchesComponent,
        ArchivingHomeComponent,
        BatchesArchivedReportComponent,
    ],
    providers:[
        CoursesServiceService
    ]
})

export class ArchivingModule{
    
}
    