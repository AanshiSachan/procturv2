import { Component, OnInit, OnChanges, Input, Output, EventEmitter, ChangeDetectorRef, ViewChild, ElementRef, HostListener, ChangeDetectionStrategy } from '@angular/core';
import { instituteInfo } from '../../../model/instituteinfo';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { Router } from '@angular/router';
import { HttpService } from '../../../services/http.service';
import { CommonServiceFactory } from '../../../services/common-service';
import { PostStudentDataService } from '../../../services/student-services/post-student-data.service';
import { role } from '../../../model/role_features';
import {ActivatedRoute} from '@angular/router'; 
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
declare var $;

@Component({
  selector: 'student-sidebar',
  templateUrl: './student-sidebar.component.html',
  styleUrls: ['./student-sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StudentSidebarComponent implements OnInit, OnChanges {



  isProfessional: boolean;
  @Input() rowData: any;
  @Input() customComponent: any;
  @Input() studentDetails: any;

  @Output() closeSide = new EventEmitter<any>();
  @Output() editStudent = new EventEmitter<any>();
  @Output() deleteStudent = new EventEmitter<any>();
  @Output() editNotes = new EventEmitter<any>();
  @Output() leaveEvent = new EventEmitter<any>();
  @Output() pdcEdit = new EventEmitter<any>();
  @Output() invEdit = new EventEmitter<any>();
  @Output() showToggleLoader = new EventEmitter<any>();
  @Output() downloadCertificate = new EventEmitter<any>();

  @Output() openCourseAssigned = new EventEmitter<boolean>();

  //@ViewChild('acc') acc: ElementRef;
  @ViewChild('one', { static: true }) one: ElementRef;
  @ViewChild('two', { static: true }) two: ElementRef;
  @ViewChild("content", { static: false }) content: ElementRef;


  @ViewChild('imgDisp', { static: true }) im: ElementRef;
  private showMenu: boolean = false;
  certificate: boolean = false;
  containerWidth: string = "50px";
  studentServerImage: any = '';
  readonly: boolean = true;
  institute_id: any;
  downloadStudentReportAccess: boolean = false;
  studdentEdit = true;
  isSubAdmin = false;
  allowEdit = false;
  role_feature = role.features;
  studentReport: boolean = false;
  conductCertificateFlag:boolean = false;

  /* Model for institute Data for fetching student enquiry */
  currRow: instituteInfo = {
    school_id: -1,
    standard_id: -1,
    batch_id: -1,
    name: "",
    is_active_status: 1,
    mobile: "",
    language_inst_status: -1,
    subject_id: -1,
    slot_id: "",
    master_course_name: "",
    course_id: -1,
  };
  isSchoolModel: boolean=false;
  awsDownloadLink:any
  charactertCertiModel={
    institute_name:'',
    inst_phone:'',
    inst_email:'',
    inst_address:'',
    stud_name:'',
    father_name:'',
    doj:'',
    sex:''
  }
  bonafiedCertiModel={
    institute_name:'',
    inst_phone:'',
    inst_email:'',
    inst_address:'',
    stud_name:'',
    father_name:'',
    doj:'',
    sex:'',
    stud_city:'',
    standard_name:'',
    section_name:'',
    reg_number:'',
    curr_date:'',
    inst_place:'',
  }
  migrationCertiModel={
    institute_name:'',
    inst_phone:'',
    inst_email:'',
    inst_address:'',
    stud_name:'',
    father_name:'',
    doj:'',
    sex:'',
    stud_city:'',
    standard_name:'',
    section_name:'',
    reg_number:'',
    curr_date:'',
    inst_place:'',
    school_board:''
  }

  constructor(
    private eRef: ElementRef,
    private auth: AuthenticatorService,
    private cd: ChangeDetectorRef,
    private router: Router,
    private _http: HttpService,
    private _commService: CommonServiceFactory,
    private PostStudService: PostStudentDataService,
    private activatedRoute : ActivatedRoute
  ) {
    this.auth.institute_type.subscribe(
      res => {
        if (res == 'LANG') {
          this.isProfessional = true;
        } else {
          this.isProfessional = false;
        }
      }
    );
    this.auth.currentInstituteId.subscribe(id => {
      this.institute_id = id;
    });

    const permissionArray = sessionStorage.getItem('permissions');
    const userType = sessionStorage.getItem('userType');

    if (userType == '0' && (permissionArray != "" && permissionArray != null)) {
      this.isSubAdmin = true;
      this.studentReport = this.role_feature.STUDENT_REPORT_CARD;
      this.allowEdit = this.role_feature.STUDENT_MANAGE;
    } else {
      this.studentReport = true;
      this.allowEdit = true;
    }
    this.auth.schoolModel.subscribe(data=>{
      this.isSchoolModel=data='true'?true:false;
      })
      
  }

  ngOnInit() {
    this.getCharacterCertificate()
    this.bonafiedCertificates()
    this.migrationCertificates()
  }

  ngOnChanges() {
    this.rowData;
    this.studentDetails;
    this.customComponent;
    this.cd.markForCheck();
    this.fetchStudentDetails(this.studentDetails);
    this.checkDownloadRoleAccess();
  }

  checkDownloadRoleAccess() {
    if (sessionStorage.getItem('downloadStudentReportAccess') == 'true') {
      this.downloadStudentReportAccess = true;
    }
  }


  emitEdit() {
    this.cd.markForCheck();
    this.editStudent.emit(this.rowData.student_id);
  }


  gotoStudentReportcard() {
    this.router.navigateByUrl("/view/students/reportcard/" + this.rowData.student_id)
  }

  gotodownloadCertificate() {
    // this.cd.markForCheck();
    this.showMenu = false;
    this.downloadCertificate.emit(this.rowData.student_id);
    // this.closeMenu();
  }

  downloadStudentReportCard() {
    this.showToggleLoader.emit(true);
    let url = '/api/v1/reports/Student/downloadReportCard/' + sessionStorage.getItem('institute_id') + '/' + this.rowData.student_id;
    this.PostStudService.stdGetData(url).subscribe(
      (res: any) => {
        console.log(res);
        this.showToggleLoader.emit(false);
        if (res) {
          if (res.document != "") {
            let byteArr = this._commService.convertBase64ToArray(res.document);
            let fileName = res.docTitle;
            let file = new Blob([byteArr], { type: 'application/pdf;charset=utf-8;' });
            let url = URL.createObjectURL(file);
            let dwldLink = document.getElementById('downloadFileClick1');
            dwldLink.setAttribute("href", url);
            dwldLink.setAttribute("download", fileName);
            document.body.appendChild(dwldLink);
            dwldLink.click();
          }
          else {
            this._commService.showErrorMessage('info', 'Info', "Document does not have any data.");
          }
        }
        else { this._commService.showErrorMessage('info', 'Info', "Document does not have any data."); }
      },
      err => {
        console.log(err);
        this._commService.showErrorMessage('info', 'Info', err.error.message);
        this.showToggleLoader.emit(false);
      })
  }

  downloadStudentIDCard() {
    this.showToggleLoader.emit(true);
    let url = '/admit-card/download';
    this.PostStudService.stdPostData(url, [this.rowData.student_id]).subscribe(
      (res: any) => {
        console.log(res);
        this.showToggleLoader.emit(false);
        if (res) {
          let resp = res.response;
          if (resp.document != "") {
            let byteArr = this._commService.convertBase64ToArray(resp.document);
            let fileName = 'card.pdf'; //res.docTitle;
            let file = new Blob([byteArr], { type: 'application/pdf;charset=utf-8;' });
            let url = URL.createObjectURL(file);
            let dwldLink = document.getElementById('downloadFileClick1');
            dwldLink.setAttribute("href", url);
            dwldLink.setAttribute("download", fileName);
            document.body.appendChild(dwldLink);
            dwldLink.click();
          }
          else {
            this._commService.showErrorMessage('info', 'Info', "Document does not have any data.");
          }
        } else {
          this._commService.showErrorMessage('info', 'Info', "Document does not have any data.");
        }
      },
      err => {
        console.log(err);
        this.showToggleLoader.emit(false);
      }
    )

  }


  emitDelete() {
    this.cd.markForCheck();
    this.deleteStudent.emit(this.rowData);
  }

  emitLeave() {
    this.cd.markForCheck();
    this.leaveEvent.emit(this.rowData.student_id);
  }

  emitEditLeave() {
    this.cd.markForCheck();
    this.pdcEdit.emit(this.rowData.student_id);
  }


  emitEditInv() {
    this.cd.markForCheck();
    this.invEdit.emit(this.rowData.student_id);
  }

  emitNotes() {
    this.cd.markForCheck();
    this.editNotes.emit(this.rowData);
  }

  closeSideBar(ev) {
    this.cd.markForCheck();
    this.closeSide.emit(null);
  }

  fetchStudentDetails(ev) {
    this.cd.markForCheck();
    if (ev.photo != '' || ev.photo != null) {
      this.studentServerImage = ev.photo;
    }
    else {
      this.studentServerImage = '';
    }

  }


  getImageFile(f) {

  }

  /* open action menu on click */
  openMenu() {
    this.cd.reattach();
    this.showMenu = !this.showMenu;
    this.cd.detectChanges();
    this.cd.detach();
  }

  /* close action menu on events  */
  closeMenu() {
    this.cd.markForCheck();
    this.showMenu = false;
  }

  toggleAccordian(id) {
    this.cd.markForCheck();
    if (id === 'one') {
      this.one.nativeElement.classList.toggle('liclosed');
      this.two.nativeElement.classList.add('liclosed');
    }
    else if (id === 'two') {
      this.two.nativeElement.classList.toggle('liclosed');
      this.one.nativeElement.classList.add('liclosed');
    }
  }



  @HostListener("document:click", ['$event'])
  onWindowClick(event) {

    if (this.eRef.nativeElement.contains(event.target)) {
    } else {
      this.cd.reattach();
      this.showMenu = false;
      this.cd.detectChanges();
      this.cd.detach();
    }
  }


  getBatchListArr(): any[] {
    this.cd.detach();
    return this.rowData.batchesAssigned ? this.rowData.batchesAssigned.split(',') : this.rowData.batchesAssigned;

  }


  editCourseAllocated() {
    this.openCourseAssigned.emit(true);
  }
id:any
  generateCertificate(){
    
    this.id = this.rowData.student_id
     sessionStorage.setItem('students_id',JSON.stringify(this.id))
    this.router.navigateByUrl("/view/students/certificates");
}
getCharacterCertificate(){
  this.auth.showLoader();
  let url ='/api/v1/certificate/'+ sessionStorage.getItem('institute_id')+'/character/'+this.rowData.student_id;
  this.PostStudService.stdGetData(url).subscribe(
    (res:any) =>{
      let resp =res.result;
      this.charactertCertiModel = resp
      this.awsDownloadLink=resp.awsDownloadLink
      console.log("character",this.charactertCertiModel)

      this.auth.hideLoader();
      if(res){
         
      
      if(resp.document != "" ){
        let docArry = this._commService.convertBase64ToArray(resp.document);
        let fileName = resp.docTitle;//response.docTitle
        let file = new Blob([docArry], { type: 'application/pdf;' });
        let urlcert =URL .createObjectURL(file);
        let downloadLink = document.getElementById('downloadFileClick1');
        downloadLink.setAttribute("href",urlcert);
        downloadLink.setAttribute("download",fileName);
        document.body.appendChild(downloadLink);
        downloadLink.click();


      }
      else {
        this._commService.showErrorMessage('info', 'Info', "Document does not have any data.");
      }
    } else {
      this._commService.showErrorMessage('info', 'Info', "Document does not have any data.");
    }
  },
  err => {
    console.log(err);
    this.showToggleLoader.emit(false);
  }
)

}
bonafiedCertificates(){
  this.auth.showLoader();
  let url ='/api/v1/certificate/'+ sessionStorage.getItem('institute_id')+'/bonafide/'+this.rowData.student_id;
  this.PostStudService.stdGetData(url).subscribe(
    (res:any) =>{
      let resp =res.result;
      this.bonafiedCertiModel = resp
      console.log("bonafied",resp)

      this.auth.hideLoader();
      if(res){
         
      
      if(resp.document != "" ){
        let docArry = this._commService.convertBase64ToArray(resp.document);
        let fileName = resp.docTitle;//response.docTitle
        let file = new Blob([docArry], { type: 'application/pdf;' });
        let urlcert =URL .createObjectURL(file);
        let downloadLink = document.getElementById('downloadFileClick1');
        downloadLink.setAttribute("href",urlcert);
        downloadLink.setAttribute("download",fileName);
        document.body.appendChild(downloadLink);
        downloadLink.click();


      }
      else {
        this._commService.showErrorMessage('info', 'Info', "Document does not have any data.");
      }
    } else {
      this._commService.showErrorMessage('info', 'Info', "Document does not have any data.");
    }
  },
  err => {
    console.log(err);
    this.showToggleLoader.emit(false);
  }
)

}
migrationCertificates(){
  this.auth.showLoader();
  let url ='/api/v1/certificate/'+ sessionStorage.getItem('institute_id')+'/migration/'+this.rowData.student_id;
  this.PostStudService.stdGetData(url).subscribe(
    (res:any) =>{
      let resp =res.result;
      console.log("migration",resp)
this.migrationCertiModel = resp
      this.auth.hideLoader();
      if(res){
         
      
      if(resp.document != "" ){
        let docArry = this._commService.convertBase64ToArray(resp.document);
        let fileName = resp.docTitle;//response.docTitle
        let file = new Blob([docArry], { type: 'application/pdf;' });
        let urlcert =URL .createObjectURL(file);
        let downloadLink = document.getElementById('downloadFileClick1');
        downloadLink.setAttribute("href",urlcert);
        downloadLink.setAttribute("download",fileName);
        document.body.appendChild(downloadLink);
        downloadLink.click();


      }
      else {
        this._commService.showErrorMessage('info', 'Info', "Document does not have any data.");
      }
    } else {
      this._commService.showErrorMessage('info', 'Info', "Document does not have any data.");
    }
  },
  err => {
    console.log(err);
    this.showToggleLoader.emit(false);
  }
)

}

viewCharacterCertificate(awsDownloadLink){
  this.auth.showLoader();
  let url ='/api/v1/certificate/'+ sessionStorage.getItem('institute_id')+'/character/'+this.rowData.student_id;
  this.PostStudService.stdGetData(url).subscribe(
    (res:any) =>{
      let resp =res.result;
      this.awsDownloadLink = resp.awsDownloadLink
      console.log("res",resp)
      console.log("link",awsDownloadLink)
      this.auth.hideLoader();
      $('#myModal1').modal('hide');

      window.open('https://docs.google.com/viewer?url=' + this.awsDownloadLink);


},
err => {
  console.log(err);
  this.auth.hideLoader();
}
)

} 
viewBonafaiedCertificate(awsDownloadLink){

  this.auth.showLoader();
  let url ='/api/v1/certificate/'+ sessionStorage.getItem('institute_id')+'/bonafide/'+this.rowData.student_id;
  this.PostStudService.stdGetData(url).subscribe(
    (res:any) =>{
      let resp =res.result;
      let awsDownloadLink = resp.awsDownloadLink
      console.log("res",resp)
      console.log("link",awsDownloadLink)
      this.auth.hideLoader();
      $('#myModal1').modal('hide');

      window.open('https://docs.google.com/viewer?url=' + awsDownloadLink);


},
err => {
  console.log(err);
  this.auth.hideLoader();
}
)

} 
viewMigrationCertificate(awsDownloadLink){

  this.auth.showLoader();
  let url ='/api/v1/certificate/'+ sessionStorage.getItem('institute_id')+'/migration/'+this.rowData.student_id;
  this.PostStudService.stdGetData(url).subscribe(
    (res:any) =>{
      let resp =res.result;
      let awsDownloadLink = resp.awsDownloadLink
      console.log("res",resp)
      console.log("link",awsDownloadLink)
      this.auth.hideLoader();
      $('#myModal1').modal('hide');

      window.open('https://docs.google.com/viewer?url=' + awsDownloadLink);


},
err => {
  console.log(err);
  this.auth.hideLoader();
}
)



}



PrintPage(){
  var divToPrint = document.getElementById("bonafiedCertificate")
  let newWin = window.open("");
  newWin.document.write(divToPrint.outerHTML);
  newWin.print();
  newWin.history.back();
  //newWin.close();
  console.log("print")
//  window.print();
}
migrationPrintPage(){
  var divToPrint2 = document.getElementById("migrationCertificate")
  let newWin = window.open("");
  newWin.document.write(divToPrint2.outerHTML);
  newWin.print();
  newWin.history.back(); 


  //newWin.close()
  console.log("print")

}
characterPrintPage(popupName){
  var divToPrint3 = document.getElementById(popupName)
  let newWinchar = window.open("");
  newWinchar.document.write(divToPrint3.outerHTML);
  newWinchar.print();
   //newWinchar.close()
  //  $('#conductCertificate').modal('hide');


  newWinchar.history.back(); 

  console.log("print")

}
CharacterConvertTopdf(){
  var data = document.getElementById('conductCertificate');  
    html2canvas(data).then(canvas => {  
      var imgWidth = 208;   
      var pageHeight = 295;    
      var imgHeight = canvas.height * imgWidth / canvas.width;  
      var heightLeft = imgHeight;  
  
      const contentDataURL = canvas.toDataURL('image/png')  
      let pdf = new jsPDF('p', 'mm', 'a4'); 
      var position = 0;  
      pdf.addImage(contentDataURL,'PNG', 0, position, imgWidth, imgHeight)  
      pdf.save('conductCertificates.pdf');  


    });

}
closePopups(){
   $('#myModal1').modal('hide');
  $('#conductCertificate').modal('hide');
  $('#bonafiedCertificate').modal('hide');
  $('#migrationCertificate').modal('hide');

}

}
