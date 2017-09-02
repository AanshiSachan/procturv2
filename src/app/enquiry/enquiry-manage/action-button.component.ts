import { Component, Input, OnInit, HostListener} from '@angular/core';
import { ViewCell } from 'ng2-smart-table';

@Component({
    template: `
        <style>
          .wrap{
            width: 1rem;
            height: auto;
            color: rgba(0, 0, 0, 0.41);
          }
          .actions {
            width: 30rem;
            top: -3em;
            position: absolute;
            left: -10em;
            background:white;
            border: 1px solid;
          }
          .links{
            padding: 0 1em 0 1em;
            color: rgba(0, 0, 0, 0.66);
          }
        </style>
    
        <button class="wrap" md-icon-button (click)="clickedInside($event)">
        <md-icon>flash_on</md-icon>
          <div #action class="actions" *ngIf="active">
            <a class="links"><md-icon>autorenew</md-icon></a>
            <a class="links"><md-icon>border_color</md-icon></a>
            <a class="links"><md-icon>delete</md-icon></a>
            <a class="links"><md-icon>perm_identity</md-icon></a>
            <a class="links"><md-icon>payment</md-icon></a>                                    
          </div>
        </button>
  `,
})

export class ActionButtonComponent implements OnInit {

  private active:boolean = false;
  constructor() {}
  ngOnInit() {}

  @HostListener('document:click', ['$event']) clickedOutside($event){
    $event.preventDefault();
    $event.stopPropagation();
    this.active = false;
  }

  clickedInside($event: Event){
    $event.preventDefault();
    $event.stopPropagation();
    this.active = true;
  }

}