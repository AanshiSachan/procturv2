import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageShowService } from '../../../services/message-show.service';
import { HttpService  } from '../../../services/http.service';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { NgForm } from '@angular/forms';
declare var $;
@Component({
  selector: 'app-item-cm',
  templateUrl: './item-cm.component.html',
  styleUrls: ['./item-cm.component.scss']
})
export class ItemCmComponent implements OnInit {
  jsonFlag = {
   isProfessional: false,
    institute_id: sessionStorage.getItem('institute_id')
  };
  
  category_model={
  category_name:'',
  desc:'',
  institution_id:this.jsonFlag.institute_id
 }
 url = `/api/v1/inventory/`;
 type: string = '';
 activeSession: any = 'onev';
 categoryAllData:any=[];
  constructor(private msgService: MessageShowService,
    private httpService: HttpService,
    private auth:AuthenticatorService) { 
      this.jsonFlag.institute_id = sessionStorage.getItem('institution_id');
   }

  ngOnInit(): void {
   // $('#addPayeeModal').modal('show');
    this.getCategoryDetails();
    // if(this.isEditPayee){
    //   this.setEditValues();
    // }
  }
  
  toggle(id) {
    this.activeSession = id;
  
  }
  getCategoryDetails(){
   this.auth.showLoader();
    this.httpService.getData(this.url + 'category/all/'+this.jsonFlag.institute_id).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.categoryAllData =res.result.response
      },
      err => {
        this.auth.hideLoader();
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err);
      }
    )
  }
  @ViewChild('catForm', { static: false }) catForm: NgForm;
  saveCategoryDetails(){
if(this.catForm.valid){
  this.auth.showLoader();
  this.httpService.postData(this.url + 'category/',this.category_model).subscribe(
    (res: any) => {
      $('#addModal').modal('hide');
     this.auth.hideLoader();
     this.getCategoryDetails();
      if(res.statusCode == 200){
        this.msgService.showErrorMessage(this.msgService.toastTypes.success, '', 'Category added successfully');
      }
    },
    err => {
      this.auth.hideLoader();
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err.error.message);
    }
  )
}
else{
  this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', 'Category name is mandatory'); 
}
   
  }
}
