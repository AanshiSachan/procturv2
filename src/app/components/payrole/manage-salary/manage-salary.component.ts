import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../../../services/http.service';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { MessageShowService } from '../../../services/message-show.service';
import { ExportToPdfService } from '../../../services/export-to-pdf.service';
import { ExcelService } from '../../../services/excel.service';

@Component({
  selector: 'app-manage-salary',
  templateUrl: './manage-salary.component.html',
  styleUrls: ['./manage-salary.component.scss']
})
export class ManageSalaryComponent implements OnInit {
jsonFlag={
  institute_id:''
}
teacherList:any=[]
  constructor( private router: Router,
    private http: HttpService, 
    private auth :AuthenticatorService,
    private msgToast :MessageShowService,
    private pdf :ExportToPdfService,
    private excel :ExcelService,) { 
      this.jsonFlag.institute_id = sessionStorage.getItem('institute_id')
      //this.template_id = sessionStorage.getItem('id')
    }
  ngOnInit(): void {
    this.getAllUserRol();
  }

  onclickView(){
    this.router.navigateByUrl('/view/payrole/view-manage-template')
  }
  getAllUserRol(){
    this.auth.showLoader();
    const url = `/api/v1/roleApi/allRoles//${this.jsonFlag.institute_id}`;
this.http.getData(url).subscribe(
  (res:any)=>{
this.teacherList = res;
console.log("teacherlisttttttt",this.teacherList)
this.auth.hideLoader()
  }
)
  }
}
