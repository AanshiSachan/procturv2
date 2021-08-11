import { Component, OnInit } from '@angular/core';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { MessageShowService } from '../../../services/message-show.service';
import { HttpService } from '../../../services/http.service';
import * as _ from 'lodash';


@Component({
  selector: 'app-arp-automation',
  templateUrl: './arp-automation.component.html',
  styleUrls: ['./arp-automation.component.scss']
})
export class ArpAutomationComponent implements OnInit {
  imgvarible={
    imgName:'',
    height:0,
    width:0
  

  }
  imgData:any=''
uploadedImg: any = '';
 requestForBuil:string='';
invalidEntry:any=''
tokens:any=''
newToken:any=''
Authtokens:any=''
appLogos:boolean=true
generateApk:boolean=false
selectedFile = null;
image: File;
imageModel:any
buttonVariable:string=''
currentStatusData:any=[]=[];
currentStatusTime:any=[]=[];
  constructor(private auth:AuthenticatorService,
    private _http: HttpService,private msgService: MessageShowService,
    ) {
     //this.Authtokens =sessionStorage.getItem('token')
     }

  ngOnInit(): void {
 //this.getToken()
  this.currentStatusofClient()
  this.getAllImageResourse()


  
  }
  toggler(){
    this.appLogos = true
    this.generateApk=false
  }
  toggler2(){
    this.generateApk = true
    this.appLogos = false
  }
 
  fileData: any;

 
  getToken(){
    let url ='/api/v2/user/examdesk/SSO?source=ARP'
    this.auth.showLoader()
  this._http.getData(url).subscribe(
  (res:any)=>{
    this.tokens =res;
    this.newToken=res.result;
    //sessionStorage.setItem('token',JSON.stringify(this.newToken))
    this.currentStatusofClient()
    this.getAllImageResourse()
console.log("tokennnnnnnnnn",this.tokens)
    this.auth.hideLoader();

  },
  err => {
    this.auth.hideLoader();
  
    this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err);
  
  }
  )
  }
  currentStatusofClient(){

     let Params={

    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpbnN0aXR1dGVfaWQiOjEwMDEyNiwiaWF0IjoxNjI2OTUzMjY0fQ.k2Ngi8Fvy9BXc5107Gifzv0Bf-lZkiKybRQ5tOUcpMg"
    
  }
    this.auth.showLoader();
let url ='client/requestStatus'
this._http.postARPData(url,Params).subscribe(
  (res:any)=>{
    this.currentStatusTime=res
    this.currentStatusData = res.releaseDetails
    if(res.underRelease == 1){
    this.buttonVariable = 'some entry'
    }
    if(res.underRelease == 0 && res.entry == 1){
      this.requestForBuil = 'no entry'
    }
    if(res.entry==0 ){
      this.invalidEntry ='no-entery-inARP'
    }if(res.entry == 1 && res.resources == 0){
      this.invalidEntry = 'no-image-upload'
    }
    console.log("resssssss",res)
   
    this.auth.hideLoader();
  },
  err => {
    this.auth.hideLoader();

    this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err);

  }
)
  }
  
  togglerImg(width, height, name, img){
    this.imageModel.width = width;
    this.imageModel.height = height;
    this.imageModel.name = name;
    this.uploadedImg = img;
  }
 onImageSelect(event){
 
this.selectedFile = <File>event.target.files[0]
console.log("image data",this.selectedFile)


 }


uploadHandler(){
//if(this.imagVladifation()){
  let token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpbnN0aXR1dGVfaWQiOjEwMDEyNiwiaWF0IjoxNjI2OTUzMjY0fQ.k2Ngi8Fvy9BXc5107Gifzv0Bf-lZkiKybRQ5tOUcpMg"
  const formData = new FormData();
 
  formData.append('token',token);

  if (this.selectedFile) {
    formData.append('file', this.selectedFile);
 
}
  let urlPostXlsDocument = 'http://arp3-api.proctur.com/v1/client/uploadResourceAPI'

  let newxhr = new XMLHttpRequest();
 newxhr.open("POST", urlPostXlsDocument, true);
 newxhr.setRequestHeader("Authorization", token);
 newxhr.setRequestHeader("Accept", "application/json, text/javascript");

  newxhr.setRequestHeader("enctype", "multipart/form-data;");
this.auth.showLoader();
newxhr.onreadystatechange = () => {
  this.auth.hideLoader();
  if (newxhr.status == 200 ) {
         this.msgService.showErrorMessage('success', '', 'image uploaded successfully')
         this.getAllImageResourse()
  }
}
newxhr.send(formData);

  err => {
    this.auth.hideLoader();
  
    this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err);
  
  }
  
  }
//}
  getAllImageResourse(){
    let obj={
     
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpbnN0aXR1dGVfaWQiOjEwMDEyNiwiaWF0IjoxNjI2OTUzMjY0fQ.k2Ngi8Fvy9BXc5107Gifzv0Bf-lZkiKybRQ5tOUcpMg"
  
  
      
    }
    this.auth.showLoader();
    let url ='client/getResources'
    this._http.postARPData(url,obj).subscribe(
    (res:any)=>{
      this.imgData=res
      console.log("resssssss imageeeeee", this.imgData)
   

      this.auth.hideLoader();
    },
    err => {
      this.auth.hideLoader();
    
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err);
    
    }
    )

  }
reuestBuildApk(){
  let obj={
  
    //token:this.newToken
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpbnN0aXR1dGVfaWQiOjEwMDEyNiwiaWF0IjoxNjI2OTUzMjY0fQ.k2Ngi8Fvy9BXc5107Gifzv0Bf-lZkiKybRQ5tOUcpMg"


    }
  
  this.auth.showLoader();
let url ='release/requestBuild'
this._http.postARPData(url,obj).subscribe(
(res:any)=>{
  console.log("resssssss build",res)
    this.auth.hideLoader();
    if (res.status == 200 ) {
      this.msgService.showErrorMessage('success', '', 'your request for the build of your application is successfully proceed')
      this.currentStatusofClient()
}
},
err => {
  this.auth.hideLoader();

  this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err);

}
)
}
imagVladifation(){
if(this.selectedFile.max_height <= 900 || this.selectedFile.max_width <= 900){
  this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', "Please upload file of size 900 * 900 px ");
 return;
}
return true; 
}
}

