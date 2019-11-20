import { Component, OnInit } from '@angular/core';
import {DomSanitizer,SafeResourceUrl,} from '@angular/platform-browser';

@Component({
  selector: 'app-training-video',
  templateUrl: './training-video.component.html',
  styleUrls: ['./training-video.component.scss']
})
export class TrainingVideoComponent implements OnInit {

  viewMoreText: string = "";
  viewMoreList: any[] = [
    "This Video will help you to how to login using credentials and understand about overall features of Proctur ERP",
    "Based on the institute type you can set up your proctur account",
    "Based on the institute type you can set up your proctur account",
    "This Video will help you to set custom conditions on activities/cases like SMS,Exam report,Fee,Report,Miscellaneous ",
    "Understand How to upload bulk enquiries with Single Click and also how to view the status of the upload done",
    "Understand How to create custom type of users and assign roles to them",
    "",
    "This video will help you to send custom messages to active students/faculties/alumni/inactive students",
    "",
    "This Video will help you understand how to handle enquiries and how to follow up with them",
    "",
    "",
    "This Video will guide you to understand how to update fee payment in proctur",
    "This Video will guide you to understand how to change fee payment details in proctur",
    "With this video understand how to collect fee payment via cheque/post dated cheque",
    "",
    "",
    "",
    "",
    "",
    "",
    "This video will guide you to how to convert active Students to alumni and how to delete courses"
  ];

  videoplayer: boolean = false;
  currentProjectUrl: any;


  constructor(
    public sanitizer:DomSanitizer
  ) { }

  ngOnInit() {
  }

  showVideo(url){
    this.videoplayer = true;
    this.currentProjectUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  viewMore(id){
    this.viewMoreText = this.viewMoreList[id]
  }

  closePlayer(){
    this.videoplayer = false;
  }
}
