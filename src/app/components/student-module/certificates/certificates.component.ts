import { Component, Input, OnInit,OnChanges } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-certificates',
  templateUrl: './certificates.component.html',
  styleUrls: ['./certificates.component.scss']
})
export class CertificatesComponent implements OnInit,OnChanges {

  @Input() rowData: any;

  constructor(private router: Router) { }
transfer :boolean=false
transferCertificates:boolean=true

  ngOnInit(): void {
    this.rowData.student_id
    console.log("aaaaaaaaaaaa",this.rowData.student_id)
  }
  ngOnChanges() {
    this.rowData;
  }
transferCertificate(){
  this.transferCertificates = false
  this.transfer=true;
}
Back(){
  this.router.navigateByUrl('/view/students')
}
getTransferData(){

}
}
