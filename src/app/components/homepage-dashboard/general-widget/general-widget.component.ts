import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import 'rxjs/Rx';
import { AppComponent } from '../../../app.component';
import { WidgetService } from '../../../services/widget.service';


@Component({
    selector: 'general-widget',
    templateUrl: './general-widget.component.html',
    styleUrls: ['./general-widget.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GeneralWidgetComponent implements OnInit {

    @Input() storageData: any ;


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



    constructor(
        private router: Router,
        private fb: FormBuilder,
        private appC: AppComponent,
        private rd: Renderer2,
        private widgetService: WidgetService,
        private cd: ChangeDetectorRef
    ) {


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
    }



    generatePlan() {
        this.cd.markForCheck();
        this.planListArr.forEach(e => {
            if (e.id === this.instituteSetting.plan_id) {
                this.genralStats.download = e.download_limit;
                this.genralStats.expiry = this.instituteSetting.institute_expiry_date;
                this.genralStats.sms = this.instituteSetting.institute_sms_quota_available;
            }
        })
        this.genralStats.student_limit = this.instituteSetting.active_student_allocation;
        this.genralStats.total = this.instituteSetting.total_students;
    }



}