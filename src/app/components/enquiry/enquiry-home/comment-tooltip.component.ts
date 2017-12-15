import { Component, OnInit, HostListener, ElementRef, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

@Component({
    selector: 'comment-tooltip',
    template:
        /* HTML content for the rendered component with CSS style as well */
        `
  <style>

    .comment-tooltip-wrapper{
        width: 100%;
        margin: 5px 0px 20px 0px;
    }

    .comment-tooltip-wrapper .row{
        margin: 5px;
    }

    hr.style-seven {
        overflow: visible; /* For IE */
        height: 10px;
        border-style: solid;
        border-color: rgba(0, 0, 0, 0.3);
        border-width: 0px 0 0 0;
        border-radius: 5px;
    }
    hr.style-seven:before { /* Not really supposed to work, but does */
        display: block;
        content: "";
        height: 10px;
        margin-top: 0px;
        border-style: solid;
        border-color: rgba(0, 0, 0, 0.3);
        border-width: 0 0 1px 0;
        border-radius: 5px;
    }

    .comment-header{
        margin: 5px !important;
    }

    .comment-header .comment-by{ 
        font-size: 13px;
        font-weight: 700;
        text-decoration: underline;
        text-transform: capitalize;
        color: rgba(0, 0, 0, 0.6705882352941176);
    }

    .comment-header .comment-date{
        font-size: 11px;
        font-weight: 600;
        color: rgba(0, 0, 0, 0.68);
    }

    .comment-data{
        font-size: 13px;
        margin: 5px 5px 5px 5px;
        text-align: left;
        padding-bottom: 1px;
    }

  </style>
  
  <div class="comment-tooltip-wrapper" *ngFor="let item of updateFormComments; let i=index;">
        
        <div class="row comment-header">
              <aside class="pull-left comment-by">
                  {{updateFormCommentsBy[i]}}
              </aside>
              <aside class="pull-right comment-date">
                  {{updateFormCommentsOn[i]| date:'dd-MMM-yyyy hh:mm a'}}
              </aside>
        </div>
        <div class="row comment-data">
            {{updateFormComments[i]}}
        </div>
        <hr class="style-seven">        
    </div>
  
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})


export class CommentTooltipComponent implements OnInit {

    @Input() rowData: any;
    updateFormComments: any = [];
    updateFormCommentsBy: any = [];
    updateFormCommentsOn: any = [];

    constructor() { }

    /* OnInit function to listen the changes in message value from service */
    ngOnInit() {
        this.updateFormComments = this.rowData.comments;
        this.updateFormCommentsOn = this.rowData.commentedOn;
        this.updateFormCommentsBy = this.rowData.commentedBy;
    }


}