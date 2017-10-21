import { Component, OnInit } from '@angular/core';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-error-popup',
  templateUrl: './error-popup.component.html',
  styleUrls: ['./error-popup.component.scss']
})
export class ErrorPopupComponent implements OnInit {

  message: any;
  
  //   constructor(private alertService: AlertService) { }
  
     ngOnInit() {
    //     this.alertService.getMessage().subscribe(message => { this.message = message; });
     }

}
