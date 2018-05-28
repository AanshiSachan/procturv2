import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../../services/login-services/login.service';
import { AppComponent } from '../../../../app.component';
import * as moment from 'moment';
import { monitoringService } from '../services/monitoring.service'
import * as Highcharts from 'highcharts/highcharts';
import * as h3d from 'highcharts/highcharts-3d';

@Component({
  selector: 'fee-pie',
  templateUrl: './fee-pie.component.html',
  styleUrls: ['./fee-pie.component.scss']
})
export class FeePieComponent {

  FeeDataData: any[] = [0, 0, 0, 0];

  dateRange: any[] = [];
  rangeSelected: any = '2';
  constructor(private getService: monitoringService) {
    this.dateRange[0] = moment(new Date()).startOf('month').format('DD-MMM-YYYY');
    this.dateRange[1] = moment(new Date()).endOf('month').format('DD-MMM-YYYY');
  }

  ngOnInit() {
    this.fetchFeeStackMonitor();
  }

  dateRangeUpdated(e) {
    /* last 7 days */
    if (e == 1) {
      this.dateRange[1] = moment(new Date()).format('DD-MMM-YYYY');
      this.dateRange[0] = moment(new Date()).subtract(7, 'days').format('DD-MMM-YYYY');
    }
    /* this month */
    else if (e == 2) {
      this.dateRange[0] = moment(new Date()).startOf('month').format('DD-MMM-YYYY');
      this.dateRange[1] = moment(new Date()).endOf('month').format('DD-MMM-YYYY');
    }
    /* last 30 days */
    else if (e == 3) {
      this.dateRange[1] = moment(new Date()).format('DD-MMM-YYYY');
      this.dateRange[0] = moment(new Date()).subtract(30, 'days').format('DD-MMM-YYYY');
    }
    /* last month */
    else if (e == 4) {
      this.dateRange[0] = moment(new Date()).startOf('month').subtract(1, 'months').format('DD-MMM-YYYY');
      this.dateRange[1] = moment(new Date()).startOf('month').subtract(1, 'months').endOf('month').format('DD-MMM-YYYY');
    }
    /* last 3 month */
    else if (e == 5) {
      this.dateRange[0] = moment(new Date()).startOf('month').subtract(3, 'months').format('DD-MMM-YYYY');
      this.dateRange[1] = moment(new Date()).format('DD-MMM-YYYY');
    }

   this.fetchFeeStackMonitor();

  }

  fetchFeeStackMonitor() {
    let obj = {
      from_date: moment(this.dateRange[0]).format('YYYY-MM-DD'),
      high_charts_name: "pieCharts",
      institute_id: sessionStorage.getItem('institute_id'),
      to_date: moment(this.dateRange[1]).format('YYYY-MM-DD')
    }

    this.getService.fetchFeeMonitor(obj).subscribe(
      res => {
        this.generateChartData(res);
      },
      err => {
      }
    )
  }

  generateChartData(res) {
    let temp: any[] = res;

    let obj: any = {
      cash: 0,
      caution: 0,
      credit: 0,
      other: 0,
      cheque: 0
    }

    temp.forEach(e => {
      if (e.paymentMode == "Cash") {
        obj.cash = e.total_fees;
      }
      else if (e.paymentMode == "Caution Deposit(Refundable)") {
        obj.caution = e.total_fees;
      }
      else if (e.paymentMode == "Credit/Debit Card") {
        obj.credit = e.total_fees;
      }
      else if (e.paymentMode == "Other") {
        obj.other = e.total_fees;
      }
      else if (e.paymentMode == "Cheque") {
        obj.cheque = e.total_fees;
      }
    });

    this.createChart(obj);

  }


  createChart(obj) {
    Highcharts.chart('pieContainer', {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie',
        options3d: {
          enabled: true,
          alpha: 45,
          beta: 0
        }
      },
      title: {
        text: 'Payment Mode'
      },
      tooltip: {
        pointFormat: '<span style="color:{series.color}">●</span> {series.name}: <b> ₹ {point.y} </b>'
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '₹ {y}'
          },
          showInLegend: true
        }
      },
      series: [{
        name: 'Payment Mode',
        colorByPoint: true,
        data: [{
          name: 'Cash',
          y: obj.cash,
          sliced: true,
          selected: true
        }, {
          name: 'Caution Deposit(Refundable)',
          y: obj.caution
        }, {
          name: 'Credit/Debit Card',
          y: obj.credit
        }, {
          name: 'Other',
          y: obj.other
        }, {
          name: 'Cheque',
          y: obj.cheque
        }]
      }]
    });
  }

}