import {
    Component, OnInit, ViewChild, Input, Output, EventEmitter, HostListener,
    AfterViewInit, OnDestroy, ElementRef, Renderer2, ChangeDetectionStrategy, ChangeDetectorRef,
    SimpleChanges, OnChanges
} from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl, ValidatorFn } from '@angular/forms';
import { AppComponent } from '../../../app.component';
import * as moment from 'moment';
import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Subscription } from 'rxjs';
import 'rxjs/Rx';
import * as Muuri from 'muuri/muuri';
import { Chart } from 'angular-highcharts';
import { WidgetService } from '../../../services/widget.service';


@Component({
    selector: 'fee-widget',
    templateUrl: './fee-widget.component.html',
    styleUrls: ['./fee-widget.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeeWidgetComponent implements OnInit {

    public feeStat: any = null;
    public feeDate: any[] = [];
    public isOptionVisible: boolean = false;

    constructor(private router: Router, private fb: FormBuilder, private appC: AppComponent, private rd: Renderer2, private widgetService: WidgetService, private cd: ChangeDetectorRef) {
        this.feeDate[0] = new Date();
        this.feeDate[1] = new Date();
    }

    ngOnInit() {
        this.cd.markForCheck();
        this.fetchFeeWidgetData();
    }

    fetchFeeWidgetData() {
        this.cd.markForCheck();
        let obj = {
            standard_id: -1,
            batch_id: -1,
            type: 0,
            installment_id: -1,
            subject_id: -1,
            master_course_name: '-1',
            course_id: -1,
            is_fee_report_view: 1,
            from_date: moment(this.feeDate[0]).format('YYYY-MM-DD'),
            to_date: moment(this.feeDate[1]).format('YYYY-MM-DD')
        }
        this.widgetService.fetchFeeWidgetData(obj).subscribe(
            res => {
                this.cd.markForCheck();
                //this.grid.refreshItems().layout();
                this.feeStat = res;
            },
            err => { }
        );
    }

    getDataId(text: String): number {
        this.cd.markForCheck();
        let id: number;

        switch (text) {
            case 'enquiry': {
                id = 1;
                break;
            }

            case 'fee': {
                id = 2;
                break;
            }

            case 'general': {
                id = 3;
                break;
            }

            case 'schedule': {
                id = 4;
                break;
            }
        }

        return id;
    }

    updateFeeByDate(e) {
        this.cd.markForCheck();
        let obj = {
            standard_id: -1,
            batch_id: -1,
            type: 2,
            installment_id: -1,
            subject_id: -1,
            master_course_name: '-1',
            course_id: -1,
            is_fee_report_view: 1,
            from_date: moment(this.feeDate[0]).format('YYYY-MM-DD'),
            to_date: moment(this.feeDate[1]).format('YYYY-MM-DD')
        }
        this.isOptionVisible = false;
        this.widgetService.fetchFeeWidgetData(obj).subscribe(
            res => {
                //this.grid.refreshItems().layout();
                //this.selectedRow = null;
                this.cd.markForCheck();
                this.feeStat = res;
            },
            err => { }
        )
    }


    getFeeStartDate() {
        return this.feeDate[0];
    }

    getFeeEndDate() {
        return this.feeDate[1];
    }

    getFeeAmount(id: String): number {
        this.cd.markForCheck();
        if (this.feeStat != null && this.feeStat != undefined && this.feeStat.length != 0) {
            if (id === 'total') {
                return this.feeStat[0].total_fees_collected;
            }
            else if (id === 'pending') {
                return this.feeStat[0].total_fees_collected_other;
            }
            else if (id === 'past') {
                return this.feeStat[0].total_dues_pending;
            }
        }
        else {
            return 0
        }
    }

    openCalendar(id) {
        document.getElementById(id).click();
    }



}

