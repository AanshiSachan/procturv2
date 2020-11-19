import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent implements OnInit {

  show: any = 'Analytics';
  constructor() { }

  ngOnInit(): void {
  }



  optionClicked(val) {
    this.show = '';
    switch (val) {
      case 'Analytics': this.show = "Analytics";
        break;
      case 'All': this.show = "All";
        break;
    }
  }

}
