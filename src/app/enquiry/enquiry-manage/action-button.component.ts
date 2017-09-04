import { Component, Input, OnInit, HostListener, ElementRef} from '@angular/core';
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

    ::ng-deep .mat-menu-panel{
      max-width: 30em !important;
      overflow: visible !important;
      position: relative !important;
      left: 10em !important;
      top: -5em !important;
      box-shadow: none;
    }

    ::ng-deep .mat-menu-content{
      background: #424242;
      width: 30em;
    }

    ::ng-deep .mat-menu-item{
      width: 5em !important;
      display: inline !important;      
    }

    ::ng-deep button.mat-menu-item {
      width: 5em !important;
    }

    </style>
    


    <button md-button [mdMenuTriggerFor]="menu" class="actions">
    <md-icon>flash_on</md-icon></button>
    <md-menu #menu="mdMenu" class="actionmenu">
   
      <button md-menu-item>
        <md-icon>autorenew</md-icon>
      </button>
     
      <button md-menu-item>
       <md-icon>border_color</md-icon>
      </button>
     
      <button md-menu-item>
       <md-icon>delete</md-icon>
      </button>

      <button md-menu-item>
       <md-icon>perm_identity</md-icon>
      </button>

      <button md-menu-item>
       <md-icon>payment</md-icon>
      </button>
    </md-menu>
    `,
})

export class ActionButtonComponent implements OnInit {

  private active:boolean = false;
  constructor(){}
  ngOnInit() {}

}