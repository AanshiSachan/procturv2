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
    </style>
    
    <div class="sms-options">
    <ul class="sms-option-list">
    <li><a>Copy</a></li>
    <li><a>Edit</a></li>
    </ul>
    </div>


    `,
})


export class SmsOptionComponent implements OnInit {


    constructor(private router: Router) { }

    /* OnInit function to listen the changes in message value from service */
    ngOnInit() {}

}