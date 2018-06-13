import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as Highcharts from 'highcharts';
import * as moment from 'moment';
import { GetFeeService } from '../../../../services/report-services/fee-services/getFee.service';

@Component({
    selector: 'fee-widget',
    templateUrl: './fee-widget.component.html',
    styleUrls: ['./fee-widget.component.scss']
})
export class FeeWidgetComponent implements OnInit {

    lastMonthData: any[] = [];
    nextMonthData: any[] = [];
    currentMonthData: any[] = [];

    totalEstimated: any[] = [0, 0, 0];
    totalCollected: any[] = [0, 0, 0];
    totalDue: any[] = [0, 0, 0];

    total_fees_collected: any[] = [];
    total_dues_pending: any[] = [];
    total_future_dues: any[] = [];
    total_fees: any = 0;

    @ViewChild('chartWrap') chartWrap: ElementRef;

    constructor(private getService: GetFeeService) {
    }

    ngOnInit() {
        // this.fetchDuesData();
        // this.createChart();
        // this.generateChartData();
        this.fetchAllFeeData();
    }

    fetchDuesData() {
        this.fetchCurrentMonthData();
    }

    fetchCurrentMonthData() {
        let obj = {
            from_date: moment(new Date()).startOf('month').format('YYYY-MM-DD'),
            high_charts_name: "",
            institute_id: sessionStorage.getItem('institute_id'),
            to_date: moment(new Date()).endOf('month').format('YYYY-MM-DD')
        }
        this.getService.fetchLastMonthFee(obj).subscribe(
            res => {
                this.currentMonthData = res;
                this.fetchlastMonthData();

            },
            err => {

            }
        )
    }

    fetchNextMonthData() {
        let obj = {
            from_date: moment(new Date()).add(1, 'months').startOf('month').format('YYYY-MM-DD'),
            high_charts_name: "",
            institute_id: sessionStorage.getItem('institute_id'),
            to_date: moment(new Date()).add(1, 'months').endOf('month').format('YYYY-MM-DD')
        }
        this.getService.fetchLastMonthFee(obj).subscribe(
            res => {
                this.nextMonthData = res;
                this.generateChartData();

            },
            err => {

            }
        )
    }

    fetchlastMonthData() {
        let obj = {
            from_date: moment(new Date()).subtract(1, 'months').startOf('month').format('YYYY-MM-DD'),
            high_charts_name: "",
            institute_id: sessionStorage.getItem('institute_id'),
            to_date: moment(new Date()).subtract(1, 'months').endOf('month').format('YYYY-MM-DD')
        }

        this.getService.fetchLastMonthFee(obj).subscribe(
            res => {
                this.lastMonthData = res;
                this.fetchNextMonthData();
            },
            err => {

            }
        )
    }

    generateChartData() {

        let lastEstimated: number = 0;
        let currentEstimated: number = 0;
        let nextEstimated: number = 0;

        let lastCollected: number = 0;
        let currentCollected: number = 0;
        let nextCollected: number = 0;

        let lastDue: number = 0;
        let currentDue: number = 0;
        let nextDue: number = 0;

        this.lastMonthData.map(l => {
            lastEstimated += parseInt(l.total_fees);
            lastCollected += parseInt(l.total_fees_collected);
            lastDue += parseInt(l.total_dues_pending);
        });

        this.currentMonthData.map(l => {
            currentEstimated += parseInt(l.total_fees);
            currentCollected += parseInt(l.total_fees_collected);
            currentDue += parseInt(l.total_dues_pending);
        });

        this.nextMonthData.map(l => {
            nextEstimated += parseInt(l.total_fees);
            nextCollected += parseInt(l.total_fees_collected);
            nextDue += parseInt(l.total_dues_pending);
        });

        this.totalCollected = [lastCollected, currentCollected, nextCollected];
        this.totalDue = [lastDue, currentDue, nextDue];
        this.totalEstimated = [lastEstimated, currentEstimated, nextEstimated];
        this.createChart();

    }

    createChart() {
        Highcharts.chart('chartWrap', {
            title: {
                text: 'Fee Report'
            },
            xAxis: {
                categories: ['Last Month', 'Current Month', 'Next Month']
            },
            yAxis: {
                gridLineWidth: 0,
                minorGridLineWidth: 0,
                labels: {
                    enabled: false
                },
                title: {
                    text: 'Amount in Rs'
                }
            },
            legend: {
                align: 'right',
                x: -30,
                verticalAlign: 'top',
                y: 25,
                floating: true,
                borderColor: '#CCC',
                borderWidth: 1,
                shadow: false
            },
            tooltip: {
                headerFormat: '<b>{point.x}</b><br/>',
                pointFormat: '{series.name}: ₹ {point.y}<br/>Total: ₹ {point.stackTotal}'
            },
            plotOptions: {
                column: {
                    stacking: 'normal',
                    dataLabels: {
                        enabled: true,
                        format: ' ₹ {y}'
                    }
                }
            },
            series: [
                {
                    type: 'column',
                    name: 'Total Fee Estimated',
                    data: this.totalEstimated
                },
                {
                    type: 'column',
                    name: 'Total Fee Received',
                    data: this.totalCollected
                },
                {
                    type: 'column',
                    name: 'Total Fee Due',
                    data: this.totalDue
                }
            ]
        });
    }


    fetchAllFeeData() {
        let obj = {
            standard_id: -1,
            batch_id: -1,
            type: 0,
            from_date: null,
            to_date: null,
            installment_id: -1,
            subject_id: -1,
            master_course_name: '',
            course_id: -1,
            student_name: '',
            contact_no: '',
            is_fee_report_view: 1
        }
        this.getService.getFeeReportData(obj).subscribe(
            res => {
                this.total_fees = res[0].total_fees;
                let col: any[] = [];
                let pend: any[] = [];
                let fut: any[] = [];
                col.push(res[0].total_fees_collected);
                pend.push(res[0].total_dues_pending);
                fut.push(res[0].total_future_dues);
                this.total_fees_collected = col;
                this.total_dues_pending = pend;
                this.total_future_dues = fut;

                this.createCompareChart(col, pend, fut);
            },
            err => {

            }
        )
    }

    createCompareChart(c, p, f) {
        Highcharts.chart('chartWrap', {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Fee Report',
            },
            xAxis: {
                categories: ['Total Fees Collection', 'Total Dues', 'Future Dues']
            },
            yAxis: {
                gridLineWidth: 0,
                minorGridLineWidth: 0,
                labels: {
                    enabled: false
                },
                title: {
                    text: ''
                }
            },
            legend: {
                align: 'right',
                x: -30,
                verticalAlign: 'top',
                y: 25,
                floating: true,
                borderColor: '#CCC',
                borderWidth: 1,
                shadow: false
            },
            tooltip: {
                headerFormat: '<b>{point.x}</b><br/>',
                pointFormat: '{series.name}: ₹ {point.y}<br/>Total: ₹ {point.stackTotal}'
            },
            plotOptions: {    
                column: {
                    stacking: 'normal',
                    dataLabels: {
                        enabled: true,
                        format: ' ₹ {y}'
                    }
                }
            },
            series: [
                { 
                    name: 'Total Fees Collection',
                    data: c
                },
                {
                    name: 'Total Dues',
                    data: p
                },
                {
                    name: 'Future Dues',
                    data: f
                }
            ]
        });
    }
}
