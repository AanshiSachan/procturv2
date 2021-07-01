import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-student-additionalform-field',
  templateUrl: './student-additionalform-field.component.html',
  styleUrls: ['./student-additionalform-field.component.scss']
})
export class StudentAdditionalformFieldComponent implements OnInit {
  headerSetting: any;
  tableSetting: any;
  rowColumns: any;

  constructor() { }

  ngOnInit(): void {
  }
  setTableData() {
    this.headerSetting = [
      {
        primary_key: 'label',
        value: "Lable",
        charactLimit: 25,
        sorting: false,
        visibility: true
      },
      {
        primary_key: 'type',
        value: "Type",
        charactLimit: 25,
        sorting: false,
        visibility: true
      },
      {
        primary_key: 'is_required',
        value: "Is Required",
        charactLimit: 60,
        sorting: false,
        visibility: true
      },
      {
        primary_key: 'is_searchable',
        value: "Is Searchable",
        charactLimit: 20,
        sorting: false,
        visibility: true
      },
      {
        primary_key: 'sequence_number',
        value: "Sequence",
        charactLimit: 15,
        sorting: false,
        visibility: true
      },
      {
        primary_key: 'comp_length',
        value: "Max Length",
        charactLimit: 30,
        sorting: false,
        visibility: true
      },
      {
        primary_key: 'defaultValue',
        value: "Default Value",
        charactLimit: 30,
        sorting: false,
        visibility: true
      },
      // {
      //   primary_key: 'status',
      //   value: "Status",
      //   charactLimit: 30,
      //   sorting: false,
      //   visibility: true
      // },
      // {
      //   primary_key: 'archived_date',
      //   value: "Archived Date Time",
      //   charactLimit: 30,
      //   sorting: false,
      //   visibility: true
      // },


    ]

    this.tableSetting = {
      width: "100%",
      height: "60vh"
    }

    this.rowColumns = [
      {
        width: "10%",
        textAlign: "center"
      },
      {
        width: "10%",
        textAlign: "center"
      },
      {
        width: "10%",
        textAlign: "center"
      },
      {
        width: "10%",
        textAlign: "center"
      },
      {
        width: "10%",
        textAlign: "center"
      },
      {
        width: "10%",
        textAlign: "center"
      },
      {
        width: "10%",
        textAlign: "center"
      },
      {
        width: "10%",
        textAlign: "center"
      },
      {
        width: "20%",
        textAlign: "center"
      },

    ]
  }
  getAllFormFieldData(){
    let url='/api/v1/instCustomComp/getAll/" + this.institute_id + "?page=2"'

  }

}
