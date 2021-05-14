import { Component, OnInit } from '@angular/core';
import { AuthenticatorService } from './../../../services/authenticator.service';
import { HttpService } from '../../../services/http.service';
import { MessageShowService } from '../../../services/message-show.service';


@Component({
  selector: 'app-sms-configuration',
  templateUrl: './sms-configuration.component.html',
  styleUrls: ['./sms-configuration.component.scss']
})
export class SmsConfigurationComponent implements OnInit {
  
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
  is_active:'Y',
  gateway_id:''
}
iscreated:boolean=false
allSMSData:any=[];

constructor(private auth:AuthenticatorService,
  private _http: HttpService,private msgService: MessageShowService) { 
this.jsonFlag.institute_id = sessionStorage.getItem('institute_id');

  }
  ngOnInit(): void {
    // if(this.allSMSData.length){
    //   this.iscreated = true
    //   alert(this.iscreated)
    //   console.log("is value",this.allSMSData.length)

    // }else {
    //   this.iscreated = false
    //   console.log("no value",this.allSMSData.length)


    // }
this.getAllSmsData();

  }
  getAllSmsData(){
    this.auth.showLoader();
    const url = `/api/v1/institutes/sms-gateway/fetch-all/${this.jsonFlag.institute_id}`
     this._http.getData(url).subscribe(
      (res:any)=>{
        this.allSMSData = res.result;
       
        for(let i =0; i<this.allSMSData.length;i++){
         this.smsGatewatModel.gateway_id= this.allSMSData[i].gateway_id
        
        }
        if(this.allSMSData.length){
          this.iscreated = true
        }else  {
          this.iscreated = false
          
        }
        console.log("SMS DDDDDDDD",this.allSMSData.length)
        console.log("SMS DDDDDDDD",this.allSMSData)


        this.auth.hideLoader();
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
      is_active : this.smsGatewatModel.is_active
    }
    this.iscreated = true

  this.auth.showLoader();
  let url = '/api/v1/institutes/sms-gateway/create';
  this._http.postData(url,obj).subscribe(
   (res : any) =>{
     this.auth.hideLoader();
    this.msgService.showErrorMessage('success', '', "SMS Created successfully");
    this.clearFun()

  },
  err => {
    this.auth.hideLoader();

    this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err.error.message);

  }
  
  )
  }
   }
  deleteSmsGateway(){
    this.auth.showLoader();
    const url = `/api/v1/institutes/sms-gateway/delete/${this.jsonFlag.institute_id}/${this.smsGatewatModel.sender_id}`
    this._http.deleteDataById(url).subscribe(
      (res : any) =>{
        this.auth.hideLoader();
        this.msgService.showErrorMessage('success','','SMS Deleted Successfully')
    
      },
      err=>{
        this.auth.hideLoader();
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err.error.message);
  
      }
    
    ) 
  }
  updateSMSgateway(){
    if(this.iscreated){
      
    let obj ={
      institute_id : this.jsonFlag.institute_id,
      gateway_name : this.smsGatewatModel.gateway_name,
      transaction_username : this.smsGatewatModel.transaction_username,
      transaction_password : this.smsGatewatModel.transaction_password,
      promotional_username : this.smsGatewatModel.transaction_username,
      promotional_password : this.smsGatewatModel.transaction_password,
      sender_id : this.smsGatewatModel.sender_id,
      brand_name : this.smsGatewatModel.brand_name,
      is_active : this.smsGatewatModel.is_active
  
    }

    this.auth.showLoader();
    const url = `/api/v1/institutes/sms-gateway/update/${this.smsGatewatModel.gateway_id}`
    this._http.putData(url,obj).subscribe(
      (res : any) =>{
        this.auth.hideLoader();
        this.clearFun()

        this.msgService.showErrorMessage('success','','SMS Updated successfully');
      },
      err=>{
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err.error.message)
        this.auth.hideLoader();
      }
      
    )
  }
}

  validationInputs(){
    if (this.smsGatewatModel.gateway_name.trim() == '') {
  
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', 'Please Enter UserName!');
      return;
    }
    if(this.smsGatewatModel.transaction_password.trim() == ''){
      this.msgService.showErrorMessage(this.msgService.toastTypes.error,'','Please Enter Password!');
  return;
      
    }
    if(this.smsGatewatModel.sender_id.trim() == ''){
      this.msgService.showErrorMessage(this.msgService.toastTypes.error,'','Please Enter Sender id!');
  return;
      }if(this.smsGatewatModel.brand_name.trim() == ''){
        this.msgService.showErrorMessage(this.msgService.toastTypes.error,'','Please Enter brand name!');
        return;
      }
      return true;
    }
  
   clearFun(){
      // this.smsGatewatModel.gateway_name= "",
      this.smsGatewatModel.transaction_password = ""
      this.smsGatewatModel.transaction_username =""
      this.smsGatewatModel.brand_name= ""
      this.smsGatewatModel.sender_id =""
      
    }
  
   trueFlag(){
    // if(this.allSMSData.length == 0){
    //   this.iscreated = true
    //   alert(this.iscreated)
    //   console.log("no value",this.allSMSData.length)

    //   console.log("no value")
    // }else if(this.allSMSData.length != 0){
    //   this.iscreated = false
    //   console.log("no value",this.allSMSData.length)

    //   console.log("is value")

    // }
   }
}

