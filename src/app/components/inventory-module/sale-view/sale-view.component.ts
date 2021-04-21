import { Component, OnDestroy, OnInit } from '@angular/core';
import { ExportToPdfService } from '../../../services/export-to-pdf.service';
import { ExcelService } from '../../../services/excel.service';
import { MessageShowService } from '../../../services/message-show.service';
import { HttpService } from '../../../services/http.service';
import { AuthenticatorService } from '../../../services/authenticator.service';

@Component({
  selector: 'app-sale-view',
  templateUrl: './sale-view.component.html',
  styleUrls: ['./sale-view.component.scss']
})
export class SaleViewComponent implements OnInit {

  viewDatas:any =[];
  institute_id =sessionStorage.getItem('institute_id')
  constructor(private httpService: HttpService,
    private auth: AuthenticatorService,
    private msgService: MessageShowService,
    private _pdfService: ExportToPdfService,
    private excelService: ExcelService) { }
 

  ngOnInit(): void {
   this.viewDatas =sessionStorage.getItem('viewData');
  
   console.log(this.viewDatas);
   this.getViewDataById();
  }
  DataForView=[];
getViewDataById(){
  this.auth.showLoader();
  this.httpService.getData('/api/v1/inventory/sale/' + this.viewDatas + '?instituteId=' + this.institute_id).subscribe((res: any) => {
    this.DataForView = res.result;
    this.auth.hideLoader();
  
   
  },
    err => {
      this.auth.hideLoader();
    })
}
printData(divName){
  //window.print();
  var printContents = document.getElementById(divName).innerHTML;
			var originalContents = document.body.innerHTML;

			document.body.innerHTML = printContents;

			window.print();

			document.body.innerHTML = originalContents;
}

}
