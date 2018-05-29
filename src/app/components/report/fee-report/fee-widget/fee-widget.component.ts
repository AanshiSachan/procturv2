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

    @ViewChild('chartWrap') chartWrap: ElementRef;

    constructor(private getService: GetFeeService) {
    }

    ngOnInit() {

        this.fetchDuesData();
        this.createChart();
        this.generateChartData();

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
        console.log(this.totalCollected);
        console.log(this.totalDue);
        console.log(this.totalEstimated);
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
}
