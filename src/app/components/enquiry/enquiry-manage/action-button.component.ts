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
  
    <div class="action-menu" *ngIf="showMenu" (mouseleave)="closeMenu()" (click)="closeMenu()">
  
     <div class="action-menu-inner">

      <ul>
        
      <li (click)="openPopup('update')">
              <i>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="11716 358 26 22" class="action-icon">
                  <g id="Group_1238" data-name="Group 1238" transform="translate(10862 -6)">
                      <rect id="Rectangle_393" data-name="Rectangle 393" class="cls-1" width="26" height="22" transform="translate(854 364)" style="stroke:none;"/>
                      <g id="Group_791" data-name="Group 791" transform="translate(857 365)">
                      <path id="Path_210" data-name="Path 210" class="cls-2" d="M3.6,3.7l3,.263L6.334,6.907" transform="translate(-2.195 -2.269)"/>
                      <path id="Path_211" data-name="Path 211" class="cls-2" d="M13,1.673A10.094,10.094,0,0,1,24.355,4.512,10,10,0,0,1,23.146,18.6" transform="translate(-6.653 -0.978)"/>
                      <path id="Path_212" data-name="Path 212" class="cls-2" d="M14.634,21.811A9.994,9.994,0,0,1,4.488,4.883L5.276,4.2" transform="translate(-0.927 -2.506)"/>
                      <path id="Path_213" data-name="Path 213" class="cls-2" d="M33.7,33.407l-3-.263.263-2.944" transform="translate(-15.048 -14.838)"/>
                      <line id="Line_157" data-name="Line 157" class="cls-2" x1="0.789" y2="0.683" transform="translate(15.652 17.623)"/>
                      </g>
                  </g>
                </svg>    
              </i>
              <span>
                  Update <br>Enquiry
              </span>
      </li>

      <li class="edit-detail-icon" (click)="NavigateToEdit()">
              <i>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="11778 358 26 22" class="action-icon">
                    <g id="Group_1234" data-name="Group 1234" transform="translate(10862 -6)">
                    <rect id="Rectangle_697" data-name="Rectangle 697" class="cls-1" width="26" height="22" transform="translate(916 364)" style="stroke:none;"></rect>
                    <g id="Group_1126" data-name="Group 1126" transform="translate(-0.478 -0.386)">
                    <path id="Path_215" data-name="Path 215" class="cls-2" d="M0,0H17.753" transform="translate(920.478 385.386)"></path>
                    <path id="Path_214" data-name="Path 214" style="stroke:#0060a3" class="cls-3" d="M8.492,16.068,3,17.621l1.553-5.492,10.6-10.6a1.877,1.877,0,0,1,2.718,0L19.089,2.7a1.877,1.877,0,0,1,0,2.718Z" transform="translate(919.142 364.436)"></path>
                    <line id="Line_159" data-name="Line 159" class="cls-3" x1="3.883" y1="3.883" transform="translate(932.738 367.578)"></line>
                    </g>
                    </g>
                    </svg>           
              </i>
              <span >
                  Edit <br> Details
              </span>
      </li>
      
      <li (click)="openPopup('delete')">
        <i>
           <svg xmlns="http://www.w3.org/2000/svg" viewBox="11841 358 26 22" class="action-icon">
            <g id="Group_1237" data-name="Group 1237" transform="translate(10862 -6)">
                      <rect id="Rectangle_698" data-name="Rectangle 698" class="cls-1" width="26" height="22" transform="translate(979 364)" style="stroke:none;"/>
                      <g id="Group_795" data-name="Group 795" transform="translate(981 365)">
                      <path id="Path_216" data-name="Path 216" class="cls-2" d="M20.294,6V20.706a2.36,2.36,0,0,1-2.353,2.353H7.353A2.36,2.36,0,0,1,5,20.706V6" transform="translate(-2.059 -3.059)"/>
                      <line id="Line_160" data-name="Line 160" class="cls-2" x2="21.176" transform="translate(0 2.941)"/>
                      <path id="Path_217" data-name="Path 217" class="cls-2" d="M19.059,3.941H12V2.176A1.18,1.18,0,0,1,13.176,1h4.706a1.18,1.18,0,0,1,1.176,1.176Z" transform="translate(-4.941 -1)"/>
                      <line id="Line_161" data-name="Line 161" class="cls-2" y2="11.176" transform="translate(10.588 5.882)"/>
                      <line id="Line_162" data-name="Line 162" class="cls-2" y2="11.176" transform="translate(14.118 5.882)"/>
                      <line id="Line_163" data-name="Line 163" class="cls-2" y2="11.176" transform="translate(7.059 5.882)"/>
                      </g>
            </g>
           </svg>
        </i>
        <span>
          Delete<br>Entry
        </span>
      </li>

      <li (click)="openPopup('convert')" >
        <i>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="11900 358 26 22" class="action-icon">
           <g id="Group_1235" data-name="Group 1235" transform="translate(10862 -6)">
           <rect id="Rectangle_699" data-name="Rectangle 699" class="cls-1" width="26" height="22" transform="translate(1038 364)" style="stroke:none;"/>
           <g id="Group_943" data-name="Group 943" transform="translate(-10894.121 -490.387)">
           <g id="Group_796" data-name="Group 796" transform="translate(11935.121 855.387)">
           <path id="Path_219" data-name="Path 219" class="cls-2" d="M14.084,14.529c-1.647,0-3.588-1.824-4.353-4.412-.647,0-1.176-.765-1.235-1.647a1.765,1.765,0,0,1,.882-1.824C9.555,3.118,10.555,1,14.084,1s4.529,2.118,4.706,5.647c.588.118.941.882.882,1.824s-.588,1.647-1.235,1.647C17.673,12.706,15.731,14.529,14.084,14.529Z" transform="translate(-4.084 -1)"/>
           <path id="Path_220" data-name="Path 220" class="cls-2" d="M14.529,20.5C18.294,21.382,21,23.324,21,27.265a25.487,25.487,0,0,1-10,1.765A25.487,25.487,0,0,1,1,27.265c0-3.941,2.706-5.882,6.471-6.765" transform="translate(-1 -9.029)"/>
           </g>
           <path id="Path_218" data-name="Path 218" class="cls-2" d="M.7,2.181,2.181,3.663,5.144.7" transform="translate(11946.088 868.81)"/>
           </g>
           </g>
          </svg>
        </i>
        <span>
          Convert <br> to Student
        </span>
      </li>
      
      <li (click)="openPopup('payment')" *ngIf="isProfessional">
        <i>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="11966 358 26 22" class="action-icon">
            <g id="Group_1236" data-name="Group 1236" transform="translate(10862 -6)">            
              <rect id="Rectangle_700" data-name="Rectangle 700" class="cls-1" width="26" height="22" transform="translate(1104 364)" style="stroke:none;"/>
              <g id="Group_946" data-name="Group 946" transform="translate(1128 368) rotate(90)">
               <g id="Group_1233" data-name="Group 1233">
                 <path id="Path_239" data-name="Path 239" class="cls-2" d="M17,38.4v-.755s1.277-.83,1.277-1.887V35" transform="translate(-9.191 -21.169)"/>
                 <path id="Path_240" data-name="Path 240" class="cls-2" d="M4.553,22l-1.7,1.132c-.6.491-.851.755-.851,1.51V30.3" transform="translate(-0.574 -13.075)"/>
                 <path id="Path_241" data-name="Path 241" class="cls-2" d="M1,47.773V44H8.66v3.773" transform="translate(0 -26.773)"/>
                 <path id="Path_242" data-name="Path 242" class="cls-2" d="M8,11.944V1h8.936V13.831H10.553" transform="translate(-4.021)"/>
                 <path id="Path_243" data-name="Path 243" class="cls-2" d="M14.553,14.812h1.7a1.189,1.189,0,0,1,1.277-1.132V6.132A1.189,1.189,0,0,1,16.255,5H13.277A1.189,1.189,0,0,1,12,6.132v5.661" transform="translate(-6.319 -2.49)"/>
                 <ellipse id="Ellipse_21" data-name="Ellipse 21" class="cls-2" cx="1.489" cy="1.321" rx="1.489" ry="1.321" transform="translate(6.957 5.906)"/>
                 <path id="Path_244" data-name="Path 244" class="cls-2" d="M6,26.762l3.4-3.019c.766-.679,2,1.019,1.064,2.076L9.4,26.762v1.132A1.534,1.534,0,0,1,7.7,29.4" transform="translate(-2.872 -14.063)"/>
               </g>
              </g>
            </g>
          </svg>
        </i>
         <span>
          Pay  <br> Restistration Fees
         </span>
      </li>

      <li (click)="openPopup('sms')" >
        <i>
         <svg xmlns="http://www.w3.org/2000/svg" viewBox="14181 435 26 22" class="action-icon">
          <g id="Group_1232" data-name="Group 1232" transform="translate(13654 -6)">
           <rect id="Rectangle_694" data-name="Rectangle 694" class="cls-1" width="26" height="22" transform="translate(527 441)" style="stroke:none;"/>
           <g id="Symbol_11_6" data-name="Symbol 11 – 6" transform="translate(-205 -24)">
             <g id="Group_656" data-name="Group 656" transform="translate(736 466)">
               <path id="Path_171" data-name="Path 171" class="cls-2" d="M13,25.348a5.884,5.884,0,0,1-2.87.87,5.884,5.884,0,0,1-2.87-.87C6.783,25.087,1,21,1,21v9.13a1.281,1.281,0,0,0,1.3,1.3H17.957a1.281,1.281,0,0,0,1.3-1.3V21S13.478,25.087,13,25.348Z" transform="translate(-1 -11.435)"/>
               <line id="Line_131" data-name="Line 131" class="cls-2" x2="4.348" y2="4.348" transform="translate(12.457 14.348)"/>
               <line id="Line_132" data-name="Line 132" class="cls-2" x1="4.348" y2="4.348" transform="translate(1.78 14.348)"/>
               <path id="Path_172" data-name="Path 172" class="cls-2" d="M39.043,16.2v-.435a1.489,1.489,0,0,0-.652-1.174L36,12.5" transform="translate(-20.429 -7)"/>
               <path id="Path_173" data-name="Path 173" class="cls-2" d="M1,16.2v-.435a1.489,1.489,0,0,1,.652-1.174L4.043,12.5" transform="translate(-1 -7)"/>
               <path id="Path_174" data-name="Path 174" class="cls-2" d="M37.3,3.174h2.174V2.739A1.717,1.717,0,0,0,37.739,1H36" transform="translate(-20.429 -1)"/>
               <path id="Path_175" data-name="Path 175" class="cls-2" d="M8,11.87v-8.7A2.153,2.153,0,0,1,10.174,1H22.348a2.153,2.153,0,0,0-2.174,2.174v8.7" transform="translate(-4.886 -1)"/>
               <line id="Line_133" data-name="Line 133" class="cls-2" x2="7.118" transform="translate(5.784 4.304)"/>
               <line id="Line_134" data-name="Line 134" class="cls-2" x2="7.118" transform="translate(5.784 6.696)"/>
               <line id="Line_135" data-name="Line 135" class="cls-2" x2="4.36" transform="translate(5.784 9.087)"/>
             </g>
           </g>
          </g> 
         </svg>
        </i>
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
        if(sessionStorage.getItem('institute_type') === 'LANG'){
            this.isProfessional = true;
        }

        this.pops.currentMessage.subscribe(message => this.message = message);
        this.pops.currentActionValue.subscribe(data => this.isActionDisabled = data);
    }

    /* open action menu on click */
    openMenu(ev) {
        this.showMenu = true;
    }

    /* close action menu on events  */
    closeMenu() { this.showMenu = false; }

    /* function to determine which pop up has to be opened on parent component */
    openPopup(eventData) {
      this.pops.changeMessage(eventData);
    }

    /* if user select edit navigate him to edit page directly from here */
    NavigateToEdit() {
        this.router.navigate(['/enquiry/edit']);
    }
}