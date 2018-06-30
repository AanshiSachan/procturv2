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

    chartType: any = "1";
    isRippleLoad: boolean = false;
    chartDate: any = {
        from_date: moment().startOf("year").format("YYYY-MM-DD"),
        to_date: moment().endOf("year").format("YYYY-MM-DD")
    }

    @ViewChild('chartWrap') chartWrap: ElementRef;

    constructor(private getService: GetFeeService) {
    }

    ngOnInit() {
        this.fetchAllFeeData();
    }

    updateChartDate(e) {
        switch (parseInt(e)) {

            /* Current calendar year */
            case 1: {
                this.chartDate = {
                    from_date: moment().startOf("year").format("YYYY-MM-DD"),
                    to_date: moment().endOf("year").format("YYYY-MM-DD")
                }
                break;
            }

            /* Current financial year */
            case 2: {
                this.chartDate = {
                    from_date: moment().month("April").startOf("month").format("YYYY-MM-DD"),
                    to_date: moment().month("March").add(1, 'years').endOf("month").format("YYYY-MM-DD")
                }
                break;
            }

            /* Previous calendar year */
            case 3: {
                this.chartDate = {
                    from_date: moment().subtract(1, 'years').startOf("year").format("YYYY-MM-DD"),
                    to_date: moment().subtract(1, 'years').endOf("year").format("YYYY-MM-DD")
                }
                break;
            }
            /* Previous financial year */
            case 4: {
                this.chartDate = {
                    from_date: moment().month("April").subtract(1, 'years').startOf("month").format("YYYY-MM-DD"),
                    to_date: moment().month("March").endOf("month").format("YYYY-MM-DD")
                }
                break;
            }

            /* next calendar year */
            case 5: {
                this.chartDate = {
                    from_date: moment().add(1, 'years').startOf("year").format("YYYY-MM-DD"),
                    to_date: moment().add(1, 'years').endOf("year").format("YYYY-MM-DD")
                }
                break;
            }

            /* next financial year */
            case 6: {
                this.chartDate = {
                    from_date: moment().month("April").add(1, 'years').startOf("month").format("YYYY-MM-DD"),
                    to_date: moment().month("March").add(2, 'years').endOf("month").format("YYYY-MM-DD")
                }
                break;
            }

        }
        this.fetchAllFeeData();
    }

    fetchAllFeeData() {
        this.isRippleLoad = true;
        this.getService.getFeeWidgetDataByDateRange(this.chartDate).subscribe(
            res => { this.generateChartData(res); this.isRippleLoad = false; },
            err => this.isRippleLoad = false
        );

    }

    generateChartData(res) {
        let feeCollectedArr: any[] = [];
        let feeDueArr: any[] = [];
        let upcomingDueArr: any[] = [];
        let monthArr: any[] = [];
        if (res != null) {
            res.forEach(e => {
                feeCollectedArr.push(e.feeCollected);
                feeDueArr.push(e.feeDue);
                monthArr.push(e.month + "-" + e.year);
                upcomingDueArr.push(e.upcomingDue);
            });
            this.createCompareChart(feeCollectedArr, feeDueArr, upcomingDueArr, monthArr);
        }
    }


    createCompareChart(fc: any[], fd: any[], up: any[], m: any[]) {
        Highcharts.chart('chartWrap', {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Monthly Average Collection and Dues'
            },
            xAxis: {
                categories: m,
                crosshair: true
            },
            yAxis: {
                min: 0,
                visible: true,
                tickAmount: 5,
                title: {
                    text: 'Amount (Rs)'
                }
            },
            tooltip: {
                shared: true,
                pointFormatter: function () {
                    var pointer = function (x) {
                        var formatted = x.toLocaleString('en-IN', {
                            maximumFractionDigits: 2,
                            style: 'currency',
                            currency: 'INR'
                        }).slice(0, -3);
                        return this.symbol + formatted;
                    }, localVar = { symbol: " " };
                    var text = pointer.call(localVar, this.y);
                    return '<span style="font-size:10px"></span><table><tr><td style="color:' + this.series.color + ';padding:5px">' + this.series.name + '</td><td style="padding:5px"><b> ' + text + '</b></td></tr></table>';
                },
                useHTML: true
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            },
            series: [{
                name: 'Fee Due',
                data: fd
            }, {
                name: 'Fee Collected',
                data: fc
            }, {
                name: 'Upcoming Dues',
                data: up
            }]
        });
    }

    // pointerValue(e): string{
    //     console.log(e);
    //     return "wallah habibi";
    // }
}
