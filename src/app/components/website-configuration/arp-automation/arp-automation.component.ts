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
appLogos:boolean=true
generateApk:boolean=false
fileToUpload: any;
imageName:any
  tokens : any = '';
  constructor(private auth:AuthenticatorService,
    private _http: HttpService,private msgService: MessageShowService,
    ) {
     
     }

  ngOnInit(): void {
  this.getToken()

  
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
    this.tokens =res.result;
    this.currentStatusofClient()
    console.log("tokennnnnnnnnnnnnn",this.tokens)

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
        Params : { 'token': this.tokens }
     
     
   }
    this.auth.showLoader();
let url ='client/requestStatus'
  
this._http.postARPData(url,Params).subscribe(
  (res:any)=>{
    console.log("resssssss",res)
    this.auth.hideLoader();
  },
  err => {
    this.auth.hideLoader();

    this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err);

  }
)
  }
  uploadImage(file: FileList){
    this.fileToUpload = file.item(0);
    let reader = new FileReader();

    reader.onload= (event: any) => {
     this. imageName = event.target.result;
      
    }
    reader.readAsDataURL(this.fileToUpload);
  }
postImage(){
  let obj={
    
    token:this.tokens,
  


    
  }
  this.auth.showLoader()
  let url ='/api/v1/client/uploadResourceAPI'
  this._http.postData(url,obj).subscribe(
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
      Params:{
      token:this.tokens
  
  
      }
    }
    this.auth.showLoader();
    let url ='/api/v1/client/getResources'
    this._http.postData(url,obj).subscribe(
    (res:any)=>{
      console.log("resssssss",res)
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
    Params:{
    token:this.tokens


    }
  }
  this.auth.showLoader();
let url ='/api/v1/release/requestBuild'
this._http.postData(url,obj).subscribe(
(res:any)=>{
  console.log("resssssss",res)
  this.auth.hideLoader();
},
err => {
  this.auth.hideLoader();

  this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err);

}
)
}

  
}
