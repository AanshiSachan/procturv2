import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpService } from '../../../services/http.service'; import { AuthenticatorService } from '../../../services/authenticator.service';
import { DataDisplayTableComponent } from '../../shared/data-display-table/data-display-table.component';
import { MessageShowService } from '../../../services/message-show.service';
;

/**
 * created by laxmi
 */
@Component({
  selector: 'app-ecourse-mapping',
  templateUrl: './ecourse-mapping.component.html',
  styleUrls: ['./ecourse-mapping.component.scss']
})
export class EcourseMappingComponent implements OnInit {

  @ViewChild('child') private child: DataDisplayTableComponent;
  institute_id: any;
  jsonflag = {
    isRippleLoad: false,
    isUpadted: false,
    isProfessional: false,
    isAssignBatch: false
  }

  ecourseObject =
    {
      course_type: "",
      course_type_id: 0,
      master_course_ids: "",
      master_course_names: "",
    }

  displayKeys: any[] = [
    { primaryKey: 'course_type', header: 'E-Course Name', priority: 1, allowSortingFlag: true },
    { primaryKey: 'assignCourses', header: 'Courses', priority: 2, allowSortingFlag: true, amountValue: true, },
  ];
  ecourseData: any[] = [];
  batchList: any[] = [];
  tempBatchList: any[] = [];
  assignCourses: any[] =[];
  //table setting
  tableSetting: any = {//inventory.item
    tableDetails: { title: 'Ecourse mapping', key: 'reports.fee.ecoursemapping', showTitle: false },
    search: { title: 'Search', showSearch: false },
    keys: this.displayKeys,
    selectAll: { showSelectAll: false, title: 'Send Due SMS', checked: false, key: 'student_disp_id' },
    actionSetting: {
      showActionButton: true,
      editOption: 'button',//or popup 
      condition: [],
      options: [{ title: "Assign Courses", class: 'fa fa-check updateCss' }]
    },
    displayMessage: "Enter Detail to Search"
  };



  constructor(
    private _http: HttpService,
    private auth: AuthenticatorService,
    private _msgService: MessageShowService
  ) {
    this.auth.currentInstituteId.subscribe(id => {
      this.institute_id = id;
    });
    this.auth.institute_type.subscribe(
      res => {
        if (res == 'LANG') {
          this.jsonflag.isProfessional = true;// batch
          this.getListOfBatches();
          this.tableSetting.keys = [
            { primaryKey: 'course_type', header: 'E-Course Name', priority: 1, allowSortingFlag: true },
            { primaryKey: 'assignCourses', header: 'Standard', priority: 2, allowSortingFlag: true, amountValue: true, },
          ]
          this.tableSetting.actionSetting.options =[{ title: "Assign Standard", class: 'fa fa-check updateCss' }];
        } else {
          this.jsonflag.isProfessional = false;// course
          this.tableSetting.keys = [
            { primaryKey: 'course_type', header: 'E-Course Name', priority: 1, allowSortingFlag: true },
            { primaryKey: 'assignCourses', header: 'Courses', priority: 2, allowSortingFlag: true, amountValue: true, },
          ]
          this.tableSetting.actionSetting.options =[{ title: "Assign Courses", class: 'fa fa-check updateCss' }];
          this.getListOfCourses();
        }
      }
    )
  }


  ngOnInit() {
    this.getEcourseMappingData();
  }

  getListOfCourses() {
    this.tempBatchList = [];
    let url = "/api/v1/courseMaster/fetch/" + this.institute_id + "/all";
    this._http.getData(url).subscribe((res: any) => {
      console.log(res);
      this.tempBatchList = res;
      this.courseMapingObject(res);
    });
  }

  getListOfBatches() {
    this.tempBatchList = [];
    let url = "/api/v1/standards/all/" + this.institute_id;
    this._http.getData(url).subscribe((res: any) => {
      console.log(res);
      this.tempBatchList = res;
      this.batchMapingObject(res);
    });
  }

  //course mapping function 
  courseMapingObject(res) {
    this.batchList = [];
    res.forEach((obj) => {
      let name = obj.master_course;
      obj.coursesList.forEach(course => {
       let courseTitle = name+' - '+ course.course_name;
        let object = {
          isSelected: false,
          title:courseTitle,
          id: course.course_id
        }
        this.batchList.push(object);
      });
    });
  }

  //batch mapping function 
  batchMapingObject(res) {
    this.batchList = [];
    res.forEach((standard) => {
      let object = {
        isSelected: false,
        title: standard.standard_name,
        id: standard.standard_id
      }
      this.batchList.push(object);
    });
  }

