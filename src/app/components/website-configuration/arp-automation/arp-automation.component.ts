import { Component, OnInit } from '@angular/core';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { MessageShowService } from '../../../services/message-show.service';
import { HttpService } from '../../../services/http.service';

@Component({
  selector: 'app-arp-automation',
  templateUrl: './arp-automation.component.html',
  styleUrls: ['./arp-automation.component.scss']
})
export class ArpAutomationComponent implements OnInit {
  imgvarible={
    imgName:''

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
 // this.getAllImageResourse()
  // this.reuestBuildApk()
  this.togglerImg('logoImage', '200', '50',  this.imgData.logo_url);


  
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
    this.requestForBuil = res.underRelease
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
    this.imgData.width = width;
    this.imgData.height = height;
    this.imgData.name = name;
    this.uploadedImg = img;
  }
 onImageSelect(event){
this.selectedFile = event.target.file[0]
 }

uploadHandler(){
  
  const formData = new FormData();
  formData.append('imageName', this.imageName);
  formData.append('image', this.selectedFile)

   


  let obj={
    
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpbnN0aXR1dGVfaWQiOjEwMDEyNiwiaWF0IjoxNjI2OTUzMjY0fQ.k2Ngi8Fvy9BXc5107Gifzv0Bf-lZkiKybRQ5tOUcpMg",
  
  
      
    

    
  }
  this.auth.showLoader()
  let url ='client/uploadResourceAPI'
  // let newxhr = new XMLHttpRequest();
  // newxhr.onreadystatechange = () => {
  //   this.auth.hideLoader();
  //     if (newxhr.status == 200 ) {
  //       let msg = this.imgvarible.imgName.concat(' image uploaded successfully');
  //       this.msgService.showErrorMessage(this.msgService.toastTypes.success, '', msg);
        
  //       this.getAllImageResourse();
  //     } else {
  //       this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', JSON.parse(newxhr.response).message);
  //     }
    
  // }
  this._http.postARPData(url,obj).subscribe(
  (res:any)=>{
    console.log("resssssss",res)
    this.auth.hideLoader();
    console.log("object",obj)
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
     if(this.imgvarible.imgName == 'icon_48_filename'){
       this.imgData.imgFileName  = res.icon_48_filename
     }

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
