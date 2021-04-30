import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-certificates',
  templateUrl: './certificates.component.html',
  styleUrls: ['./certificates.component.scss']
})
export class CertificatesComponent implements OnInit {

  constructor(private router: Router) { }
transfer :boolean=false
bonafied:boolean=false
migration:boolean=false
character:boolean=false
transferCertificates:boolean=true

  ngOnInit(): void {
  }
transferCertificate(){
  this.transferCertificates = false
  this.transfer=true;
}
Back(){
  this.router.navigateByUrl('/view/students')
}
}
