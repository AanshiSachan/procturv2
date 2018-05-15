import {Component,NgModule, ViewChild, ElementRef} from '@angular/core'; 


@Component({
    selector: 'app-chatbot',
    templateUrl: './chatbot.component.html',
    styleUrls: ['./chatbot.component.scss']
  })
  export class chatBotComponent {

    @ViewChild('helpForm') help: ElementRef;


    constructor(){}

    helpRequested(){
      
      if(this.help.nativeElement.classList.contains('active')){
        this.help.nativeElement.classList.remove('active');
      }
      else{
        this.help.nativeElement.classList.add('active');
      }
    }

  }  