import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../../services/login-services/login.service';
import { AppComponent } from '../../../../app.component';
import * as moment from 'moment';
import { monitoringService } from '../services/monitoring.service'
import * as Highcharts from 'highcharts/highcharts';
import * as h3d from 'highcharts/highcharts-3d';
import { CommonServiceFactory } from '../../../../services/common-service';
import { HttpService } from '../../../../services/http.service';

@Component({
  selector: 'fee-pie',
  templateUrl: './fee-pie.component.html',
  styleUrls: ['./fee-pie.component.scss']
})
export class FeePieComponent {

  FeeDataData: any[] = [0, 0, 0, 0];
  isDataLoaded: boolean = false;
  dateRange: any[] = [];
  rangeSelected: any = '2';
  Payment_Modes: any[] = [];

  constructor(private getService: monitoringService,
    private _commService: CommonServiceFactory,
    private httpService: HttpService
  ) {
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
        this.isDataLoaded = true;
        this.generateChartData(res);
      },
      err => {
        this.isDataLoaded = false;
      }
    )
  }

  generateChartData(res) {
    let temp: any[] = res;
    this.httpService.getData('/api/v1/masterData/type/PAYMENT_MODES').subscribe(
      (res: any) => {        
        this.Payment_Modes = res;
        if (this.Payment_Modes && this.Payment_Modes.length > 0) {
          this.Payment_Modes.forEach(e => {
            e.value = 0;
          });
        }

        temp.forEach(e => {
          this.Payment_Modes.forEach(mode => {
            if (e.paymentMode == mode.data_key) {
              mode.value = e.total_fees;
            }
          });
        });

        this.createChart(this.Payment_Modes);
      },
      err => {
        console.log(err);
      }
    )
  }


  createChart(obj) {
    let tempData: any[] = [];
    obj.forEach(mode => {
      if (mode.data_key == "Cash") {
        let temp = {
          name: mode.data_key,
          y: mode.value,
          sliced: true,
          selected: true
        }
        tempData.push(temp);
      } else {
        let temp = {
          name: mode.data_key,
          y: mode.value
        }
        tempData.push(temp);
      }
    })
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
        pointFormat: '<span style="color:{series.color}">●</span> {series.name}: <b> ' + this._commService.currency_default_symbol + ' {point.y} </b>'
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: this._commService.currency_default_symbol + '{y}'
          },
          showInLegend: true
        }
      },
      series: [{
        name: 'Payment Mode',
        colorByPoint: true,
        data: tempData
      }]
    });
  }
}