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
bagColor:any=''
fileToUpload: any;
imageName:any
  private token : string 
  constructor(private auth:AuthenticatorService,
    private _http: HttpService,private msgService: MessageShowService,
    ) {
     
     }

  ngOnInit(): void {
  
   // this.currentStatusofClient()
    this.token = sessionStorage.getItem('token')
    console.log("tokennnnnnnnnnn",this.token)
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
  uploadImage(file: FileList){
    this.fileToUpload = file.item(0);
    let reader = new FileReader();

    reader.onload= (event: any) => {
     this. imageName = event.target.result;
      console.log("imageeeeeeee",this.bagColor)
      this.bagColor
    }
    reader.readAsDataURL(this.fileToUpload);
  }
postImage(){
  let obj={
    
    token:this.token,
    url_column:this.imageName,
    file :this.bagColor


    
  }
  this.auth.showLoader()
  let url ='/api/v1/client/uploadResourceAPI'+this.token
  this._http.postData(obj,url).subscribe(
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
      token:this.token
  
  
      }
    }
    this.auth.showLoader();
    let url ='/api/v1/client/getResources'+this.token
    this._http.postData(obj,url).subscribe(
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
    token:this.token


    }
  }
  this.auth.showLoader();
let url ='/api/v1/release/requestBuild'+this.token
this._http.postData(obj,url).subscribe(
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

  currentStatusofClient(){
    let obj={
      Params:{
      token:this.token


      }
    }
    this.auth.showLoader();
let url ='/api/v1/client/requestStatus'+this.token
this._http.postData(obj,url).subscribe(
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
