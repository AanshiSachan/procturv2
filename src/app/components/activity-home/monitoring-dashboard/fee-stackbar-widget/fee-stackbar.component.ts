import { Component, OnInit, OnChanges, ViewChild, ElementRef } from '@angular/core';
import { LoginService } from '../../../../services/login-services/login.service';
import { AppComponent } from '../../../../app.component';
import * as moment from 'moment';
import { monitoringService } from '../services/monitoring.service'
import * as Highcharts from 'highcharts';

@Component({
  selector: 'fee-stackbar',
  templateUrl: './fee-stackbar.component.html',
  styleUrls: ['./fee-stackbar.component.scss']
})
export class FeeStackbarComponent implements OnInit {

  isDataLoaded: boolean = false;

  constructor(private getService: monitoringService) {
  }

  FeeDataData: any[] = [0, 0, 0, 0];

  ngOnInit() {
    this.fetchFeeStackMonitor();
  }
 
  fetchFeeStackMonitor() {
    this.getService.fetchFeeStackMonitor().subscribe(
      res => {
        this.isDataLoaded = true;
        if(this.isDataLoaded){
          this.generateChartData(res);
        }
      },
      err => {
        this.isDataLoaded = false;
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
        categories: ['Future dues', "Dues in next 30 days", "Past dues", "Paid in last 30 days" ],
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
        pointFormat: '{series.name}: ₹ {point.y}'
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
      series: [
        {
          data: [
                {y: fd, name: 'Future dues', color: '#80cbc4'},
                {y: n, name: 'Dues in next 30 days', color: '#37474f'},
                {y: pd, name: 'Past dues', color: '#536DFE'},
                {y: p, name: 'Paid in last 30 days', color: '#2e7d32'}
            ]
        }
        // { name: 'Future Dues', data: [fd], crisp: false },
        // { name: 'Dues in Next 30 Days', data: [n], crisp: false },
        // { name: 'Past Dues', data: [pd], crisp: false },
        // { name: 'Paid in Last 30 Days', data: [p], crisp: false },
      ]
    });
  }

}
