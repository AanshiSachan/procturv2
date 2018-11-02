import { Injectable } from '@angular/core';

@Injectable()
export class TablePreferencesService {
  jsonObject: any;
  localStrongeObject: any = {
    'modules': {
      'enquiry': {
        'home': []
      },
      'student': [],
      'activity': {
        'manageCheques': [],
        'monitoringDashboard': [],
        'archiving': {
          'batches': [],
          'batchesArchivedReport': [],
          'students': [],
          'studentsArchivedReport': []
        }
      },
      'reports': {
        'smsReport': [],
        'attendanceReport': [],
        'fee': {
          'allDuesReport': [],
          'batchWise': [],
          'paymentHistory': [],
          'studentDataReport': [],
          'gstReport': []
        },
        'examReport': [],
        'reportCard': [],
        'timeTable': [],
        'emailReport': [],
        'enquiryReport': [],
        'sourceReport': [],
        'referredByReport': []
      },
      'inventory': {
        'item': [],
        'category': []
      },
      'campaing': []
    },
    'version': '1',
  }

  constructor() { }

  /** create local strcture as per user role  */
  createdLocalStorageStructure(userObject: any) {
    this.localStrongeObject.userId = userObject.userId;
    this.localStrongeObject.role = userObject.role;
    /// assign structure as per role
    switch (userObject.role) {
      case '1': {
        this.localStrongeObject.modules.course = {
          'standard': [],
          'subject': [],
          'courses': [],
          'class': [],
          'exam': []
        };

        break;
      }
      case '0': {
        this.localStrongeObject.modules.batch = {
          'masterCourse': [],
          'courses': [],
          'batch': [],
          'class': [],
          'exam': []
        };
        break;
      }
      default: {
        this.localStrongeObject.modules.course = {
          'standard': [],
          'subject': [],
          'courses': [],
          'class': [],
          'exam': []
        };

        break;
      }
    }

    if (window.localStorage && userObject.role) {
      if (localStorage.getItem('procturTablePreference') == null) {
        localStorage.setItem("procturTablePreference", JSON.stringify(this.localStrongeObject));
        // console.log('stored in LS ');
      }
    }
  }

  // get preferences as per table 
  getTablePreferences(key: string) {
    let value: any;
    if (key != 'procturTablePreference') {
      let keysArray = key.split(".");
      // console.log(keysArray);
      if (localStorage && localStorage.getItem('procturTablePreference') != null) {
        value = JSON.parse(localStorage.getItem("procturTablePreference"))['modules'];
      }
      keysArray.forEach((obj) => {
        value = value[obj];
      })
    }
    else {
      return this.detectArchitcturalChanges();
    }
    // console.log('get using key  ' + key, value);
    if (sessionStorage.getItem('course_structure_flag') != "0") { // for course module
      if (value != null &&value.length !=0){
        value.forEach(element => {
          if(element.primaryKey=='course_subject_name'){
            element.header ='Course';
          }
        });
      }
    }
    else {
      if (value != null &&value.length !=0){// for batch module
        value.forEach(element => {
          if(element.primaryKey=='course_subject_name'){
            element.header ='Subject';
          }
        });
      }
    }
    return value;
  }

  detectArchitcturalChanges() {
    let arch = JSON.parse(localStorage.getItem('procturTablePreference'));
    if (arch != null && arch != undefined) {
      if (arch.hasOwnProperty('version')) {
        if (arch.version == this.localStrongeObject.version) {
          return arch;
        } else {
          localStorage.clear();
          return "";
        }
      } else {
        localStorage.clear();
        return "";
      }
    } else {
      return "";
    }
  }

  //set preferences as per key hirachie in LS
  setTablePreferences(key: string, object: any) {
    // console.log('set in LS ');
    let objRef: any;
    let keysArray = key.split(".");
    let lastKey = keysArray.pop();
    if (key == 'procturTablePreference') {
      localStorage.setItem(key, JSON.stringify(this.localStrongeObject));
      return;
    }
    if (localStorage && localStorage.getItem('procturTablePreference') != null) {
      this.jsonObject = JSON.parse(localStorage.getItem("procturTablePreference"))['modules'];
      objRef = this.jsonObject;
    }
    // iterate as per json within json upto last key 
    keysArray.forEach((obj) => {
      let value = objRef[obj];
      objRef = value;
    })
    objRef[lastKey] = object;
    localStorage.setItem("procturTablePreference", JSON.stringify({ 'modules': this.jsonObject, 'version': this.localStrongeObject.version }));
  }


}
