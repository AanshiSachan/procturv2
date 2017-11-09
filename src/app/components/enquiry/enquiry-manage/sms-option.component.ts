import { Component, OnInit, HostListener, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';


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
    <li class="cursor"><a class="cursor" (click)="emitCopy()">Copy</a></li>
    <li class="cursor"><a class="cursor" (click)="emitEdit()">Edit</a></li>
    </ul>
  </div>


    `,
})


export class SmsOptionComponent implements OnInit {

    constructor(private router: Router) { }

    /* OnInit function to listen the changes in message value from service */
    ngOnInit() {}



    emitCopy(){
      console.log("copy text invoked");
    }

    emitEdit(){
      console.log("edit text invoked");
    }
}