import { Component, OnInit, HostListener, ElementRef, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { PopupHandlerService } from '../../../services/enquiry-services/popup-handler.service';

@Component({
    template:
    /* HTML content for the rendered component with CSS style as well */
    `
    
  <style>
    .sms-option-list{
        list-style: none;
    }
    .sms-option-list li{
        display:inline;
    }
    .cursor{
        cursor:pointer;
    }
  </style>
    
  <div class="sms-options" (copyEvent)="enquiryManager.copySMS()">
    <ul class="sms-option-list">
    <li class="cursor"><a class="cursor" (click)="emitEdit()">Edit</a></li>
    </ul>
  </div>

    `,
    /* changeDetection: ChangeDetectionStrategy.OnPush */  
})


export class SmsOptionComponent implements OnInit {

    sms: string = "";

    constructor(private router: Router, private pops: PopupHandlerService, private cd: ChangeDetectorRef) {
      this.pops.currentMessage.subscribe(data => this.sms = data);
      
     }

    /* OnInit function to listen the changes in message value from service */
    ngOnInit() {
        this.cd.markForCheck();
    }

    emitEdit(){
      this.pops.changeSmsMessage('edit');
      this.cd.markForCheck();
    }
}