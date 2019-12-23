import { Component, OnInit, OnChanges, ViewChild, ElementRef, Renderer2, Input, Output, EventEmitter } from '@angular/core';
import { FetchStudentService } from '../../../services/student-services/fetch-student.service';
import { AppComponent } from '../../../app.component';
import { CommonServiceFactory } from '../../../services/common-service';
@Component({
    selector: 'partial-pay-history',
    templateUrl: './partial-pay-history.component.html',
    styleUrls: ['./partial-pay-history.component.scss']
})
export class PartialPayHistoryComponent implements OnInit, OnChanges {

    @Input() schedule_id: any;
    @Input() studentid: any[] = [];
    @Input() defaultAcadYear: any = "";

    @Output() closeHist = new EventEmitter<boolean>(false);

    studentPartialPaymentData: any = [];

    constructor(private appC: AppComponent, private fetchService: FetchStudentService,
        private _commService: CommonServiceFactory
        ) { }

    ngOnInit() {
    }

    ngOnChanges() {
        this.schedule_id;
        if (this.schedule_id != "") {
            this.getPartialPaymentHistory();
        }
    }

    getPartialPaymentHistory() {
        this.studentPartialPaymentData = [];
        this.fetchService.getStudentPartialPaymentHistory(this.studentid, this.schedule_id).subscribe(
            res => {
                this.studentPartialPaymentData = res;
            },
            err => { }
        )
    }

    download(ins) {
        let link = document.getElementById("partialHistory" + ins.invoice_no);
        this.fetchService.getFeeReceiptById(this.studentid, ins.invoice_no).subscribe(
            (res: any) => {
                let body = res;
                let byteArr = this._commService.convertBase64ToArray(body.document);
                let format = body.format;
                let fileName = body.docTitle;
                let file = new Blob([byteArr], { type: 'application/pdf' });
                let url = URL.createObjectURL(file);
                if (link.getAttribute('href') == "" || link.getAttribute('href') == null) {
                    link.setAttribute("href", url);
                    link.setAttribute("download", fileName);
                    link.click();
                }
            },
            err => {
                let msg = JSON.parse(err._body).message;
                let obj = {
                    type: 'error',
                    title: msg,
                    body: ""
                }
                this.appC.popToast(obj);
            }
        )

    }

    closeHistory() {
        this.closeHist.emit(true);
    }


}
