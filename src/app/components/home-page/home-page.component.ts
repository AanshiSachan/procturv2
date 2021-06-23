import { getMatScrollStrategyAlreadyAttachedError } from '@angular/cdk/overlay/scroll/scroll-strategy';
import { Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import * as moment from 'moment';
declare var $;


@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit  {
  
  curDate: number = moment().date();
  curMonth: string = moment().format('MMMM');
  curYear: number = moment().year();
  
  d: any = moment().format('MMMM Do,  YYYY, dddd');
 weekday=moment().format('dddd');
  //t: any = moment().format('LTS');
  time = new Date();
  timer;
  quotes:string="";
  
  msg:string=null;
  mydate:Date=new Date();
  hrs:any=this.mydate.getHours();
  name:any=sessionStorage.getItem('name');
  
  
  dates: number[][] = new Array<number[]>(5);

  constructor(private router: Router) {
    if ((sessionStorage.getItem('userid') != null) && sessionStorage.getItem('institute_id') != null) {
    let firstDay: number = moment().date(1).day();
    let lastDate: number = moment().clone().endOf('month').date();
    let day: number = 1;
    for (let i = 0; i < 5; i++) {
      this.dates[i] = new Array<number>(7);
      for (let j = 0; j < 7; j++) {
        if((i == 0 && j < firstDay) || day > lastDate) {
          this.dates[i][j] = 0;
          continue;
        }
        this.dates[i][j] = day++;
      }
    }
    if(this.hrs<12){
      this.msg="Good Morning";

    }
    else if(this.hrs>=12 && this.hrs<=17){
      this.msg="Good Afternoon";


    }
    else if(this.hrs>=17 && this.hrs<=24){

      this.msg="Good Evening";
    }

    
    switch(this.weekday)
    {

      case 'Monday':
        {
          this.quotes="The Pessimist Sees Difficulty In Every Opportunity. The Optimist Sees Opportunity In Every Difficulty.";
          break;
        }
        case 'Tuesday':{
          this.quotes="Don’t Let Yesterday Take Up Too Much Of Today.";
          break;

        }
        case 'Wednesday':{
          this.quotes="You Learn More From Failure Than From Success. Don’t Let It Stop You. Failure Builds Character.";
          break;
        }
        case 'Thursday':{
          this.quotes="Failure Will Never Overtake Me If My Determination To Succeed Is Strong Enough.";
          break;
        }
        case 'Friday':{
          this.quotes="We May Encounter Many Defeats But We Must Not Be Defeated.";
          break;

        }
        case 'Saturday':{
          this.quotes="Whether You Think You Can Or Think You Can’t, You’re Right.";
          break;

        }
        case 'Sunday':{
          this.quotes="Creativity Is Intelligence Having Fun";
          

        }
    }
    } else {
      this.router.navigate(['/login']);
    }
  }
  
  ngOnInit(): void {

    this.timer = setInterval(() => {
      this.time = new Date();
    }, 1000);
  }
}

