import {
    Component, OnInit, OnChanges, Output, Input, ViewChild, ElementRef,
    HostListener, EventEmitter, ChangeDetectorRef, Renderer2, ChangeDetectionStrategy
} from '@angular/core';
import * as moment from 'moment';
import { AppComponent } from '../../../app.component';
import { AddStudentPrefillService } from '../../../services/student-services/add-student-prefill.service';
import { Observable } from 'rxjs/Observable'
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/debounceTime';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { templateJitUrl } from '@angular/compiler';

@Component({
    selector: 'student-batch-list',
    templateUrl: './student-batch-list.component.html',
    styleUrls: ['./student-batch-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StudentBatchListComponent implements OnInit, OnChanges {

    isProfessional: boolean = false;
    @Input() dataList: any[] = [];
    @Input() academicYear: any[] = [];
    @Input() assignedBatches: any;
    @Input() isEdit: boolean = false;
    @Input() standardList: any[] = [];
    @Input() defaultAcadYear: any;


    @Output() assignList = new EventEmitter<any>();
    @Output() closeBatch = new EventEmitter<boolean>();

    batchList: any[] = [];
    model: string;
    modelChanged: Subject<string> = new Subject<string>();
    currentStd: string = '-1';

    constructor(private rd: Renderer2, private cd: ChangeDetectorRef, private eRef: ElementRef, private appC: AppComponent, private studentPrefillService: AddStudentPrefillService, private auth: AuthenticatorService) {
        this.auth.institute_type.subscribe(
            res => {
                if (res == 'LANG') {
                    this.isProfessional = true;
                } else {
                    this.isProfessional = false;
                }
            }
        )
    }

    ngOnInit() {
        this.cd.markForCheck();
        this.modelChanged
            .debounceTime(1000)
            .distinctUntilChanged()
            .subscribe(model => {
                this.model = model;
                this.cd.markForCheck();
                this.filter(model);
            })
    }

    ngOnChanges() {
        this.batchList = this.dataList.map( e => {return e} );
        this.isEdit;
    }

    closeBatchAssign() {
        this.closeBatch.emit(false);
    }

    assignBatch() {
        let batchString: any[] = [];
        let assignedBatches: any[] = [];
        let batchJoiningDates: any[] = [];
        let assignedBatchescademicYearArray: any[] = [];
        let assignedCourse_Subject_FeeTemplateArray: any[] = [];
        for (let i in this.dataList) {
            if (this.dataList[i].isSelected) {
                if (this.dataList[i].assignDate != "" && this.dataList[i].assignDate != null && this.dataList[i].assignDate != "Invalid date") {
                    if (this.isProfessional) {
                        assignedBatches.push(this.dataList[i].data.batch_id.toString());
                        batchJoiningDates.push(moment(this.dataList[i].assignDate).format('YYYY-MM-DD'));
                        assignedBatchescademicYearArray.push(this.dataList[i].data.academic_year_id);
                        assignedCourse_Subject_FeeTemplateArray.push(this.dataList[i].data.selected_fee_template_id);
                        batchString.push(this.dataList[i].data.batch_name);
                    }
                    else {
                        assignedBatches.push(this.dataList[i].data.course_id.toString());
                        batchJoiningDates.push(moment(this.dataList[i].assignDate).format('YYYY-MM-DD'));
                        assignedBatchescademicYearArray.push(this.dataList[i].data.academic_year_id);
                        assignedCourse_Subject_FeeTemplateArray.push(this.dataList[i].data.selected_fee_template_id);
                        batchString.push(this.dataList[i].data.course_name);
                    }
                }
                else {
                    let alert = {
                        type: 'error',
                        title: 'Assign Date Required',
                        body: 'Please select a joining date for selected option'
                    }
                    this.appC.popToast(alert);
                }
            }
        }

        if (batchString.length != 0) {
            let obj = {
                batchString: batchString,
                assignedBatches: assignedBatches,
                batchJoiningDates: batchJoiningDates,
                assignedBatchescademicYearArray: assignedBatchescademicYearArray,
                assignedCourse_Subject_FeeTemplateArray: assignedCourse_Subject_FeeTemplateArray,
                assignedBatchString: batchString.join(','),
                isAssignBatch: false,
            }
            this.assignList.emit(obj);
        }
        else {
            let obj = {
                batchString: batchString,
                assignedBatches: assignedBatches,
                batchJoiningDates: batchJoiningDates,
                assignedBatchescademicYearArray: assignedBatchescademicYearArray,
                assignedCourse_Subject_FeeTemplateArray: assignedCourse_Subject_FeeTemplateArray,
                assignedBatchString: batchString.join(','),
                isAssignBatch: false,
            }
            this.assignList.emit(obj);
        }
    }

    batchChangeAlert(value, batch) {
        for (let i = 0; i < this.dataList.length; i++) {
            if (!this.isProfessional) {
                if (this.dataList[i].data.course_id == batch.data.course_id) {
                    //finding index on dataList
                    this.createUpdate(value, i);
                }
            }
        }
    }

    createUpdate(value, index) {
        if (this.isEdit) {
            let ind = null;
            let len = this.dataList.length;
            if (value) {
                this.dataList[index].isSelected = value;
            }
            /* unchecked batch/course */
            else {
                if (this.assignedBatches != null) {
                    /* Check if selected ID exist on selected array list */
                    this.assignedBatches.forEach(e => {
                        if (this.isProfessional) {
                            if (this.dataList[index].data.batch_id == e) {
                                ind = e;
                            }
                        }
                        else {
                            if (this.dataList[index].data.course_id == e) {
                                ind = e;
                            }
                        }
                    });

                    /* if index is not null */
                    if (ind != null) {
                        if (confirm("If you unassign the student from course then corresponding fee instalments will be deleted.")) {
                            this.dataList[index].isSelected = false;
                        }
                        else {
                            this.dataList[index].isSelected = true;
                            //document.getElementById('batchcheck' + index).checked = true;
                        }
                    }
                    /* else */
                    else if (ind == null) {
                        this.dataList[index].isSelected = false;
                    }
                }
                else {
                    this.dataList[index].isSelected = false;
                }
            }
        }
    }

    changed(text: string) {
        this.modelChanged.next(text);
        this.cd.markForCheck();
    }

    filter(e: string) {
        this.cd.markForCheck();
        if (e.trim() != '') {
            let temp: any[] = [];
            if (!this.isProfessional) {
                this.dataList.map(el => {
                    if (el.data.master_course.toString().toLowerCase().indexOf(e) > -1 || el.data.course_name.toString().toLowerCase().indexOf(e) > -1) {
                        temp.push(el);
                    }
                });
            }
            else {
                this.dataList.map(el => {
                    if (el.data.batch_name.toString().toLowerCase().indexOf(e) > -1) {
                        temp.push(el);
                    }
                });
            }
            this.cd.markForCheck();
            this.batchList = temp;
            this.cd.markForCheck();
        }
        else {
            this.cd.markForCheck();
            this.batchList = this.dataList;
            this.cd.markForCheck();
        }
    }

    fetchDataCustom(id) {
        if (id == '-1') {
            this.batchList = this.dataList;
        }
        else {
            this.cd.markForCheck();
            this.cd.detectChanges();
            this.getResult(id);
        }
    }

    getResult(id) {
        let temp: any[] = [];
        this.batchList = [];
        if (!this.isProfessional) {
            this.studentPrefillService.fetchCourseMasterById(id).subscribe(
                (data: any) => {
                    this.cd.markForCheck();
                    this.cd.detectChanges();
                    
                    if (data.coursesList != null && data.coursesList.length != 0) {
                        data.coursesList.forEach(el => {
                            if (el.feeTemplateList != null && el.feeTemplateList.length != 0 && el.selected_fee_template_id == -1) {
                                el.feeTemplateList.forEach(e => {
                                    if (e.is_default == 1) {
                                        el.selected_fee_template_id = e.template_id;
                                    }
                                })
                            }
                            if (el.academic_year_id == '-1') {
                                el.academic_year_id = this.defaultAcadYear;
                            }
                            let obj = {
                                isSelected: this.getChecked(el),
                                data: el,
                                assignDate: moment().format('YYYY-MM-DD')
                            }
                            temp.push(obj);
                        });
                        this.cd.markForCheck();
                        this.cd.detectChanges();
                        this.batchList = temp;
                        this.cd.markForCheck();
                        this.cd.detectChanges();
                    }
                },
                err => {
                    this.cd.markForCheck();
                    this.cd.detectChanges();
                    this.batchList = temp;
                    let al = {
                        type: 'error',
                        title: err.error.message,
                        body: ''
                    }
                    this.appC.popToast(al);
                    this.cd.markForCheck();
                    this.cd.detectChanges();
                }
            );
        }
        else {
            this.studentPrefillService.fetchBatchDetails().subscribe(
                data => {
                    data.forEach(el => {
                        if (el.feeTemplateList != null && el.feeTemplateList.length != 0 && el.selected_fee_template_id == -1) {
                            el.feeTemplateList.forEach(e => {
                                if (e.is_default == 1) {
                                    el.selected_fee_template_id = e.template_id;
                                }
                            })
                        }
                        if (el.academic_year_id == '-1') {
                            el.academic_year_id = this.defaultAcadYear;
                        }
                        let obj = {
                            isSelected: false,
                            data: el,
                            assignDate: moment().format('YYYY-MM-DD')
                        }
                        temp.push(obj);
                    });
                    this.cd.markForCheck();
                    this.cd.detectChanges();
                    this.batchList = temp;
                    this.cd.markForCheck();
                    this.cd.detectChanges();
                },
                err => {
                    this.cd.markForCheck();
                    this.cd.detectChanges();
                    this.batchList = temp;
                    let al = {
                        type: 'error',
                        title: err.error.message,
                        body: ''
                    }
                    this.appC.popToast(al);
                    this.cd.markForCheck();
                    this.cd.detectChanges();
                }
            );
        }
    }

    getChecked(el): boolean{
        console.log(el);
        let temp: boolean = false;
        this.dataList.forEach( e => {
            if(e.data.course_id == el.course_id){
                temp = e.isSelected;                
            }            
        })
        return temp;
    }

}