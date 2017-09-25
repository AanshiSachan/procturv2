import { Component, OnInit, ApplicationRef, ChangeDetectorRef, Optional} from '@angular/core';
import {NgbModal, NgbModalOptions, NgbActiveModal,  ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-enquiry-confirm-modal',
  templateUrl: './enquiry-confirm-modal.component.html',
  styleUrls: ['./enquiry-confirm-modal.component.scss']
})
export class EnquiryConfirmModalComponent implements OnInit {

  constructor(@Optional()public activeModal: NgbActiveModal, public changeRef: ChangeDetectorRef) { }

  ngOnInit() {
    
  }

}
