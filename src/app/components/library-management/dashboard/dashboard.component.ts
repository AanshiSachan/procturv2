import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../../../app.component';
import { MastersService } from '../../../services/library/master/masters.service'
import * as moment from 'moment';
import * as Highcharts from 'highcharts/highcharts';
import * as h3d from 'highcharts/highcharts-3d';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  isDataLoaded: boolean = false;

  constructor(
  private masterService: MastersService
  ) { }

  ngOnInit() {
    this.fetchDashboard();
  }

  fetchDashboard() {

    this.masterService.fetchDashboardMonitor().subscribe(
      res => {
        this.isDataLoaded = true;
        let result: any;
        result = res;
        this.generateChartData(result.response);
      },
      err => {
        this.isDataLoaded = false;
      }
    )
  }


  generateChartData(res) {

    let obj: any = {
      total_added_books: res.total_added_books,
      total_available_books: res.total_available_books,
      total_issued_books: res.total_issued_books,
      total_lost_books: res.total_lost_books,
      total_overdued_books: res.total_overdued_books,
      total_scrapped_books: res.total_scrapped_books
    }
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
        text: ''
      },
      tooltip: {
        pointFormat: '<span style="color:{series.color}">●</span> {series.name}: <b>  {point.y} </b>'
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '{y}'
          },
          showInLegend: true
        }
      },
      series: [{
        // name: 'Payment Mode',
        colorByPoint: true,

        data: [
          // {
          // name: 'total',
          // y: obj.total_added_books,
          // sliced: true,
          // selected: true
          // },
          {
            name: 'Available',
            y: obj.total_available_books,
            sliced: true,
            selected: true
          },
          {
            name: 'Issued',
            y: obj.total_issued_books,
            sliced: true
         },
          {
            name: 'Lost',
            y: obj.total_lost_books,
            sliced: true
         },
          {
            name: 'Overdue',
            y: obj.total_overdued_books,
            sliced: true
          },
          {
            name: 'Scrapped',
            y: obj.total_scrapped_books,
            sliced: true
          }]
      }]
    });
  }

}
