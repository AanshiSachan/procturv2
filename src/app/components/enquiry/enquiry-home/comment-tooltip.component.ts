import { Component, OnInit, HostListener, ElementRef, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'comment-tooltip',
    template:
        /* HTML content for the rendered component with CSS style as well */
        `
  <style>

    .comment-tooltip-wrapper{
        width: 100%;
        min-height: 200px;
        hr { 
            display: block;
            margin-top: 0.5em;
            margin-bottom: 0.5em;
            margin-left: auto;
            margin-right: auto;
            border-style: inset;
            border-width: 1px;
        }
        .row{
            margin-left: 0px;
            margin-right: 0px;
        }
        .comment-header{
            height: 40px;
        }
    }

  </style>
  
  <div class="comment-tooltip-wrapper">
        
        <div class="row comment-header">
              <aside class="pull-left">
    
              </aside>
              <aside class="pull-right">

              </aside>
        </div>
        <hr>
        <div class="row comment-data">

        </div>
        
    </div>
  
  `,
})


export class CommentTooltipComponent implements OnInit {

    @Input() rowData: any;

    constructor() { }

    /* OnInit function to listen the changes in message value from service */
    ngOnInit() {
        console.log(this.rowData);
    }


}