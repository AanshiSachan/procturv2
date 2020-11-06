import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Chart } from 'angular-highcharts';
import * as moment from 'moment';
import 'rxjs/Rx';
import { AppComponent } from '../../../app.component';
import { FetchenquiryService } from '../../../services/enquiry-services/fetchenquiry.service';
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
                    '#568bf4', //#568bf4 --open
                    '#f456b0', //#f456b0  --in progress
                    '#ffcc3c', //ffcc3c  admitted
                    '#56cff4' //#56cff4;  closed
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
        let object = {
            "Open": 0,
            "In Progress": 0,
            "Student Admitted": 0,
            "Closed": 0,
        }
        for (let key in this.enquiryStat.statusMap) {
            object[key] = 0;
            if (this.enquiryStat.statusMap[key] != 0) {
                object[key] = Math.round(((this.enquiryStat.statusMap[key] / this.enquiryStat.totalcount) * 100));
            }
        }
        let keysArr = Object.keys(object);
        tempArr = [];
        keysArr.forEach((key) => {
            let temp = [];
            temp[0] = key;
            temp[1] = object[key];
            tempArr.push(temp);
        });
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
        this.router.navigateByUrl('/view/leads');
    }

}