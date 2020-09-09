import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { HttpService } from '../../../services/http.service';
import { MessageShowService } from '../../../services/message-show.service';
import { DataDisplayTableComponent } from '../../shared/data-display-table/data-display-table.component';
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

  @ViewChild('child',{static: false}) private child: DataDisplayTableComponent;
  institute_id: any;
  jsonflag = {
    isUpadted: false,
    isProfessional: false,
    isAssignBatch: false,
    allowMapping: '',
  }

  updateEcourseObject: any = {};
  ecourseObject =
    {
      course_type: "",
      course_type_id: 0,
      master_course_ids: "",
      master_course_names: "",
      is_online: 'Y',
      status: 'Y'
    }

  displayKeys: any[] = [
    { primaryKey: 'course_type', header: 'E-Course Name', priority: 1, allowSortingFlag: true, inputType: 'noEdit' },
    { primaryKey: 'assignCourses', header: 'Courses', priority: 2, allowSortingFlag: true, amountValue: true, inputType: 'noEdit' },
    { primaryKey: 'is_online', header: 'Status', priority: 3, allowSortingFlag: true, amountValue: true, inputType: 'noEdit' }
  ];
  ecourseData: any[] = [];
  batchList: any[] = [];
  tempBatchList: any[] = [];
  assignCourses: any[] = [];
  statusOption: any = false;
  //table setting
  tableSetting: any = {//inventory.item
    tableDetails: { title: 'Ecourse mapping', key: 'reports.fee.ecoursemapping', showTitle: false },
    search: { title: 'Search', showSearch: false },
    keys: this.displayKeys,
    selectAll: { showSelectAll: false, option:'single',title: 'Send Due SMS', checked: false, key: 'student_disp_id' },
    actionSetting: {
      showActionButton: true,
      editOption: 'button',//or popup 
      isEditRowShow: true,
      condition: [],
      options: [
      { title: "Edit", class: 'fa fa-check updateCss', optionType: 'edit' }],
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
    this.jsonflag.allowMapping = sessionStorage.getItem('enable_elearn_course_mapping_feature');
    let url = window.location.href;
  }


  ngOnInit() {
    this.getEcourseMappingData();
    //
    this.auth.institute_type.subscribe(
      res => {
        if (res == 'LANG') {
          this.jsonflag.isProfessional = true;// batch      
          this.tableSetting.keys = [{ primaryKey: 'course_type', header: 'E-Course Name', priority: 1, allowSortingFlag: true, inputType: 'text' }]
          this.tableSetting.actionSetting.options = [{ title: "Edit", class: 'fa fa-check updateCss', optionType: 'edit' }];
          this.tableSetting.actionSetting.editOptions = [{ title: "update", class: 'fa fa-check updateCss', optionType: 'update' }];
          if (this.jsonflag.allowMapping == '1') { // if assign Standard enabled
            this.getListOfBatches();
            this.tableSetting.keys.push({ primaryKey: 'assignCourses', header: 'Standard', priority: 2, allowSortingFlag: true, inputType: 'noEdit' });
            this.tableSetting.keys.push({ primaryKey: 'is_online', header: 'Status', priority: 3, allowSortingFlag: true, inputType: 'noEdit' });
          }


        } else {
          this.jsonflag.isProfessional = false;// course
          this.tableSetting.keys = [{ primaryKey: 'course_type', header: 'E-Course Name', priority: 1, allowSortingFlag: true, inputType: 'text' }];
          this.tableSetting.actionSetting.options = [{ title: "Edit", class: 'fa fa-check updateCss', optionType: 'edit' }];
          this.tableSetting.actionSetting.editOptions = [{ title: "update", class: 'fa fa-check updateCss', optionType: 'update' }];

          if (this.jsonflag.allowMapping == '1') { // if assign course enabled
            this.getListOfCourses();
            this.tableSetting.keys.push({ primaryKey: 'assignCourses', header: 'Courses', priority: 2, allowSortingFlag: true, inputType: 'noEdit' });
            this.tableSetting.keys.push({ primaryKey: 'is_online', header: 'Status', priority: 3, allowSortingFlag: true, inputType: 'noEdit' });
          }
        }
      }
    )

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
        let courseTitle = name + ' - ' + course.course_name;
        let object = {
          isSelected: false,
          title: courseTitle,
          temp:course.course_name,
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
      master_course_ids: this.ecourseObject.master_course_ids,
      is_online : this.ecourseObject.is_online
    }
    data.push(obj);
    console.log(this.ecourseObject, obj);
    this._http.postData(url, data).subscribe((res) => {
      let msg = this.jsonflag.isProfessional ? 'Batch Added Successfully ' : 'Course Added Successfully';
      this._msgService.showErrorMessage('success', '', 'Course Added Successfully');
      this.clearObjects();
      this.ecourseData = [];
      this.getEcourseMappingData();

    }, (err) => {
      this._msgService.showErrorMessage('error', '', err.error.message);
    });
  }

  clearObjects() {
    this.jsonflag.isUpadted = false;
    this.statusOption = false;
    this.assignCourses = [];
    this.ecourseObject =
      {
        course_type: "",
        course_type_id: 0,
        master_course_names: "",
        master_course_ids: "",
        is_online: '',
        status: 'Y'
      }
  }


  optionSelected($event) {
    this.jsonflag.isUpadted = true;
    switch ($event.type) {
      case 'assign': {
        this.updateEcourseObject = Object.assign({}, $event.data);// copy the object instead get reference to that object
        this.updateEcourseObject.master_course_names = $event.data.assignCourses;
        this.ecourseObject.status = $event.data.is_online;
        this.batchList.forEach((obj) => obj.isSelected = false);
        if (this.updateEcourseObject.master_course_names) {
          let names = this.updateEcourseObject.master_course_names.split(",");
          this.assignCourses = this.updateEcourseObject.master_course_names.split(',');
          names.forEach((title) => {
            if (this.jsonflag.isProfessional) {
              let obj: any = this.batchList.filter((data) => data.title == title);
              if (obj.length) {
                obj.forEach((element) => {
                  element.isSelected = true;
                })
              }
            }
            else {
              this.batchList.filter((data) => {
                if (data.temp == title) {
                  data.isSelected = true;
                }
              });
            }

          })
          console.log(this.batchList);
        }
        this.jsonflag.isAssignBatch = true;
        // this.openAssignBatch();
        break;
      }

      case 'update': {
        this.updateEcourseObject = Object.assign({}, $event.data); // copy the object instead get reference to that object
        this.ecourseObject.status = $event.data.is_online;
        this.updateCourseMapping();
        break;
      }
      
      case 'status': {
        this.ecourseObject.status = $event.data.is_online;
        this.updateEcourseObject = Object.assign({}, $event.data); // copy the object instead get reference to that object
        this.statusOption = true;
      }

      case 'edit': {
        this.updateEcourseObject = Object.assign({}, $event.data);// copy the object instead get reference to that object
        this.updateEcourseObject.master_course_names = $event.data.assignCourses;
        this.ecourseObject.status = $event.data.is_online;
        this.batchList.forEach((obj) => obj.isSelected = false);
        if (this.updateEcourseObject.master_course_names) {
          let names = this.updateEcourseObject.master_course_names.split(",");
          this.assignCourses = this.updateEcourseObject.master_course_names.split(',');
          names.forEach((title) => {
            if (this.jsonflag.isProfessional) {
              let obj: any = this.batchList.filter((data) => data.title == title);
              if (obj.length) {
                obj.forEach((element) => {
                  element.isSelected = true;
                })
              }
            }
            else {
              this.batchList.filter((data) => {
                if (data.temp == title) {
                  data.isSelected = true;
                }
              });
            }

          })
          console.log(this.batchList);
        }
        // this.jsonflag.isAssignBatch = true;
        this.statusOption = true;
      }
    }
    console.log($event);

  }

  updateCourseMapping() {
    this.statusOption = false;
    let url = '/api/v1/institute/courseMapping/update/' + this.institute_id;
    let data = [];
    if (this.updateEcourseObject.course_type == undefined || this.updateEcourseObject.course_type.trim() == '') {
      this._msgService.showErrorMessage('error', '', 'please enter E-course name !');
      return;
    }

    if (this.ecourseObject.status == 'Online') {
      this.ecourseObject.status = 'Y';
    } else {
      this.ecourseObject.status = 'N';
    }

    let obj = {
      course_type: this.updateEcourseObject.course_type,
      course_type_id: this.updateEcourseObject.course_type_id,
      is_test_series: "Y",
      master_course_ids: this.updateEcourseObject.master_course_ids,
      is_online: this.ecourseObject.status
    }
    // data.push(obj);
    console.log(this.updateEcourseObject, data);
    this._http.putData(url, obj).subscribe((res) => {
      let msg = this.jsonflag.isProfessional ? 'Batch updated Successfully ' : 'Course updated Successfully';
      this._msgService.showErrorMessage('success', '', msg);
      this.ecourseData = [];
      this.getEcourseMappingData();

      this.child.notifyMe('clearRow');

      this.updateEcourseObject = {};
      this.clearObjects();
    }, (err) => {
      this._msgService.showErrorMessage('error', '', err.error.message);
    });
  }

  openAssignBatch() {
    this.jsonflag.isAssignBatch = true;
    if ((!this.jsonflag.isUpadted) && this.ecourseObject.master_course_names == '') {
      this.jsonflag.isProfessional ? this.batchMapingObject(this.tempBatchList) : this.courseMapingObject(this.tempBatchList);
    }
    else {
      this.batchList.forEach((obj) => obj.isSelected = false);
      if (this.ecourseObject.master_course_names) {
        let names = this.ecourseObject.master_course_names.split(",")
        names.forEach((title) => {
          let obj: any = this.batchList.filter((data) => data.title == title);
          if (obj.length) { obj[0].isSelected = true; } else {

          }
        })
        console.log(this.batchList);
      }
    }

  }

  //assign standard or course in e-course for mapping 
  addCourseOrStandard() {
    if(this.jsonflag.allowMapping == '1'){
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
        this.updateEcourseObject.master_course_ids += obj.id;
        if (index < (selectedData.length - 1)) {
          this.ecourseObject.master_course_names += ',';
          this.ecourseObject.master_course_ids += ',';
          this.updateEcourseObject.master_course_ids += ',';
        }
      });
      this.assignCourses = this.ecourseObject.master_course_names.split(',');
      this.jsonflag.isAssignBatch = false;
      if (this.jsonflag.isUpadted) {
        this.updateCourseMapping();
      }

    }
    } else {
      this.jsonflag.isAssignBatch = false;
      if (this.jsonflag.isUpadted) {
        this.updateCourseMapping();
      }
    }
  }

  //get course mapping 
  getEcourseMappingData() {
    let objecturl = '/api/v1/institute/courseMapping/' + this.institute_id + '?isOnline=all';
    this._http.getData(objecturl).subscribe((data: any) => {
      this.ecourseData = [];
      data.forEach(obj => {
        let eCourse = obj;
        eCourse.tempName = obj.course_type;
        eCourse.assignCourses = '';
        if (obj.eCourseMapping) {
          obj.eCourseMapping.forEach((element, index) => {
            eCourse.assignCourses += element.course_name;
            if (index < (obj.eCourseMapping.length - 1)) {
              eCourse.assignCourses += ',';
            }
          });
        }// if end
        if (this.jsonflag.allowMapping == '1') { 
        if(obj.is_online == 'Y') {
          obj.is_online = 'Online';
        } else {
          obj.is_online = 'Offline';
        }
      }
        this.ecourseData.push(eCourse);
      });
      console.log(this.ecourseData);
    })
  }

}
