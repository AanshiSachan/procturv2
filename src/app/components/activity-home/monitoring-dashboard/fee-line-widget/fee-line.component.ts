import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../../services/login-services/login.service';
import { AppComponent } from '../../../../app.component';
import * as moment from 'moment';
import { monitoringService } from '../services/monitoring.service'
import * as Highcharts from 'highcharts';

@Component({
  selector: 'fee-line',
  templateUrl: './fee-line.component.html',
  styleUrls: ['./fee-line.component.scss']
})
export class FeeLineComponent {

  constructor(private getService: monitoringService) {
  }

  FeeDataData: any[] = [0, 0, 0, 0];

  ngOnInit() {
    this.fetchFeeStackMonitor();
  }

  fetchFeeStackMonitor() {
    this.getService.fetchFeeStackMonitor().subscribe(
      res => {
        this.generateChartData(res);
      },
      err => {
      }
    )
  }

  generateChartData(res) {
    let fd: number = parseInt(res.total_future_dues);
    let n: number = parseInt(res.total_dues_amount_in_next_thirty_days);
    let pd: number = parseInt(res.total_dues_pending);
    let p: number = parseInt(res.total_paid_amount_in_last_thirty_days);
    this.createChart(fd, n, pd, p);
  }

  createChart(fd, n, pd, p) {
    Highcharts.chart('feestackbar', {
      chart: {
        type: 'column',
        options3d: {
          enabled: true,
          alpha: 15,
          beta: 15,
          viewDistance: 25,
          depth: 40
        },
        backgroundColor: '#FFF',
      },

      title: {
        text: ''
      },

      xAxis: {
        categories: ['Fee in Rs'],
        labels: {
          skew3d: true,
          style: {
            fontSize: '16px'
          }
        }
      },

      yAxis: {
        visible: false,
        allowDecimals: false,
        min: 0,
        title: {
          text: 'Amount in Rs',
          skew3d: true
        }
      },

      tooltip: {
        headerFormat: '<b>{point.key}</b><br>',
        pointFormat: '<span style="color:{series.color}">●</span> {series.name}: Rs {point.y} /-'
      },

      plotOptions: {
        column: {
          dataLabels: {
            enabled: true,
            color: '#FFF',
            format: '₹ {y}',
            x: 0
          },
          stacking: 'normal',
          depth: 40
        }
      },
      colors: ['#80cbc4', '#37474f', '#536DFE', '#2e7d32'],
      series: [
        { name: 'Future Dues', data: [fd], crisp: false },
        { name: 'Dues in Next 30 Days', data: [n], crisp: false },
        { name: 'Past Dues', data: [pd], crisp: false },
        { name: 'Paid in Last 30 Days', data: [p], crisp: false },
      ]
    });
  }

}