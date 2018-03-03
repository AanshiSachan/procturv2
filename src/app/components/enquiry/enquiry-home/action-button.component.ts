import { Component, OnInit, OnChanges, HostListener, ElementRef, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef, Renderer2} from '@angular/core';
import { ViewCell } from '../../../../assets/imported_modules/ng2-smart-table';
import { PopupHandlerService } from '../../../services/enquiry-services/popup-handler.service';
import { Router } from '@angular/router';

@Component({
  selector: 'enquiry-actions',
  templateUrl: './action-button.component.html',
  styleUrls: ['./action-button.component.scss'],
})



export class ActionButtonComponent implements OnInit, OnChanges {

  /* Variable for displayng the popUp */
  private showMenu: boolean = false;
  private isProfessional: boolean = false;
  private isActionDisabled: boolean;
  hasStudentAccess: boolean = false;
  @Input() rowData: any;
  /* message to describe which popup to be opened  */
  message: string = "";

  @Output() eventSelected = new EventEmitter<string>();

  constructor(private pops: PopupHandlerService, private router: Router, private cd: ChangeDetectorRef, private renderer: Renderer2, private eRef: ElementRef) { }

  /* OnInit function to listen the changes in message value from service */
  ngOnInit() { }

  ngOnChanges() {
    this.rowData;
    this.professionalStatus();
    this.pops.currentMessage.subscribe(message => this.message = message);
    this.pops.currentActionValue.subscribe(data => this.isActionDisabled = data);
    let permissions: any[] = [];
    this.setRoleAccess();
    this.cd.markForCheck();
  }

  /* open action menu on click */
  openMenu(ev) {
    this.showMenu = !this.showMenu;
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
    this.router.navigate(['/enquiry/edit/' +this.rowData.institute_enquiry_id ]);
  }

  professionalStatus() {
    if (sessionStorage.getItem('institute_type') === 'LANG') {
      this.isProfessional = true;
    }
    else {
      this.isProfessional = false;
    }
  }

  setRoleAccess() {
    if (sessionStorage.getItem('permissions') == null || sessionStorage.getItem('permissions') == undefined || sessionStorage.getItem('permissions') == '') {
      this.hasStudentAccess = true;
    }
    else {
      let permissions: any[] = [];
      permissions = JSON.parse(sessionStorage.getItem('permissions'));
      if (permissions.includes('301')) {
        this.hasStudentAccess = true;
      }
      else {
        this.hasStudentAccess = false;
      }
    }
  }


  @HostListener("document:click", ['$event'])
  onWindowClick(event) {
    if(this.eRef.nativeElement.contains(event.target)) {
    } else {
      this.showMenu = false;
    }
  }

}