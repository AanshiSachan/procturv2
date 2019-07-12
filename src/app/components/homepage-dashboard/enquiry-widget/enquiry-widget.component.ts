import {
    Component, OnInit, ViewChild, Input, Output, EventEmitter, HostListener,
    AfterViewInit, ChangeDetectionStrategy,
    OnChanges,
    ChangeDetectorRef
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
import { FetchenquiryService } from '../../../services/enquiry-services/fetchenquiry.service'
import { WidgetService } from '../../../services/widget.service';


@Component({
    selector: 'enquiry-widget',
    templateUrl: './enquiry-widget.component.html',
    styleUrls: ['./enquiry-widget.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EnquiryWidgetComponent implements OnInit {

    public enquiryStat: any = {
        totalcount: null,
        statusMap: null
    };

    public enquiryDate: any[] = [];

    public chart = new Chart({
        chart: {
            type: 'pie',
            options3d: {
                enabled: true,
                alpha: 45,
                beta: 0
            },
            renderTo: 'enqChart',
            margin: [0, 0, 0, 0],
            spacingTop: 0,
            spacingBottom: 0,
            spacingLeft: 0,
            spacingRight: 0
        },
        title: {
            text: null
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                colors: [
                    '#568bf4',
                    '#f456b0',
                    '#ffcc3c',
                    '#56cff4'
                ],
                size: '80%',
                depth: 35,
                dataLabels: {
                    enabled: false
                }
            }
        },
        credits: {
            enabled: false
        },
        series: [{
            type: 'pie',
            name: '%',
            data: [
                ['Open', 0],
                ['In Progress', 0],
                ['Registered', 0],
                ['Admitted', 0],
                ['Closed', 0],
            ]
        }]
    });

    enquiryZero: boolean = true;

    constructor(
        private router: Router,
        private cd: ChangeDetectorRef,
        private appC: AppComponent,
        private enquiryService: FetchenquiryService,
        private widgetService: WidgetService
    ) {
        this.enquiryDate[0] = new Date(moment().date(1).format("YYYY-MM-DD"));
        this.enquiryDate[1] = new Date();
    }

    ngOnInit() {
        // this.fetchEnqWidgetData();
    }

    openCalendar(id) {
        document.getElementById(id).click();
    }

    fetchEnqWidgetData() {
        this.cd.markForCheck();
        let obj = {
            updateDateFrom: moment(this.enquiryDate[0]).date(1).format("YYYY-MM-DD"),
            updateDateTo: moment(this.enquiryDate[1]).format("YYYY-MM-DD")
        }
        this.enquiryService.fetchEnquiryWidgetView(obj).subscribe(
            (res: any) => {
                this.enquiryStat = res;
                if (res.totalcount == 0) {
                    this.enquiryZero = true;
                }
                else if (res.totalcount != 0) {
                    this.enquiryZero = false;
                }
                this.updateEnqChart();
            }
        )
    }

    updateEnqChart() {
        this.cd.markForCheck();
        if (this.chart.ref && this.chart.ref.series.length > 0) {
            this.chart.ref.series[0].setData(this.generateEnqChartData());
            this.chart.ref.redraw();
        }        
    }

    /* Date CHange events handled here */

    updateEnqChartByDate(e) {
        this.cd.markForCheck();
        let obj = {
            updateDateFrom: moment(e[0]).format("YYYY-MM-DD"),
            updateDateTo: moment(e[1]).format("YYYY-MM-DD")
        }
        this.enquiryService.fetchEnquiryWidgetView(obj).subscribe(
            (res: any) => {
                this.cd.markForCheck();
                this.enquiryStat = res;
                if (res.totalcount == 0) {
                    this.enquiryZero = true;
                }
                else if (res.totalcount != 0) {
                    this.enquiryZero = false;
                }
                this.updateEnqChart();
            }
        )
    }

    generateEnqChartData(): any[] {
        this.cd.markForCheck();
        let tempArr: any[] = [];
        for (let key in this.enquiryStat.statusMap) {
            let temp: any[] = [];
            temp[0] = key;
            if (this.enquiryStat.statusMap[key] == 0) {
                temp[1] = 0;
            } else {
                temp[1] = Math.round(((this.enquiryStat.statusMap[key] / this.enquiryStat.totalcount) * 100));
            }
            tempArr.push(temp);
        }
        return tempArr;
    }

    getEnqStartDate() {
        this.cd.markForCheck();
        let date = moment().date(1).format("YYYY-MM-DD");
        return this.enquiryDate[0];
    }

    getEnqEndDate() {
        this.cd.markForCheck();
        return this.enquiryDate[1];
    }

    getDetails(id: string): number {
        this.cd.markForCheck();
        if (id === 'total') {
            if (this.enquiryStat.totalcount != null && this.enquiryStat.totalcount != undefined) {
                return this.enquiryStat.totalcount;
            }
            else {
                return 0;
            }
        }
        else if (id === 'open') {
            if (this.enquiryStat.statusMap != null && this.enquiryStat.statusMap != undefined) {
                return this.enquiryStat.statusMap['Open'];
            }
            else {
                return 0;
            }
        }
        else if (id === 'ip') {
            if (this.enquiryStat.statusMap != null && this.enquiryStat.statusMap != undefined) {
                return this.enquiryStat.statusMap['In Progress'];
            }
            else {
                return 0;
            }
        }
        else if (id === 'admitted') {
            if (this.enquiryStat.statusMap != null && this.enquiryStat.statusMap != undefined) {
                return this.enquiryStat.statusMap['Student Admitted'];
            }
            else {
                return 0;
            }
        }
        else if (id === 'closed') {
            if (this.enquiryStat.statusMap != null && this.enquiryStat.statusMap != undefined) {
                return this.enquiryStat.statusMap['Closed'];
            }
            else {
                return 0;
            }
        }
    }

    convertEnquiryStats(res): any {

        let obj: any = res;
        let s = res.statusMap;
        let conv = 0;

        for (let k in s) {
            if (k == "Converted") {
                //console.log(k);
                conv = s[k];
                s[k] = 0;
            }
        }

        if (conv != 0) {
            obj.statusMap['Open'] += conv;
        }
        //console.log(obj);
        return obj;
    }

    navigateToEnquiry(data) {
        let obj = {
            type: data,
            dateR: this.enquiryDate
        }

        sessionStorage.setItem('dashBoardParam', JSON.stringify(obj));
        this.router.navigateByUrl('/view/enquiry');
    }

}