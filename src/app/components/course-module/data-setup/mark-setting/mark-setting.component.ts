import { Component, OnInit } from '@angular/core';
import { AuthenticatorService } from '../../../../services/authenticator.service';
import { CommonApiCallService } from '../../../../services/common-api-call.service';
import { HttpService } from '../../../../services/http.service';
import { MessageShowService } from '../../../../services/message-show.service';

@Component({
  selector: 'app-mark-setting',
  templateUrl: './mark-setting.component.html',
  styleUrls: ['./mark-setting.component.scss']
})
export class MarkSettingComponent implements OnInit {
  examTypeData: any = [];
  markTypeData: any = [];
  markDistributionData: any = [];
  marks_distribution_ids: any = [];
  standardData: any = [];
  exam_type_list: any = [];
  totalMarks: any = 0;
  model: any = {
    mark_type: '-1',
    exam_type_list: [],
    institute_id: sessionStorage.getItem('institute_id')
  }

  constructor(
    private commonApiCall: CommonApiCallService,
    private msgService: MessageShowService,
    private httpService: HttpService,
    private auth: AuthenticatorService
  ) { }

  ngOnInit(): void {
    this.getMarksType();
    this.getExamType();
    this.getMarkDistribution();
    // setTimeout(() => {
      this.changeMarkType('onload', this.model.mark_type);
    // }, 3000);
  }

  changeMarkType(calltype, obj) {
    this.examTypeData.filter((data) => {
      data.isChecked = false;
    });
    this.markDistributionData.filter((data) => {
      data.isChecked = false;
    });
    this.fetchSettingByMarkType(calltype, obj);
  }

  makeExamWiseArray() {
    if (this.examTypeData && this.examTypeData.length) {
      this.examTypeData.forEach(element => {
        let key = element.exam_type;
        element[key] = [];
        element.totalMarks = 0;
        // element[key] = this.markDistributionData;
        this.markDistributionData.forEach(eu => {
          let obj = {
            marks_distribution_id: '',
            marks_distribution_name: '',
            marks_value_percent: '',
          }
          obj.marks_distribution_id = eu.marks_distribution_id;
          obj.marks_distribution_name = eu.marks_distribution_name;
          obj.marks_value_percent = eu.marks_value_percent;
          element[key].push(obj);
        });
      });
    }
  }

