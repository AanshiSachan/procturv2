import { Component, Input, OnInit, HostListener, ElementRef } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';

@Component({
  template: `
  
  <style>
    :host /deep/ .actions{
     max-width: 50px !important;
     min-width: 45px !important;
     height: 5em;
    }
    :host /deep/ .actions .mat-button-ripple mat-ripple{
      max-width: 40px !important;
      min-width: 20px !important;
    }
  </style>
  
  <button md-button [mdMenuTriggerFor]="menu" class="actions" mdTooltip="Click to perform an action" mdTooltipPosition="above">
    <md-icon>flash_on</md-icon></button>
    <md-menu #menu="mdMenu" class="actionmenu">
   
      <button md-menu-item mdTooltip="Update Enquiry" mdTooltipPosition="left">
        <md-icon>autorenew</md-icon>
      </button>
     
      <button md-menu-item mdTooltip="Edit Details" mdTooltipPosition="left">
       <md-icon>border_color</md-icon>
      </button>
     
      <button md-menu-item mdTooltip="Delete Enquiry" mdTooltipPosition="left">
       <md-icon>delete</md-icon>
      </button>

      <button md-menu-item mdTooltip="Convert To Student" mdTooltipPosition="left">
       <md-icon>perm_identity</md-icon>
      </button>

      <button md-menu-item mdTooltip="Pay Registration Fees" mdTooltipPosition="left">
       <md-icon>payment</md-icon>
      </button>
    </md-menu>
    `,
})

export class ActionButtonComponent implements OnInit {

  private active: boolean = false;
  constructor() { }
  ngOnInit() { }

}