import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthenticatorService } from './../../../services/authenticator.service';
import { HttpService } from '../../../services/http.service';
import { MessageShowService } from '../../../services/message-show.service';
import CommonUtils from './../../../utils/commonUtils'
import { AppComponent } from './../../../app.component';
import { NgForm } from '@angular/forms';




@Component({
  selector: 'app-sms-configuration',
  templateUrl: './sms-configuration.component.html',
  styleUrls: ['./sms-configuration.component.scss']
})
export class SmsConfigurationComponent implements OnInit {
  // @ViewChild('form', { static: false }) semail: any;
  @ViewChild('form', { static: false }) semail: NgForm;

  
jsonFlag={
  institute_id:''
}
smsGatewatModel={
  gateway_name:'smsjust',
  transaction_username:'',
  transaction_password:'',
  promotional_username:'',
  promotional_password:'',
  sender_id:'',
  brand_name:'',
  is_active:false,
  gateway_id:''
}
iscreated:boolean=false
allSMSData:any=[];

constructor(private auth:AuthenticatorService,
  private _http: HttpService,private msgService: MessageShowService,
  private toastCtrl: AppComponent) { 
this.jsonFlag.institute_id = sessionStorage.getItem('institute_id');

  }
  ngOnInit(): void {
this.getAllSmsData();

  }
  getAllSmsData(){
    this.auth.showLoader();
    const url = `/api/v1/institutes/sms-gateway/fetch-all/${this.jsonFlag.institute_id}`
     this._http.getData(url).subscribe(
      (res:any)=>{
        this.allSMSData = res.result;
        console.log(this.allSMSData);
        for(let i =0; i<this.allSMSData.length;i++){
          this.smsGatewatModel = this.allSMSData[i];
          this.smsGatewatModel.is_active = (this.allSMSData[i].is_active == 'Y') ? true : false; 
        }
         this.iscreated = false;
        if(this.allSMSData.length){
          this.iscreated = true;
        }
          this.auth.hideLoader();
      }, 
      err => {
        this.auth.hideLoader();
    
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err);
    
      }
    )
  
  }
  createSMSgateway(){
    if(this.validationInputs() || this.iscreated){
    let obj ={
      institute_id : this.jsonFlag.institute_id,
      gateway_name : this.smsGatewatModel.gateway_name,
      transaction_username : this.smsGatewatModel.transaction_username,
      transaction_password : this.smsGatewatModel.transaction_password,
      promotional_username : this.smsGatewatModel.transaction_username,
      promotional_password : this.smsGatewatModel.transaction_password,
      sender_id : this.smsGatewatModel.sender_id,
      brand_name : this.smsGatewatModel.brand_name,
      is_active : (this.smsGatewatModel.is_active == true) ? 'Y' :'N'
    }
    this.iscreated = true

  this.auth.showLoader();
  let url = '/api/v1/institutes/sms-gateway/create';
  this._http.postData(url,obj).subscribe(
   (res : any) =>{
     this.auth.hideLoader();
     this.getAllSmsData();
    this.msgService.showErrorMessage('success', '', "SMS configuration details added successfully");
    this.clearFun();

  },
  err => {
    this.auth.hideLoader();

    this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err.error.message);

  }
  
  )
  }
   }
 
  updateSMSgateway(){
    if(this.iscreated && this.validationInputs()){
      
    let obj ={
      institute_id : this.jsonFlag.institute_id,
      gateway_name : this.smsGatewatModel.gateway_name,
      transaction_username : this.smsGatewatModel.transaction_username,
      transaction_password : this.smsGatewatModel.transaction_password,
      promotional_username : this.smsGatewatModel.transaction_username,
      promotional_password : this.smsGatewatModel.transaction_password,
      sender_id : this.smsGatewatModel.sender_id,
      brand_name : this.smsGatewatModel.brand_name,
      is_active : (this.smsGatewatModel.is_active == true) ? 'Y' :'N'
  
    }

    this.auth.showLoader();
    const url = `/api/v1/institutes/sms-gateway/update/${this.smsGatewatModel.gateway_id}`
    this._http.putData(url,obj).subscribe(
      (res : any) =>{
        this.auth.hideLoader();
        this.clearFun()

        this.msgService.showErrorMessage('success','','SMS configuration details updated successfully');
        this.getAllSmsData()

      },
      err=>{
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err.error.message)
        this.auth.hideLoader();
      }
      
    )
  }
}

  validationInputs(){
    if(this.smsGatewatModel.transaction_username.trim() ==""){
     this.msgService.showErrorMessage(this.msgService.toastTypes.error,'','Please enter username')           
  return;
    }

    if(CommonUtils.isEmpty(this.smsGatewatModel.transaction_password)){
      let data ={
        type:"error",
        title:"",
        body:"Please enter password"
        
      }
      this.toastCtrl.popToast(data)
  return false;
      }
       
    if(CommonUtils.isEmpty(this.smsGatewatModel.sender_id)){
      let data ={
        type:"error",
        title:"",
        body:"Please enter sender id"
        
      }
      this.toastCtrl.popToast(data)
  return false;
      }
     
      if (CommonUtils.isEmpty(this.smsGatewatModel.brand_name)) {
        let data = {
          type: "error",
          title: "",
          body: "Please enter brand name"
        }
        this.toastCtrl.popToast(data);
        return false;
      }
      return true;
    }
  
   clearFun(){
      this.smsGatewatModel.gateway_name= "",
      this.smsGatewatModel.transaction_password = "";
      this.smsGatewatModel.transaction_username ="";
      this.smsGatewatModel.brand_name= "";
      this.smsGatewatModel.sender_id ="";  
    }   
}