  fetchSettingByMarkType(calltype, mark_type) {
    this.auth.showLoader();
    let url = '/api/v1/courseExamSchedule/fetch-marks-setting/' + sessionStorage.getItem('institute_id');
    if (calltype == 'onChange') {
      url = '/api/v1/courseExamSchedule/fetch-marks-setting/' + sessionStorage.getItem('institute_id') + '?marks_type=' + mark_type;
    }
    this.httpService.getData(url).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        if (res.result) {
          this.model.mark_type = res.result.mark_type;
        }
        if (this.model.mark_type == 1 || this.model.mark_type == 4 || this.model.mark_type == 5 || this.model.mark_type == 6) {
          this.getStandard();
        } else if (this.model.mark_type == 2 || this.model.mark_type == 3) {
          this.makeExamWiseArray();
        }
        setTimeout(() => {
          this.setSettingData(res);
        }, 3000);
      },
      (err: any) => {
        this.auth.hideLoader();
        this.msgService.showErrorMessage('error', '', err.error.message);
      }
    );
  }


  setSettingData(obj) {
    let mark_type = Number(this.model.mark_type);
    switch (mark_type) {
      case 0: {
        this.setSettingForGlobalWise(obj);
        break;
      }
      case 1: {
        this.setSettingForGlobalWise(obj);
        break;
      }
      case 2: {
        this.setSettingForExamWise(obj);
        break;
      }
      case 3: {
        this.setSettingForExamWise(obj);
        break;
      }
      case 4: {
        this.setSettingForSubjectWise(obj);
        break;
      }
      case 5: {
        this.setSettingForClassExamWise(obj);
        break;
      }
      case 6: {
        this.setForClassExSubWise(obj);
        break;
      }

    }
  }

  setSettingForGlobalWise(obj) {
    let exam_type_list = (this.model.mark_type == 0) ? obj.result.exam_type_list : obj.result.exam_type_ids;
    if (obj.result && exam_type_list && exam_type_list.length) {
      exam_type_list.forEach(element => {
        this.examTypeData.filter((data) => {
          let exam_type_id = (this.model.mark_type == 0) ? element.exam_type_id : element;
          if (data.exam_type_id == exam_type_id) {
            data.isChecked = true;
          }
        });
      });
      if (this.model.mark_type == 0) {
        obj.result.exam_type_list[0].marks_distribution_ids.forEach(element => {
          this.markDistributionData.filter((data) => {
            if (data.marks_distribution_id == element) {
              data.isChecked = true;
            }
          });
        });
        this.totalMarks = 100;
      } else if (this.model.mark_type == 1) {
        this.totalMarks = 0;
        if (obj.result.stardard_list && obj.result.stardard_list.length) {
          obj.result.stardard_list.forEach(element => {
            this.standardData.filter((data) => {
              if (data.standard_id == element.standard_id) {
                data.totalMarks = 100;
                this.totalMarks = this.totalMarks + 100;
                element.marks_distribution_ids.forEach(mark => {
                  let key = data.standard_name;
                  data[key].filter((mark1) => {
                    if (mark == mark1.marks_distribution_id) {
                      mark1.isChecked = true;
                    }
                  })
                })
              }
            });
          });
        }
      }
    }
  }

  setSettingForExamWise(obj) {
    this.totalMarks = 0;
    if (obj.result && obj.result.exam_type_list && obj.result.exam_type_list.length) {
      obj.result.exam_type_list.forEach(element => {
        this.examTypeData.filter((data) => {
          if (data.exam_type_id == element.exam_type_id) {
            data.totalMarks = 100;
            this.totalMarks = (this.model.mark_type == 3) ? (this.totalMarks + 100) : 100;
            let key = data.exam_type;
            element.marks_distribution_ids.forEach(mark => {
              data[key].filter((data1) => {
                if (mark == data1.marks_distribution_id) {
                  data1.isChecked = true;
                }
              })
            });
          }
        });
      });
    }
  }

  setSettingForSubjectWise(obj) {
    this.exam_type_list = [];
    this.totalMarks = 0;
    if (obj.result && obj.result.stardard_list && obj.result.stardard_list.length) {
      obj.result.stardard_list.forEach(standard => {
        this.standardData.forEach(element => {
          element.totalMarks = 100;
          if (element.subject_list && element.subject_list.length) {
            standard.subject_list.forEach(sub => {
              element.subject_list.filter(subject => {
                subject.totalMarks = 100;
                if (subject.subject_id == sub.subject_id) {
                  this.totalMarks = this.totalMarks + 100;
                  sub.marks_distribution_ids.forEach(mark_id => {
                    let key = subject.subject_name;
                    subject[key].forEach(mark => {
                      mark.totalMarks = 100;
                      if (mark_id == mark.marks_distribution_id) {
                        mark.isChecked = true;
                      }
                    });
                  });
                }
              });
            });
          }
          this.exam_type_list.push(obj);
        });
      });
    }
  }

  setSettingForClassExamWise(obj) {
    this.totalMarks = 0;
    if (obj.result && obj.result.stardard_list && obj.result.stardard_list.length) {
      // this.totalMarks = 100;
      obj.result.stardard_list.forEach(element => {
        this.standardData.filter((data) => {
          if (data.standard_id == element.standard_id) {
            data.totalMarks = 100;
            element.exam_type_list.forEach(ex => {
              let key1 = data.standard_name;
              data[key1].filter((ex1) => {
                if (ex.exam_type_id == ex1.exam_type_id) {
                  ex1.totalMarks = 100;
                  this.totalMarks = this.totalMarks + 100;
                  ex.marks_distribution_ids.forEach(mark => {
                    let key = ex1.exam_type;
                    ex1[key].filter((mark1) => {
                      if (mark == mark1.marks_distribution_id) {
                        mark1.isChecked = true;
                      }
                    })
                  })
                }
              })
            });
          }
        });
      });
    }
  }

  setForClassExSubWise(obj) {
    this.totalMarks = 0;
    if (obj.result.stardard_list && obj.result.stardard_list.length) {
      obj.result.stardard_list.forEach(element => {
        this.standardData.filter((data) => {
          data.totalMarks = 0;
          if (data.standard_id == element.standard_id) {
            element.exam_type_list.forEach(ex => {
              let key1 = data.standard_name;
              data[key1].filter((ex1) => {
                let sub_key = ex1.exam_type;
                ex1.totalMarks = 0;
                if (ex.exam_type_id == ex1.exam_type_id) {
                  ex1.totalMarks = ex1.totalMarks + 100;
                  ex.subject_list.forEach(sub => {
                    ex1[sub_key].filter((sub1) => {
                      sub1.totalMarks = 100;
                      this.totalMarks = this.totalMarks + 100;
                      if (sub.subject_id == sub1.subject_id) {
                        sub.marks_distribution_ids.forEach(mark => {
                          let mark_key = sub1.subject_name;
                          data.totalMarks = data.totalMarks + 100;
                          sub1[mark_key].filter((mark1) => {
                            if (mark == mark1.marks_distribution_id) {
                              mark1.isChecked = true;
                            }
                          })
                        })
                      }
                    });
                  });
                }
              })
            });
          }
        });
      });
    }
  }

  getMarksType() {
    this.httpService.getData('/api/v1/masterData/type/MARKS_TYPE').subscribe(
      (res: any) => {
        this.markTypeData = res;
      },
      (err: any) => {
        this.msgService.showErrorMessage('error', '', err.error.message);
      }
    )
  }


  getExamType() {
    this.commonApiCall.fetchInstituteExamTypes(sessionStorage.getItem('institute_id')).subscribe((data: any) => {
      this.examTypeData = data.result;
    }, err => {
      this.msgService.showErrorMessage('error', '', err.error.message)
    })
  }

  getMarkDistribution() {
    this.auth.showLoader();
    this.httpService.getData('/api/v1/courseExamSchedule/fetch-marks-distribution/' + sessionStorage.getItem('institute_id')).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.markDistributionData = res.result;
      },
      err => {
        this.auth.hideLoader();
      }
    );
  }

  checkMarkTotal(obj) {
    this.totalMarks = obj.isChecked ? (obj.marks_value_percent + this.totalMarks) : (this.totalMarks - obj.marks_value_percent);
  }

  checkInputValidation() {
    let obj = Number(this.model.mark_type);
    switch (obj) {
      case 0: {
        return this.checkForGlobalWise();
      }
      case 1: {
        return this.checkForClassWise();
      }
      case 2: {
        return this.checkForExamWise();
      }
      case 3: {
        return this.checkForExamIndividual();
      }
      case 4: {
        return this.checkForSubjectWise();
      }
      case 5: {
        return this.checkForClassExWise();
      }
      case 6: {
        return this.checkForClassExSub();
      }

    }
  }

  checkForGlobalWise() {
    this.exam_type_list = [];
    this.marks_distribution_ids = [];
    for (let i = 0; i < this.markDistributionData.length; i++) {
      if (this.markDistributionData[i].isChecked) {
        this.marks_distribution_ids.push(this.markDistributionData[i].marks_distribution_id);
      }
    }
    for (let i = 0; i < this.examTypeData.length; i++) {
      if (this.examTypeData[i].isChecked) {
        this.exam_type_list.push(this.examTypeData[i].exam_type_id);
      }
    }
    if (this.model.mark_type == '-1') {
      this.msgService.showErrorMessage('error', '', 'Please select Mark Type');
      return false;
    } else if (this.exam_type_list.length == 0) {
      this.msgService.showErrorMessage('error', '', 'The Exam field is required.');
      return false;
    } else if (this.marks_distribution_ids.length == 0) {
      this.msgService.showErrorMessage('error', '', 'The Mark Percentage field is required.');
      return false;
    } else if (this.totalMarks != 100) {
      this.msgService.showErrorMessage('error', '', 'Select mark percentage of 100 percent.');
      return false;
    } else {
      return true;
    }
  }

  checkForClassWise() {
    this.exam_type_list = [];
    for (let i = 0; i < this.examTypeData.length; i++) {
      if (this.examTypeData[i].isChecked) {
        this.exam_type_list.push(this.examTypeData[i].exam_type_id);
      }
    }
    if (this.exam_type_list.length == 0) {
      this.msgService.showErrorMessage('error', '', 'The Exam field is required.');
      return false;
    }
    if (this.totalMarks == 0) {
      this.msgService.showErrorMessage('error', '', 'The Mark Percentage field is required.');
      return false;
    } else {
      let obj = {
        stardard_list: [],
      }
      let tempMsg: any = '';
      this.standardData.forEach(element => {
        if (element.totalMarks != 0 && element.totalMarks == 100) {
          let temp = {
            standard_id: '',
            standard_name: '',
            marks_distribution_ids: '',
            totalMarks: 0
          }
          element.marks_distribution_ids = [];
          let key = element.standard_name;
          for (let i = 0; i < element[key].length; i++) {
            if (element[key][i].isChecked) {
              element.marks_distribution_ids.push(element[key][i].marks_distribution_id);
            }
          }
          temp.standard_id = element.standard_id;
          temp.standard_name = element.standard_name;
          temp.marks_distribution_ids = element.marks_distribution_ids;
          temp.totalMarks = element.totalMarks;
          obj.stardard_list.push(temp);
        } else {
          tempMsg = tempMsg + 'Select mark percentage in 100 percent of class ' + element.standard_name + '.';
        }
      });
      if (tempMsg != '') {
        this.msgService.showErrorMessage('error', '', tempMsg);
        return false;
      } else {
        this.model.stardard_list = [];
        obj.stardard_list.forEach(standard => {
          let tempObj = {
            'standard_id': standard.standard_id,
            marks_distribution_ids: standard.marks_distribution_ids
          }
          this.model.stardard_list.push(tempObj);
        })
        this.model.exam_type_ids = this.exam_type_list;
        return true;
      }
    }
  }

  checkForExamWise() {
    if (this.totalMarks == 0) {
      this.msgService.showErrorMessage('error', '', 'The Mark Percentage field is required.');
      return false;
    }
    if (this.totalMarks > 0 && this.totalMarks != 100) {
      this.msgService.showErrorMessage('error', '', 'Select mark percentage in 100 percent of all exam .');
      return false;
    } else {
      this.exam_type_list = [];
      this.examTypeData.forEach(element => {
        if (element.totalMarks > 0) {
          let key = element.exam_type;
          element.marks_distribution_ids = [];
          for (let i = 0; i < element[key].length; i++) {
            if (element[key][i].isChecked) {
              element.marks_distribution_ids.push(element[key][i].marks_distribution_id);
            }
          }
          let obj = {
            exam_type_id: element.exam_type_id,
            marks_distribution_ids: element.marks_distribution_ids
          }
          this.exam_type_list.push(obj);
        }
      });
      this.model.exam_type_list = this.exam_type_list;
      return true;
    }
  }

  checkForExamIndividual() {
    if (this.totalMarks == 0) {
      this.msgService.showErrorMessage('error', '', 'The Mark Percentage field is required. The Exam field is required.');
      return false;
    } else {
      let tempMsg = '';
      this.exam_type_list = [];
      this.examTypeData.forEach(element => {

        if (element.totalMarks > 0 && element.totalMarks != 100) {
          tempMsg = tempMsg + 'Select mark percentage in 100 percent of exam ' + element.exam_type + '.'
        } else {
          if (element.totalMarks == 100) {
            let key = element.exam_type;
            element.marks_distribution_ids = [];
            for (let i = 0; i < element[key].length; i++) {
              if (element[key][i].isChecked) {
                element.marks_distribution_ids.push(element[key][i].marks_distribution_id);
              }
            }
            let obj = {
              exam_type_id: element.exam_type_id,
              marks_distribution_ids: element.marks_distribution_ids
            }
            this.exam_type_list.push(obj);
          }
        }
      });
      if (tempMsg != '') {
        this.msgService.showErrorMessage('error', '', tempMsg);
        return false;
      } else {
        this.model.exam_type_list = this.exam_type_list;
        return true;
      }
    }
  }

  checkForSubjectWise() {
    if (this.totalMarks == 0) {
      this.msgService.showErrorMessage('error', '', 'The Mark Percentage field is required.');
      return false;
    } else {
      let tempMsg = '';
      this.exam_type_list = [];
      this.standardData.forEach(element => {
        let obj = {
          standard_id: element.standard_id,
          subject_list: []
        }
        if (element.subject_list && element.subject_list.length) {
          element.subject_list.forEach(subject => {
            if (subject.totalMarks == 100) {
              let sub_obj = {
                subject_id: '',
                marks_distribution_ids: []
              }
              sub_obj.subject_id = subject.subject_id;
              let key = subject.subject_name;
              subject[key].forEach(mark => {
                if (mark.isChecked) {
                  sub_obj.marks_distribution_ids.push(mark.marks_distribution_id);
                }
              });
              obj.subject_list.push(sub_obj);
            } else {
              tempMsg = tempMsg + 'Select mark percentage in 100 percent of subject ' + subject.subject_name + ' in ' + element.standard_name + '. ';
            }
          });
        }
        this.exam_type_list.push(obj);
      });
      if (tempMsg != '') {
        this.msgService.showErrorMessage('error', '', tempMsg);
        return false;
      } else {
        this.model.stardard_list = this.exam_type_list;
        return true;
      }
    }
  }

  checkForClassExWise() {
    if (this.totalMarks == 0) {
      this.msgService.showErrorMessage('error', '', 'The Mark Percentage field is required. The Exam field is required.');
      return false;
    } else {
      this.exam_type_list = [];
      let tempMsg = '';
      this.standardData.forEach(element => {
        if (element.totalMarks == 0) {
          tempMsg = tempMsg + ' Select mark percentage of class ' + element.standard_name + '.';
        } else {
          let exam_key = element.standard_name;
          let obj = {
            standard_id: '',
            exam_type_list: []
          }
          obj.standard_id = element.standard_id;
          element[exam_key].forEach(exam => {
            if (exam.totalMarks > 0 && exam.totalMarks != 100) {
              tempMsg = tempMsg + ' Select mark percentage in 100 percent of exam ' + exam.exam_type + ' in class ' + element.standard_name + ' .';
            } else if (exam.totalMarks == 100) {
              let mark_key = exam.exam_type;
              let markObj = {
                exam_type_id: '',
                marks_distribution_ids: []
              }
              markObj.exam_type_id = exam.exam_type_id;
              exam[mark_key].forEach(mark => {
                if (mark.isChecked) {
                  markObj.marks_distribution_ids.push(mark.marks_distribution_id);
                }
              });
              obj.exam_type_list.push(markObj);
            }
          });
          this.exam_type_list.push(obj);
        }
      });
      if (tempMsg != '') {
        this.msgService.showErrorMessage('error', '', tempMsg);
        return false;
      } else {
        this.model.stardard_list = this.exam_type_list;
        return true;
      }
    }
  }

  checkForClassExSub() {
    if (this.totalMarks == 0) {
      this.msgService.showErrorMessage('error', '', 'The Mark Percentage field is required. The Exam field is required.');
      return false;
    } else {
      let tempMsg = '';
      this.exam_type_list = [];
      this.standardData.forEach(element => {
        if (element.totalMarks > 0) {
          let obj = {
            standard_id: element.standard_id,
            exam_type_list: []
          }
          let key = element.standard_name;
          element[key].forEach(exam => {
            if (exam.totalMarks != 0) {
              let sub_key = exam.exam_type;
              if (exam[sub_key] && exam[sub_key].length) {
                let exam_obj = {
                  exam_type_id: '',
                  subject_list: []
                }
                exam_obj.exam_type_id = exam.exam_type_id;
                exam[sub_key].forEach(subject => {
                  if (subject.totalMarks == 100) {
                    let sub_obj = {
                      subject_id: '',
                      marks_distribution_ids: []
                    }
                    sub_obj.subject_id = subject.subject_id;
                    let key = subject.subject_name;
                    subject[key].forEach(mark => {
                      if (mark.isChecked) {
                        sub_obj.marks_distribution_ids.push(mark.marks_distribution_id);
                      }
                    });
                    exam_obj.subject_list.push(sub_obj);
                  } else {
                    tempMsg = tempMsg + 'Select mark percentage in 100 percent of exam ' + exam.exam_type + 'of subject ' + subject.subject_name + 'in ' + element.standard_name + '. ';
                  }
                  obj.exam_type_list.push(exam_obj);
                });
              }
              this.exam_type_list.push(obj);
            }
          });
        } else {
          tempMsg = tempMsg + ' Select mark percentage in 100 percent of class ' + element.standard_name + '.';
        }
      });
      if (tempMsg != '') {
        this.msgService.showErrorMessage('error', '', tempMsg);
        return false;
      } else {
        this.model.stardard_list = this.exam_type_list;
        return true;
      }
    }
  }



  makeJsonTOSend() {
    if (this.model.mark_type == 0) {
      this.model.exam_type_list = [];
      this.exam_type_list.forEach(element => {
        let obj = {
          exam_type_id: element,
          marks_distribution_ids: this.marks_distribution_ids
        }
        this.model.exam_type_list.push(obj);
      });
    }
  }

  updateMarkType() {
    if (this.checkInputValidation()) {
      this.makeJsonTOSend();
      this.auth.showLoader();
      this.httpService.postData('/api/v1/courseExamSchedule/create-marks-setting', this.model).subscribe(
        (res: any) => {
          this.auth.hideLoader();
          this.msgService.showErrorMessage('success', '', 'Setting Updated Successfully');
        },
        (err: any) => {
          this.auth.hideLoader();
          this.msgService.showErrorMessage('error', '', err.error.message);
        }
      )
    }
  }

  setSettingForStandard() {
    if (this.standardData && this.standardData.length) {
      this.auth.showLoader();
      if (this.model.mark_type == 1) {
        this.standardData.forEach(element => {
          let key = element.standard_name;
          element[key] = [];
          element.totalMarks = 0;
          // element[key] = this.markDistributionData;
          this.markDistributionData.forEach(eu => {
            let obj = {
              marks_distribution_id: '',
              marks_distribution_name: '',
              marks_value_percent: '',
            }
            obj.marks_distribution_id = eu.marks_distribution_id;
            obj.marks_distribution_name = eu.marks_distribution_name;
            obj.marks_value_percent = eu.marks_value_percent;
            element[key].push(obj);
          });
        });
      } else if (this.model.mark_type == 4) {
        this.standardData.forEach(element => {
          if (element.subject_list && element.subject_list.length) {
            element.subject_list.forEach(subject => {
              let key = subject.subject_name;
              subject[key] = [];
              subject.totalMarks = 0;
              // element[key] = this.markDistributionData;
              this.markDistributionData.forEach(eu => {
                let obj = {
                  marks_distribution_id: '',
                  marks_distribution_name: '',
                  marks_value_percent: '',
                }
                obj.marks_distribution_id = eu.marks_distribution_id;
                obj.marks_distribution_name = eu.marks_distribution_name;
                obj.marks_value_percent = eu.marks_value_percent;
                subject[key].push(obj);
              });
            });
          }
        });
      } else if (this.model.mark_type == 5) {
        this.standardData.forEach(element => {
          let key = element.standard_name;
          element[key] = [];
          element.totalMarks = 0;
          this.examTypeData.forEach(exam => {
            let exam_key = exam.exam_type;
            let exam_obj = {
              exam_type_id: '',
              exam_type: '',
              totalMarks: 0,
              exam_key: []
            }
            exam_obj.exam_type = exam.exam_type;
            exam_obj.exam_type_id = exam.exam_type_id;
            exam_obj[exam_key] = [];
            this.markDistributionData.forEach(eu => {
              let obj = {
                marks_distribution_id: '',
                marks_distribution_name: '',
                marks_value_percent: '',
              }
              obj.marks_distribution_id = eu.marks_distribution_id;
              obj.marks_distribution_name = eu.marks_distribution_name;
              obj.marks_value_percent = eu.marks_value_percent;
              exam_obj[exam_key].push(obj);
            });
            element[key].push(exam_obj);
          });
        });
      } else {
        this.standardData.forEach(element => {
          let key = element.standard_name;
          element[key] = [];
          element.totalMarks = 0;
          this.examTypeData.forEach(exam => {
            let exam_key = exam.exam_type;
            let exam_obj = {
              exam_type_id: '',
              exam_type: '',
              totalMarks: 0,
              exam_key: []
            }
            exam_obj.exam_type = exam.exam_type;
            exam_obj.exam_type_id = exam.exam_type_id;
            exam_obj[exam_key] = [];
            if (element.subject_list && element.subject_list.length) {
              element.subject_list.forEach(sub => {
                let sub_key = sub.subject_name;
                let sub_obj = {
                  subject_id: '',
                  subject_name: '',
                  totalMarks: 0
                }
                sub_obj.subject_id = sub.subject_id;
                sub_obj.subject_name = sub.subject_name;
                sub_obj[sub_key] = [];
                this.markDistributionData.forEach(eu => {
                  let obj = {
                    marks_distribution_id: '',
                    marks_distribution_name: '',
                    marks_value_percent: '',
                  }
                  obj.marks_distribution_id = eu.marks_distribution_id;
                  obj.marks_distribution_name = eu.marks_distribution_name;
                  obj.marks_value_percent = eu.marks_value_percent;
                  sub_obj[sub_key].push(obj);
                });
                exam_obj[exam_key].push(sub_obj);
              });
            }
            element[key].push(exam_obj);
          });
        });
      }
      this.auth.hideLoader();
    }
  }

  getStandard() {
    if (this.standardData == null || this.standardData.length == 0) {
      this.auth.showLoader();
      this.httpService.getData('/api/v1/standards/standard-subject-list/' + sessionStorage.getItem('institute_id') + '?is_active=Y&is_subject_required=true').subscribe(
        (res: any) => {
          this.standardData = res.result;
          this.setSettingForStandard();
        },
        (err: any) => {
          this.msgService.showErrorMessage('error', '', err.error.message);
        }
      )
    } else {
      this.setSettingForStandard();
    }
  }

  examWiseMarkTotal(standard, obj) {
    if (this.model.mark_type == 2) {
      this.totalMarks = obj.isChecked ? (obj.marks_value_percent + this.totalMarks) : (this.totalMarks - obj.marks_value_percent);
      standard.totalMarks = this.totalMarks;
    } else {
      standard.totalMarks = obj.isChecked ? (obj.marks_value_percent + standard.totalMarks) : (standard.totalMarks - obj.marks_value_percent);
      this.totalMarks = obj.isChecked ? (obj.marks_value_percent + this.totalMarks) : (this.totalMarks - obj.marks_value_percent);
    }
  }

  classWiseMarkTotal(standard, obj) {
    standard.totalMarks = obj.isChecked ? (obj.marks_value_percent + standard.totalMarks) : (standard.totalMarks - obj.marks_value_percent);
    this.totalMarks = obj.isChecked ? (obj.marks_value_percent + this.totalMarks) : (this.totalMarks - obj.marks_value_percent);
  }

  subjectWiseMarkTotal(subject, mark) {
    if (mark.isChecked) {
      subject.totalMarks = (mark.marks_value_percent + subject.totalMarks);
      this.totalMarks = this.totalMarks + mark.marks_value_percent;
    } else {
      subject.totalMarks = (subject.totalMarks - mark.marks_value_percent);
      this.totalMarks = this.totalMarks - mark.marks_value_percent;
    }
  }

  classExamWiseMarkTotal(stanadrd, exam, mark) {
    if (mark.isChecked) {
      stanadrd.totalMarks = (mark.marks_value_percent + stanadrd.totalMarks);
      exam.totalMarks = (mark.marks_value_percent + exam.totalMarks);
      this.totalMarks = this.totalMarks + mark.marks_value_percent;
    } else {
      stanadrd.totalMarks = (mark.marks_value_percent - stanadrd.totalMarks);
      exam.totalMarks = (exam.totalMarks - mark.marks_value_percent);
      this.totalMarks = this.totalMarks - mark.marks_value_percent;
    }
  }

  classExamSubjectWiseTotal(standard, exam, subject, mark) {
    if (mark.isChecked) {
      subject.totalMarks = subject.totalMarks + mark.marks_value_percent;
      exam.totalMarks = exam.totalMarks + mark.marks_value_percent;
      standard.totalMarks = standard.totalMarks + mark.marks_value_percent;
      this.totalMarks = this.totalMarks + mark.marks_value_percent;
    } else {
      subject.totalMarks = subject.totalMarks - mark.marks_value_percent;
      exam.totalMarks = exam.totalMarks - mark.marks_value_percent;
      standard.totalMarks = standard.totalMarks - mark.marks_value_percent;
      this.totalMarks = this.totalMarks - mark.marks_value_percent;
    }
  }


}
