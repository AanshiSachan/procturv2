import { Component, OnInit } from '@angular/core';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { MessageShowService } from '../../../services/message-show.service';
import { HttpService } from '../../../services/http.service';
import { type } from 'os';

@Component({
  selector: 'app-arp-automation',
  templateUrl: './arp-automation.component.html',
  styleUrls: ['./arp-automation.component.scss']
})
export class ArpAutomationComponent implements OnInit {
  imgvarible={
    imgName:'',
  

  }
  imgData:any=''
  uploadedImg: any = '';
  requestForBuil:any='';
invalidEntry:any=''
appLogos:boolean=true
generateApk:boolean=false
fileToUpload: any;
imageName:any
selectedFile = null;
image: File;
imageModel:any
buttonVariable:any
currentStatusData:any=[]=[]
  constructor(private auth:AuthenticatorService,
    private _http: HttpService,private msgService: MessageShowService,
    ) {
     //this.tokens =JSON.parse(sessionStorage.getItem('token'))
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

  onclickTab(id){
    document.getElementById(id).click();

  }
  getToken(){
    let url ='/api/v2/user/examdesk/SSO?source=ARP'
    this.auth.showLoader()
  this._http.getData(url).subscribe(
  (res:any)=>{
    // console.log
    //this.tokens =res.result;
    this.currentStatusofClient()
  // sessionStorage.setItem('token',JSON.stringify(this.tokens))

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
    
        // token:this.tokens
       token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpbnN0aXR1dGVfaWQiOjEwMDEyNiwiaWF0IjoxNjI2OTUzMjY0fQ.k2Ngi8Fvy9BXc5107Gifzv0Bf-lZkiKybRQ5tOUcpMg"
     
  }
   
    this.auth.showLoader();
let url ='client/requestStatus'
  
this._http.postARPData(url,Params).subscribe(
  (res:any)=>{
    this.currentStatusData = res.releaseDetails
    this.buttonVariable = res.underRelease
    this.requestForBuil = res.entry
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
this.selectedFile =<File> event.target.files[0]
console.log("image data",this.selectedFile)
 }

 

uploadHandler(){
   
  let obj={
    
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpbnN0aXR1dGVfaWQiOjEwMDEyNiwiaWF0IjoxNjI2OTUzMjY0fQ.k2Ngi8Fvy9BXc5107Gifzv0Bf-lZkiKybRQ5tOUcpMg" ,
   

  }
  const formData = new FormData();
  formData.append('data',JSON.stringify(obj)) 

  formData.append('image', this.selectedFile)
  this.auth.showLoader()
  let url ='client/uploadResourceAPI'

  this._http.postARPData(url,formData).subscribe(
  (res:any)=>{
    if (res.status == 200 ) {
      this.msgService.showErrorMessage('success', '', "'image uploaded successfully");
     
      this.getAllImageResourse()
    this.auth.hideLoader();
    }
 
  },
  err => {
    this.auth.hideLoader();
  
    this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err);
  
  }
  )
  }
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
      // if (this.imgvarible.imgName == ' icon_48_url') {
      //   this.togglerImg(' icon_48_url','48', '48', this.imageModel. icon_48_url);
      // } else if (this.imgvarible.imgName == 'icon_96_url') {
      //   this.togglerImg('icon_96_url', '96', '96', this.imageModel.icon_96_url);
      // } else if (this.imgvarible.imgName== 'icon_144_url') {
      //   this.togglerImg('icon_144_url', '144', '144',  this.imageModel.icon_144_url);
      // } else if (this.imgvarible.imgName== 'icon_192_url') {
      //   this.togglerImg('icon_192_url', '192', '192',  this.imageModel.icon_192_url);
      // } else if (this.imgvarible.imgName== 'icon_512_url') {
      //   this.togglerImg('icon_512_url', '512', '512',  this.imageModel.icon_512_url);
      // } else if (this.imgvarible.imgName== 'icon_420_url') {
      //   this.togglerImg('icon_420_url', '420', '420',  this.imageModel.icon_420_url);
      // }  else if (this.imgvarible.imgName== 'splash_url') {
      //   this.togglerImg('splash_url', '1025 ', '500',  this.imageModel.splash_url);
      // }else if (this.imgvarible.imgName== 'banner_url') {
      //   this.togglerImg('banner_url', '1800  ', '900 ',  this.imageModel.banner_url);
      // }
     

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
  
    token:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpbnN0aXR1dGVfaWQiOjEwMDEyNiwiaWF0IjoxNjI2OTUzMjY0fQ.k2Ngi8Fvy9BXc5107Gifzv0Bf-lZkiKybRQ5tOUcpMg"


    }
  
  this.auth.showLoader();
let url ='release/requestBuild'
this._http.postARPData(url,obj).subscribe(
(res:any)=>{
  console.log("resssssss build",res)
  if(res.status==400){
    this.invalidEntry ='no-entery'
        }
  this.auth.hideLoader();
},
err => {
  this.auth.hideLoader();

  this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err);

}
)
}

  
}
