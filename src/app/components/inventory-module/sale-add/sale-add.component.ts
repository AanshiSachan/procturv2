import { Component, OnInit } from '@angular/core';
import { ExportToPdfService } from '../../../services/export-to-pdf.service';
import { ExcelService } from '../../../services/excel.service';
import { MessageShowService } from '../../../services/message-show.service';
import { HttpService } from '../../../services/http.service';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { RoleService } from '../../../services/user-management/role.service';

import * as moment from 'moment';
import { NgForm } from '@angular/forms';
import { ElementSchemaRegistry } from '@angular/compiler';
declare var $;
@Component({
  selector: 'app-sale-add',
  templateUrl: './sale-add.component.html',
  styleUrls: ['./sale-add.component.scss']
})
export class SaleAddComponent implements OnInit {
  institution_id=sessionStorage.getItem('institution_id');
  roleAllData=[];
  constructor(private httpService: HttpService,
    private auth: AuthenticatorService,
    private msgService: MessageShowService,
    private _pdfService: ExportToPdfService,
    private excelService: ExcelService,
    private apiService: RoleService,) {
    this.institution_id = sessionStorage.getItem('institution_id')
  }

  ngOnInit(): void {
    this.getAllRoles();
    this.getCategoryDetails();
  }
  model={
    purchase_date:'',
    bill_image_url:'',
    description:'',
  }
getAllRoles(){
  //this.auth.showLoader();
  this.httpService.getData('/api/v1/roleApi/allRoles/100058').subscribe((res: any) => {
    this.roleAllData = res;
    this.auth.hideLoader();
  },
  err =>{
    this.msgService.showErrorMessage(this.msgService.toastTypes.error, '',err.error.message);
     }   )
 
}
userALLdata=[];
getUserAgainstRole(role_id){
  console.log(role_id)
  this.httpService.getData('/api/v1/profiles/' + this.institution_id + '/user-by-type?type=3').subscribe(
    (res: any) => {
     this.userALLdata = res.active_users;
     console.log(this.userALLdata)
    },
    err => {
      this.auth.hideLoader();
    }
  );
}
validateFutureDate() {
  let today = moment(new Date());
  let selected = moment(this.model.purchase_date);
  let differ = today.diff(selected, 'days');
  if (differ <= 0) {
    this.msgService.showErrorMessage(this.msgService.toastTypes.info, '', "Purchase date is greter than today's date ");
    this.model.purchase_date = moment(new Date()).format('YYYY-MM-DD');
  }

  return true;
}
categoryAllData=[];
getCategoryDetails() {
  //this.auth.showLoader();
  this.httpService.getData('/api/v1/inventory/category/all/' + this.institution_id).subscribe(
    (res: any) => {
      this.auth.hideLoader();
      this.categoryAllData =res;
     
    },
    err => {
      this.auth.hideLoader();
    }
  );
}
itemAllData=[];
itemsForIterate=[];
itemArray=[];
getItemAgainstCat(category_id){
  this.httpService.getData('/api/v1/inventory/item/getItemsByCategory/'+this.institution_id + '?category_id_list='+category_id).subscribe(
    (res: any) => {
      this.auth.hideLoader();
      this.itemAllData = res.result;
console.log( this.itemAllData);
this.itemAllData.forEach(element => {
  if (element && element.categoryId === category_id) {
    this.itemArray = element.items;
    console.log(this.itemArray);

  }
});

   },
    err => {
      this.auth.hideLoader();
    }
  );

}
}