  //add course mapping 
  addEcourseMapping() {
    let url = '/api/v1/institute/courseMapping/' + this.institute_id;
    let data = [];
    if (this.ecourseObject.course_type == undefined || this.ecourseObject.course_type.trim() == '') {
      this._msgService.showErrorMessage('error', '', 'please enter E-course name !');
      return;
    }
    let obj = {
      course_type: this.ecourseObject.course_type,
      course_type_id: 0,
      is_test_series: "y",
      master_course_ids: this.ecourseObject.master_course_ids
    }
    data.push(obj);
    console.log(this.ecourseObject, obj);
    this._http.postData(url, data).subscribe((res) => {
      let msg = this.jsonflag.isProfessional ? 'Batch Added Successfully ' : 'Course Added Successfully';
      this._msgService.showErrorMessage('success', '', 'Course Added Successfully');
      this.getEcourseMappingData();
      this.clearObjects();
    }, (err) => {
      this._msgService.showErrorMessage('error', '', 'Error while adding E-course . try again !');
    });
  }

  clearObjects() {
    this.jsonflag.isUpadted = false;
    this.assignCourses =[];
    this.ecourseObject =
      {
        course_type: "",
        course_type_id: 0,
        master_course_names: "",
        master_course_ids: ""
      }
  }


  optionSelected($event) {
    console.log($event);
    this.jsonflag.isUpadted = true;
    this.ecourseObject = Object.assign({}, $event.data);// copy the object instead get reference to that object
    this.ecourseObject.master_course_names = $event.data.assignCourses;
    this.batchList.forEach((obj)=>obj.isSelected=false);
    if (this.ecourseObject.master_course_names) {
      let names = this.ecourseObject.master_course_names.split(",");
      this.assignCourses = this.ecourseObject.master_course_names.split(',');
      names.forEach((title) => {
        let obj: any = this.batchList.filter((data) => data.title == title);
        if (obj.length) { obj[0].isSelected = true; }
      })
      console.log(this.batchList);
    }
    this.openAssignBatch();
  }

  updateCourseMapping() {
    let url = '/api/v1/institute/courseMapping/update/' + this.institute_id;
    let data = [];
    if (this.ecourseObject.course_type == undefined || this.ecourseObject.course_type.trim() == '') {
      this._msgService.showErrorMessage('error', '', 'please enter E-course name !');
      return;
    }
    let obj = {
      course_type: this.ecourseObject.course_type,
      course_type_id: this.ecourseObject.course_type_id,
      is_test_series: "Y",
      master_course_ids: this.ecourseObject.master_course_ids
    }
    // data.push(obj);
    console.log(this.ecourseObject, data);
    this._http.putData(url, obj).subscribe((res) => {
      let msg = this.jsonflag.isProfessional ? 'Batch updated Successfully ' : 'Course updated Successfully';
      this._msgService.showErrorMessage('success', '', msg);
      this.getEcourseMappingData();
      this.clearObjects();
    }, (err) => {
      this._msgService.showErrorMessage('error', '',err.error.message);
    });
  }

  openAssignBatch() {
    this.jsonflag.isAssignBatch = true;
    if ((!this.jsonflag.isUpadted) && this.ecourseObject.master_course_names == '') {
      this.jsonflag.isProfessional ? this.batchMapingObject(this.tempBatchList) : this.courseMapingObject(this.tempBatchList);
    }
    else {
      this.batchList.forEach((obj)=>obj.isSelected=false);
      if (this.ecourseObject.master_course_names) {
        let names = this.ecourseObject.master_course_names.split(",")
        names.forEach((title) => {
          let obj: any = this.batchList.filter((data) => data.title == title);
          if (obj.length) { obj[0].isSelected = true; }else{

          }
        })
        console.log(this.batchList);
      }
    }

  }

  //assign standard or course in e-course for mapping 
  addCourseOrStandard() {
    let selectedData = this.batchList.filter((data) => data.isSelected == true);
    if (!selectedData.length) {
      let msg = this.jsonflag.isProfessional ? 'please select batch' : 'please select course';
      this._msgService.showErrorMessage('error', '', msg);
    }
    else {
      this.ecourseObject.master_course_names = '';
      this.ecourseObject.master_course_ids = '';
      selectedData.forEach((obj, index) => {
        this.ecourseObject.master_course_names += obj.title;
        this.ecourseObject.master_course_ids += obj.id;
        if (index < (selectedData.length - 1)) {
          this.ecourseObject.master_course_names += ',';
          this.ecourseObject.master_course_ids += ',';
        }
      });
      this.assignCourses = this.ecourseObject.master_course_names.split(',');
      this.jsonflag.isAssignBatch = (!this.jsonflag.isAssignBatch);
    }
  }

  //get course mapping 
  getEcourseMappingData() {
    let objecturl = '/api/v1/institute/courseMapping/' + this.institute_id;
    this._http.getData(objecturl).subscribe((data: any) => {
      this.ecourseData = [];
      data.forEach(obj => {
        let eCourse = obj;
        eCourse.assignCourses = '';
        if (obj.eCourseMapping) {
          obj.eCourseMapping.forEach((element, index) => {
            eCourse.assignCourses += element.course_name;
            if (index < (obj.eCourseMapping.length - 1)) {
              eCourse.assignCourses += ',';
            }
          });
        }// if end
        this.ecourseData.push(eCourse);
      });
      console.log(this.ecourseData);
    })
  }
}
