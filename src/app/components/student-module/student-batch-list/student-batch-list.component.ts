import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import * as moment from 'moment';
import 'rxjs/add/operator/debounceTime';
import { Subject } from 'rxjs/Subject';
import { AppComponent } from '../../../app.component';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { CommonServiceFactory } from '../../../services/common-service';

@Component({
    selector: 'student-batch-list',
    templateUrl: './student-batch-list.component.html',
    styleUrls: ['./student-batch-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StudentBatchListComponent implements OnInit, OnChanges {

    isProfessional: boolean = false;
    batchList: any[] = [];
    countryList: any[] = [];
    country_id: any = '-1';
    model: string;
    assignedCount: number = 0;
    modelChanged: Subject<string> = new Subject<string>();
    isShowCountry: boolean = false;
    is_country_disabled: boolean = false;
    batchFilter: any = {
        currentStd: '-1',
        state: '0'
    };
    clonedArray: any = [];
    alertBox: boolean = true;
    delete_unpaid_fee: boolean = false;
    unselected_checkbox_id: number;

    @Input() dataList: any[] = [];
    @Input() academicYear: any[] = [];
    @Input() assignedBatches: any;
    @Input() isEdit: boolean = false;
    @Input() standardList: any[] = [];
    @Input() defaultAcadYear: any;
    @Input() countryId: any;

    @Output() assignList = new EventEmitter<any>();
    @Output() closeBatch = new EventEmitter<boolean>();

    constructor(
        private cd: ChangeDetectorRef,
        private appC: AppComponent,
        private auth: AuthenticatorService,
        private commonService: CommonServiceFactory
    ) {
        this.auth.institute_type.subscribe(
            res => {
                if (res == 'LANG') {
                    this.isProfessional = true;
                } else {
                    this.isProfessional = false;
                }
            }
        );

        this.countryList = JSON.parse(sessionStorage.getItem('country_data'));
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
        this.batchList = [];
        this.is_country_disabled = false;
        this.getSettingsTemplateCountry();
        this.dataList.map(e => {
            e.data.deleteCourse_SubjectUnPaidFeeSchedules = false;
            if (e.isSelected && (!this.is_country_disabled)) {
                this.assginTemplate(e);
            }
            this.batchList.push(e);
        });
        this.clonedArray = this.commonService.keepCloning(this.batchList);
        if (this.defaultAcadYear == null && this.defaultAcadYear == undefined) {
            this.defaultAcadYear = "-1";
        }
        this.getAssignedCount();
    }


    getSettingsTemplateCountry() {
        this.country_id = this.countryId;
        if (sessionStorage.getItem('enable_fee_template_country_wise') == '1') {
            this.isShowCountry = true;
            this.country_id = '-1';
        }
    }

    getFeeTemplateCountryWise(feeTemplateList) {
        let templates = [];
        templates = feeTemplateList.filter((template) => {
            if (this.country_id != '-1') {
                return template.country_id == this.country_id;
            }
            else {
                return template.country_id;
            }
        });
        return templates;
    }

    closeBatchAssign() {
        this.batchList = [];
        this.closeBatch.emit(false);
    }

    assignBatch() {
        let batchString: any[] = [];
        let assignedBatches: any[] = [];
        let batchJoiningDates: any[] = [];
        let assignedBatchescademicYearArray: any[] = [];
        let assignedCourse_Subject_FeeTemplateArray: any[] = [];
        let deleteCourse_SubjectUnPaidFeeSchedules = false;
        for (let i in this.dataList) {
            if (this.dataList[i].isSelected) {
                if (this.dataList[i].assignDate != "" && this.dataList[i].assignDate != null && this.dataList[i].assignDate != "Invalid date") {
                    if (this.isProfessional) {
                        assignedBatches.push(this.dataList[i].data.batch_id.toString());
                        batchJoiningDates.push(moment(this.dataList[i].assignDate).format('YYYY-MM-DD'));
                        assignedCourse_Subject_FeeTemplateArray.push(this.dataList[i].data.selected_fee_template_id.toString());
                        batchString.push(this.dataList[i].data.batch_name);
                        if (this.dataList[i].data.academic_year_id == null || this.dataList[i].data.academic_year_id == undefined) {
                            assignedBatchescademicYearArray.push(this.defaultAcadYear);
                        }
                        else {
                            assignedBatchescademicYearArray.push(this.dataList[i].data.academic_year_id);
                        }
                        if (deleteCourse_SubjectUnPaidFeeSchedules == false) {
                            deleteCourse_SubjectUnPaidFeeSchedules = this.dataList[i].data.deleteCourse_SubjectUnPaidFeeSchedules;
                        }
                    }
                    else {
                        assignedBatches.push(this.dataList[i].data.course_id.toString());
                        batchJoiningDates.push(moment(this.dataList[i].assignDate).format('YYYY-MM-DD'));
                        assignedCourse_Subject_FeeTemplateArray.push(this.dataList[i].data.selected_fee_template_id.toString());
                        batchString.push(this.dataList[i].data.course_name);
                        if (this.dataList[i].data.academic_year_id == null || this.dataList[i].data.academic_year_id == undefined) {
                            assignedBatchescademicYearArray.push(this.defaultAcadYear);
                        }
                        else {
                            assignedBatchescademicYearArray.push(this.dataList[i].data.academic_year_id);
                        }
                        if (deleteCourse_SubjectUnPaidFeeSchedules == false) {
                            deleteCourse_SubjectUnPaidFeeSchedules = this.dataList[i].data.deleteCourse_SubjectUnPaidFeeSchedules;
                        }
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

        if (deleteCourse_SubjectUnPaidFeeSchedules) {

        } else {
            deleteCourse_SubjectUnPaidFeeSchedules = this.checkIfCourseIsUnassigned(this.clonedArray, this.batchList);
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
                deleteCourse_SubjectUnPaidFeeSchedules: deleteCourse_SubjectUnPaidFeeSchedules
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
                deleteCourse_SubjectUnPaidFeeSchedules: deleteCourse_SubjectUnPaidFeeSchedules
            }
            this.assignList.emit(obj);
        }
    }

    batchChangeAlert(value, batch) {
        for (let i = 0; i < this.dataList.length; i++) {
            if (!this.isProfessional) {
                if (this.dataList[i].data.course_id == batch.data.course_id) {
                    //finding index on dataList
                    this.createUpdate(value, i, batch);
                    this.assginTemplate(batch);
                }
            } else {
                if (this.dataList[i].data.batch_id == batch.data.batch_id) {
                    //finding index on dataList
                    this.createUpdate(value, i, batch);
                    this.assginTemplate(batch);
                }
            }
        }
    }

    assginTemplate(batch) {
        batch.data.feeTemplateList.map((template) => {
            if (batch.data.selected_fee_template_id == template.template_id) {
                this.country_id = template.country_id;
                this.is_country_disabled = true;
                this.cd.markForCheck();
            }
        })
    }

    createUpdate(value, index, batch) {
        let ind = null;
        let len = this.dataList.length;
        if (value) {
            this.dataList[index].isSelected = value;
            let todaysDate = new Date();
                if(!(todaysDate <= new Date(this.dataList[index].data.end_date))){
                    let msg = 'This course is already expired';
                    if(this.isProfessional) {
                        msg = 'This batch is already expired';
                    }
                    let obj = {
                        type: 'error',
                        title: msg,
                        body: ""
                      }
                      this.appC.popToast(obj);
                      this.dataList[index].isSelected = false;
                      let ind: any = 0;
                      for (let i = 0; i < this.batchList.length; i++) {
                        if (!this.isProfessional) {
                            if (this.batchList[i].data.course_id == batch.data.course_id) {
                                ind = i;
                            }
                        } else {
                            if (this.batchList[i].data.batch_id == batch.data.batch_id) {
                                ind = i;
                            }
                        }
                    }
                    (document.getElementById('checkbox-' + ind) as HTMLInputElement).checked = false;
                }
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
                    this.alertBox = false;
                    this.unselected_checkbox_id = index;
                    // if (confirm("If you unassign a course from student then corresponding unpaid fee instalments will be deleted. Do you wish to continue?")) {
                    //     this.dataList[index].isSelected = false;
                    //     this.dataList[index].data.deleteCourse_SubjectUnPaidFeeSchedules = true;
                    // }
                    // else {
                    //     this.dataList[index].isSelected = true;
                    //     this.dataList[index].data.deleteCourse_SubjectUnPaidFeeSchedules = true;
                    //     // document.getElementById("batchcheck"+index).checked = true;
                    //
                    //     (document.getElementById("batchcheck"+index) as HTMLInputElement).checked = true;
                    // }

                    // this.batchChangeAlert(this.dataList[index].isSelected, this.dataList[index]);
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
        this.getAssignedCount();
        this.cd.markForCheck();
        this.cd.detectChanges();


    }

    unassign_course() {
        this.alertBox = true;
        this.dataList[this.unselected_checkbox_id].isSelected = false;
        this.dataList[this.unselected_checkbox_id].data.deleteCourse_SubjectUnPaidFeeSchedules = this.delete_unpaid_fee;

        this.getAssignedCount();
        this.cd.markForCheck();
        this.cd.detectChanges();

    }
    closeAlert() {
        this.alertBox = true;
        this.delete_unpaid_fee = false;
        this.dataList[this.unselected_checkbox_id].isSelected = true;
        (document.getElementById("batchcheck" + this.unselected_checkbox_id) as HTMLInputElement).checked = true;
    }

    changed(text: string) {
        this.batchFilter.state = "0";
        this.batchFilter.currentStd = "-1";
        this.modelChanged.next(text.trim());
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
        this.batchFilter.state = "0";
        this.model = "";
        if (id == '-1') {
            this.batchList = this.dataList;
        }
        else {
            this.newMultiFilterFetchBatch();
            this.cd.markForCheck();
            this.cd.detectChanges();
        }
    }

    getChecked(el): boolean {
        let temp: boolean = false;
        this.dataList.forEach(e => {
            if (e.data.course_id == el.course_id) {
                temp = e.isSelected;
            }
        })
        return temp;
    }

    filterDataSource(e: any) {
        switch (e) {
            case '0': {
                console.log(e);
                console.log(this.batchList);
                this.cd.markForCheck();
                this.cd.detectChanges();
                break;
            }
            case '1': {
                let list: any[] = []
                this.batchList.forEach(e => { if (e.isSelected) { list.push(e); } });
                this.batchList = list;
                this.cd.markForCheck();
                this.cd.detectChanges();
                break;
            }
            case '2': {
                let list: any[] = []
                this.batchList.forEach(e => { if (!e.isSelected) { list.push(e); } });
                this.batchList = list;
                this.cd.markForCheck();
                this.cd.detectChanges();
                break;
            }
        }
    }


    filterDataAsOnStandard(batchesList, id) {
        return batchesList.filter(
            ele =>
                ele.data.standard_id == id
        )
    }


    newMultiFilterFetchBatch() {
        let temp: any[] = [];
        this.cd.markForCheck();
        this.cd.detectChanges();
        if (!this.isProfessional) {
            if (this.batchFilter.currentStd != '-1') {
                console.log('newMultiFilterFetchBatch', this.batchList);
                this.batchList = this.filterDataAsOnStandard(this.batchList, this.batchFilter.currentStd);
                this.filterDataSource(this.batchFilter.state);
                this.cd.markForCheck();
                this.cd.detectChanges();
            }
            else {
                console.log('newMultiFilterFetchBatch Else', this.batchList);
                this.batchList = this.dataList;
                this.filterDataSource(this.batchFilter.state);
                this.cd.markForCheck();
                this.cd.detectChanges();
            }
        }
        else {
            this.cd.markForCheck();
            this.cd.detectChanges();
            this.batchList = this.dataList;
            this.filterDataSource(this.batchFilter.state);
            this.cd.markForCheck();
            this.cd.detectChanges();
            console.log('newMultiFilterFetchBatch else 2', this.batchList);
        }
    }

    getAssignedCount() {
        this.assignedCount = 0;
        this.dataList.forEach(e => {
            if (e.isSelected) {
                this.assignedCount++
            }
        });
    }

    getOnlyAssigned() {
        this.batchFilter.state = "1";
        this.batchFilter.currentStd = "-1";
        this.model = "";
        this.newMultiFilterFetchBatch();
    }

    onFeeTemplateChanges(batchdata) {
        let course_id = "course_id";
        if (this.isProfessional) {
            course_id = "batch_id";
        }
        this.cd.markForCheck();
        this.cd.detectChanges();
        for (let i = 0; i < this.clonedArray.length; i++) {
            if (this.clonedArray[i].data[course_id] == batchdata[course_id]) {
                if (batchdata.selected_fee_template_id != "-1" && batchdata.selected_fee_template_id != null && batchdata.selected_fee_template_id != undefined) {
                    if (this.clonedArray[i].data.selected_fee_template_id != batchdata.selected_fee_template_id) {
                        if (confirm('If you change fee template of an assigned course, then corresponding unpaid fee instalments will be deleted. Do you wish to continue?')) {
                            batchdata.deleteCourse_SubjectUnPaidFeeSchedules = true;
                        } else {
                            batchdata.deleteCourse_SubjectUnPaidFeeSchedules = false;
                            batchdata.selected_fee_template_id = this.clonedArray[i].data.selected_fee_template_id;
                        }
                        break;
                    }
                }
            }
        }
    }


    checkIfCourseIsUnassigned(clonedArray, batchList) {
        let course_id = "course_id";
        if (this.isProfessional) {
            course_id = "batch_id";
        }
        for (let i = 0; i < clonedArray.length; i++) {
            for (let j = 0; j < batchList.length; j++) {
                if (clonedArray[i].data[course_id] == batchList[j].data[course_id]) {
                    if (clonedArray[i].isSelected == true) {
                        if (batchList[j].isSelected == false) {
                            // Course is unassigned
                            if (batchList[j].data.deleteCourse_SubjectUnPaidFeeSchedules == true) {
                                return batchList[j].data.deleteCourse_SubjectUnPaidFeeSchedules;
                            }
                        }
                    }
                }
            }
        }

        return false;
    }



}
