import { Component, OnInit } from '@angular/core';
import { AuthenticatorService } from '../../services/authenticator.service';
import { HttpService } from '../../services/http.service';



@Component({
  selector: 'app-sms-gateway',
  templateUrl: './sms-gateway.component.html',
  styleUrls: ['./sms-gateway.component.scss']
})
export class SmsGatewayComponent implements OnInit {

jsonFlag={
  institute_id:''
}
smsGatewatModel={
  gateway_name:'',
  transaction_username:'',
  transaction_password:'',
  promotional_username:'',
  promotional_password:'',
  sender_id:'',
  brand_name:'',
  is_active:''
}

allSMSData:any=[];
  constructor(private auth:AuthenticatorService,
    private _http: HttpService) { 
this.jsonFlag.institute_id = sessionStorage.getItem('institute_id')
    }

  ngOnInit(): void {
    this.getAllSmsData();
  }
getAllSmsData(){
  this.auth.showLoader();
  let url='/api/v1/institutes/sms-gateway/fetch-all/'+this.jsonFlag.institute_id;
  this._http.getData(url).subscribe(
    (res:any)=>{
      this.allSMSData = res;
      console.log("SMS DDDDDDDD",this.allSMSData)
      this.auth.hideLoader();
    }
  )

}
createSMSgateway(){
  let obj ={
    institute_id : this.jsonFlag.institute_id,
    gateway_name : this.smsGatewatModel.gateway_name,
    transaction_username : this.smsGatewatModel.transaction_username,
    transaction_password : this.smsGatewatModel.transaction_password,
    promotional_username : this.smsGatewatModel.promotional_username,
    promotional_password : this.smsGatewatModel.promotional_password,
    sender_id : this.smsGatewatModel.sender_id,
    brand_name : this.smsGatewatModel.brand_name,
    is_active : this.smsGatewatModel.is_active
  }
this.auth.showLoader();
let url = '/api/v1/institutes/sms-gateway/create';
this._http.postData(url,obj).subscribe(
  res =>{
let respect = res
  }

)
}
deleteSmsGateway(){
  this.auth.showLoader();
  let url = '/api/v1/institutes/sms-gateway/delete/'+this.jsonFlag.institute_id+'/'+this.smsGatewatModel.sender_id;
  this._http.deleteDataById(url).subscribe(
    res =>{
  let respect = res
    }
  
  )
}
updateSMSgateway(){
  let obj ={
    institute_id : this.jsonFlag.institute_id,
    gateway_name : this.smsGatewatModel.gateway_name,
    transaction_username : this.smsGatewatModel.transaction_username,
    transaction_password : this.smsGatewatModel.transaction_password,
    promotional_username : this.smsGatewatModel.promotional_username,
    promotional_password : this.smsGatewatModel.promotional_password,
    sender_id : this.smsGatewatModel.sender_id,
    brand_name : this.smsGatewatModel.brand_name,
    is_active : this.smsGatewatModel.is_active

  }
  this.auth.showLoader();
  let url = '/api/v1/institutes/sms-gateway/update/'+this.smsGatewatModel.sender_id;
  this._http.putData(url,obj).subscribe(
    res =>{
      let response = res;
    }
  )
}

}
