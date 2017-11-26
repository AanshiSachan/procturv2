import { Component, OnInit, HostListener, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { ViewCell } from '../../../../assets/imported_modules/ng2-smart-table';
import { PopupHandlerService } from '../../../services/enquiry-services/popup-handler.service';
import { Router } from '@angular/router';

@Component({
  template:
    /* HTML content for the rendered component with CSS style as well */
    `
  <style>

   .table-action-icon{
     max-height: 50px;
     max-width: 50px;
     background: none;
     text-decoration: none;
     outline: none;
     border: none;
   }
   .enquiry-action {
    position: relative;
    cursor: pointer;
    .cls-1,
    .cls-2 {
        fill: none;
        stroke: transparent;
    }
    svg {
        width: 18px;
    }
    .cls-2 {
        stroke: #7d7f80;
        stroke-miterlimit: 10;
    }
   }
   .action-menu{
    position: absolute;
    background: #fff;
    width: 350px;
    border-radius: 0;
    border: 1px solid #ccc;
    bottom: 0px;
    box-shadow: 0px 2px 4px 1px #ccc;
    transform: translateX(-50%);
    left: 42%;
   }
  
   .action-menu-inner ul {
    font-size: 0;
    position: relative;
    padding: 5px 5px;
   }
   .action-menu-inner ul:after {
    content: '';
    position: absolute;
    right: 0;
    left: 0;
    bottom: -15px;
    margin: auto;
    border-top: 8px solid #fff;
    border-bottom: 8px solid transparent;
    border-right: 8px solid transparent;
    border-left: 8px solid transparent;
    width: 0;
    height: 0;
   }
   .action-menu-inner ul li {
    display: inline-block;
    text-align: center;
    vertical-align: top;
    font-size: 12px;
    padding: 0 8px;
    box-sizing: border-box;
    cursor: pointer;
    width: 15%;
    &:last-child {
        width: 28%;
        svg {
            width: 33px;
        }
    }
    &.edit-detail-icon {
        svg * {
            fill: none;
            stroke: #8b8b8b;
        }
        svg .cls-1 {
            stroke: none;
    
        }
    }
    &:hover {
        .cls-2,
        .cls-3 {
            fill: none;
            stroke: $common-blue;
        }
        color: $common-blue;
    }
   }
   .action-menu-inner ul li span {
    display: block;
    font-size: 9px;
    text-align: center;
    line-height: 10px;
   }
   .action-menu-inner i {
    display: block;
    height: 32px;
    svg{
      width:28px;
    }
   }
   .action-icon{
     width: 28px;
   }
  </style>
  
  <div class="enquiry-action">

    <button class="btn table-action-icon action_button" style="outline:none;border:none;" (click)="openMenu($event)" >
    <img src="./assets/images/action_hover.svg" height="20" width="20">
    </button>
  
    <div class="action-menu" [hidden]="!showMenu" (mouseleave)="closeMenu()" (click)="closeMenu()">
  
     <div class="action-menu-inner">

      <ul>
      <li (click)="openPopup('update')">
      <img src="./assets/images/update_enquiry.svg" height="20" width="30">
       <span>
         Update <br>Enquiry
       </span>
      </li>

      <li class="edit-detail-icon" (click)="NavigateToEdit()">
        <img src="./assets/images/edit_details.svg" height="20" width="30">
        <span >
        Edit <br> Details
        </span>
      </li>
      
      <li (click)="openPopup('delete')">
        <img src="./assets/images/delete_entry.svg" height="20" width="30">
        <span>
          Delete<br>Entry
        </span>
      </li>

      <li (click)="openPopup('convert')" > 
        <img src="./assets/images/convert_student.svg" height="20" width="30">
        <span>
          Convert <br> to Student
        </span>
      </li>
      
      <li (click)="openPopup('payment')" *ngIf="isProfessional">
         <img src="./assets/images/reciept_preview.svg" height="20" width="30">
         <span>
          Pay  <br> Restistration Fees
         </span>
      </li>

      <li (click)="openPopup('sms')" >
        <img src="./assets/images/send_email.svg" height="20" width="30">
        <span>
         Send <br> SMS
        </span>
      </li>

      </ul>
      
     </div>
  
    </div>

  </div>
  `,
})


export class ActionButtonComponent implements OnInit {

  /* Variable for displayng the popUp */
  private showMenu: boolean = false;
  private isProfessional: boolean = false;
  private isActionDisabled: boolean;

  /* message to describe which popup to be opened  */
  message: string = "";

  constructor(private pops: PopupHandlerService, private router: Router) { }

  /* OnInit function to listen the changes in message value from service */
  ngOnInit() {
    this.professionalStatus();
    this.pops.currentMessage.subscribe(message => this.message = message);
    this.pops.currentActionValue.subscribe(data => this.isActionDisabled = data);

  }

  /* open action menu on click */
  openMenu(ev) {
    this.showMenu = true;
  }

  /* close action menu on events  */
  closeMenu() {
    this.showMenu = false;
  }

  /* function to determine which pop up has to be opened on parent component */
  openPopup(eventData) {
    this.pops.changeMessage(eventData);
  }

  /* if user select edit navigate him to edit page directly from here */
  NavigateToEdit() {
    this.router.navigate(['/enquiry/edit']);
  }

  professionalStatus() {
    if (sessionStorage.getItem('institute_type') === 'LANG') {
      this.isProfessional = true;
    }
    else {
      this.isProfessional = false;
    }
  }

}