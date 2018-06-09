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
    selector: 'general-widget',
    templateUrl: './general-widget.component.html',
    styleUrls: ['./general-widget.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GeneralWidgetComponent implements OnInit {

    public storageData: any = {
        storage_allocated: 0
    };

    public instituteSetting: any = {
        institute_campaign_sms_quota_available: 0,
        institute_sms_quota_available: 0
    };
    public planListArr: any[] = [];


    public genralStats: any = {
        sms: 0,
        download: 0,
        expiry: moment().format('DD-MMM-YYYY'),
        total: 0
    }

    public currentPlan: any = null;



    constructor(private router: Router, private fb: FormBuilder, private appC: AppComponent, private rd: Renderer2, private widgetService: WidgetService, private cd: ChangeDetectorRef) {

    }

    ngOnInit() {
        this.fetchWidgetPrefill();
    }


    /* ===================================================================================== */
    /* ===================================================================================== */
    fetchWidgetPrefill() {

        this.widgetService.getAllplan().subscribe(
            res => {
                this.planListArr = res;
                this.widgetService.getInstituteSettings().subscribe(
                    res => {
                        this.cd.markForCheck();
                        this.instituteSetting = res;
                        this.generatePlan();
                    },
                    err => { }
                );
            },
            err => { }
        );

        this.getStorageData();

    }

    getStorageData() {
        this.widgetService.getAllocatedStorageDetails().subscribe(
            res => {
                this.cd.markForCheck();
                this.storageData = res;
                this.storageData.storage_allocated = (Number(res.storage_allocated) / 1024).toFixed(3);
            },
            err => {
                //console.log(err);
            }
        )
    }


    generatePlan() {
        this.cd.markForCheck();
        this.planListArr.forEach(e => {
            if (e.id === this.instituteSetting.plan_id) {
                this.genralStats.download = e.download_limit;
                this.genralStats.expiry = this.instituteSetting.institute_expiry_date;
                this.genralStats.total = this.instituteSetting.total_students;
                this.genralStats.sms = this.instituteSetting.institute_sms_quota_available;
                this.genralStats.student_limit = e.student_limit;
            }
        })
    }



}


