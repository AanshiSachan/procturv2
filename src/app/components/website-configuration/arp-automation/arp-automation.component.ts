import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-arp-automation',
  templateUrl: './arp-automation.component.html',
  styleUrls: ['./arp-automation.component.scss']
})
export class ArpAutomationComponent implements OnInit {
appLogos:boolean=false
generateApk:boolean=false
headerSetting: any;
  tableSetting: any;
  rowColumns: any;
  constructor() { }

  ngOnInit(): void {
    this.setTableData()
  }
  toggler(){
    this.appLogos = true
    this.generateApk=false
  }
  toggler2(){
    this.generateApk = true
    this.appLogos = false
  }
  setTableData() {
    this.headerSetting = [
      {
        primary_key: 'Sr.No',
        value: "Sr.No",
        charactLimit: 10,
        sorting: true,
        visibility: true
      },
      {
        primary_key: 'Version',
        value: "Version",
        charactLimit: 25,
        sorting: true,
        visibility: true
      },
      {
        primary_key: 'Package Name',
        value: "Package Name",
        charactLimit: 25,
        sorting: false,
        visibility: true
      },
      {
        primary_key: 'Request Time',
        value: "Request Time",
        charactLimit: 25,
        sorting: false,
        visibility: true
      },
      {
        primary_key: 'action',
        value: "Download",
        charactLimit: 10,
        sorting: false,
        visibility: true,
        edit: true,
        delete: true,
        // editCondition: 'converted == 0',
        // deleteCondition: 'converted == 0'
      },
    ]

    this.tableSetting = {
      width: "100%",
      height: "58vh"
    }

    this.rowColumns = [
      {
        width: "15%",
        textAlign: "left"
      },
      {
        width: "20%",
        textAlign: "left"
      },
      {
        width: "20%",
        textAlign: "left"
      },
      {
        width: "20%",
        textAlign: "left"
      },
      {
        width: "20%",
        textAlign: "left"
      },

    ]
  }
}
