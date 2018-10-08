import { Component, OnInit, OnChanges, ViewChild, ElementRef, Renderer2, Input, Output, EventEmitter } from '@angular/core';
import { FetchStudentService } from '../../../services/student-services/fetch-student.service';
import { AppComponent } from '../../../app.component';
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

    constructor(private appC: AppComponent, private fetchService: FetchStudentService) { }

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
        console.log(ins)
        let yr: any = ins.financial_year;
        let link = document.getElementById("partialHistory" + ins.invoice_no);

        if (ins.financial_year == null) {
            ins.financial_year = this.defaultAcadYear
        }

        this.fetchService.getFeeReceiptById(this.studentid, ins.invoice_no, yr).subscribe(
            (res: any) => {
                let body = res;
                let byteArr = this.convertBase64ToArray(body.document);
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

    /* Converts base64 string into a byte[] */
    convertBase64ToArray(val) {

        var binary_string = window.atob(val);
        var len = binary_string.length;
        var bytes = new Uint8Array(len);
        for (var i = 0; i < len; i++) {
            bytes[i] = binary_string.charCodeAt(i);
        }
        return bytes.buffer;

    }

}
