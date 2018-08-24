import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticatorService } from "./authenticator.service";
import { forkJoin } from "rxjs/observable/forkJoin";
import { Observable } from 'rxjs/Observable';




@Injectable()
export class WidgetService {
    baseUrl: string = '';
    Authorization: any;
    headers;
    institute_id;
    
    constructor(private http: HttpClient, private auth: AuthenticatorService) {
        this.auth.currentAuthKey.subscribe(key => {
            this.Authorization = key;
            this.headers = new HttpHeaders({ "Content-Type": "application/json", "Authorization": this.Authorization });
        })
        this.auth.currentInstituteId.subscribe(id => {
            this.institute_id = id;
        });
        // this.institute_id = this.auth.getInstituteId();
        // this.Authorization = this.auth.getAuthToken();
        this.baseUrl = this.auth.getBaseUrl();
    }


    fetchSchedWidgetData(obj): Observable<any> {

        let url = this.baseUrl + "/api/v1/dashboard/admin//todayClassSchedule/" + this.institute_id;
        return this.http.post(url, obj, { headers: this.headers }).map(
            res => { return res; },
            err => { return err; }
        );
    }


    fetchFeeWidgetData(obj): Observable<any> {
        let url = this.baseUrl + "/api/v1/studentWise/fee/students/" + this.institute_id;
        return this.http.post(url, obj, { headers: this.headers }).map(
            res => { return res; },
            err => { return err; }
        );
    }


    getSettings(): Observable<any> {
        let url = this.baseUrl + "/api/v1/institute/settings/" + this.institute_id;
        return this.http.get(url, { headers: this.headers }).map(
            res => { return res; },
            err => { return err; }
        );
    }

    getInstituteSettings(): Observable<any> {
        let url = this.baseUrl + "/api/v1/institutes/" + this.institute_id;
        return this.http.get(url, { headers: this.headers }).map(
            res => { return res; },
            err => { return err; }
        );
    }

    getAllplan(): Observable<any> {
        let url = this.baseUrl + "/api/v1/proctur/getAllPlans";
        return this.http.get(url, { headers: this.headers }).map(
            res => { return res; },
            err => { return err; }
        );
    }

    getAllocatedStorageDetails(): any {
        let url = this.baseUrl + "/api/v1/instFileSystem/getUsedSpace/" + this.institute_id;
        return this.http.get(url, { headers: this.headers }).
            map(
                res => {
                    return res;
                },
                err => {
                    return err;
                }

            );


    }

    getAttendance(obj): any {
        let url = this.baseUrl + "/api/v1/attendance";
        return this.http.post(url, obj, { headers: this.headers }).map(
            res => {
                return res;
            },
            err => {
                return err;
            }
        )
    }

    getAllteachers(): Observable<any> {
        let url = this.baseUrl + "/api/v1/teachers/all/" + this.institute_id + "?active=Y";

        return this.http.get(url, { headers: this.headers }).map(
            res => {
                return res;
            },
            err => {
                return err;
            }
        )
    }


    updateAttendance(obj): Observable<any> {
        let url = this.baseUrl + "/api/v1/attendance";

        return this.http.put(url, obj, { headers: this.headers }).map(
            res => {
                return res;
            },
            err => {
                return err;
            }
        )
    }


    cancelClassSchedule(obj) {
        let url = this.baseUrl + "/api/v1/batchClsSched/cancel";

        return this.http.put(url, obj, { headers: this.headers }).map(
            res => {
                return res;
            },
            err => {
                return err;
            }
        )
    }


    cancelCourseSchedule(obj) {
        let url = this.baseUrl + "/api/v1/courseClassSchedule/cancelMasterClassSchedule";

        return this.http.post(url, obj, { headers: this.headers }).map(
            res => {
                return res;
            },
            err => {
                return err;
            }
        )
    }


    cancelBatchSchedule(obj) {
        let url = this.baseUrl + "/api/v1/batchClsSched/cancel";

        return this.http.put(url, obj, { headers: this.headers }).map(
            res => {
                return res;
            },
            err => {
                return err;
            }
        )
    }

    notifyStudentSchedule(obj) {
        let url = this.baseUrl + "/api/v1/coursePlanner/notify";

        return this.http.post(url, obj, { headers: this.headers }).map(
            res => { return res; },
            err => { return err; }
        )
    }


    reScheduleClass(obj): Observable<any> {
        let url = this.baseUrl + "/api/v1/batchClsSched/reschedule";

        return this.http.put(url, obj, { headers: this.headers }).map(
            res => {
                return res;
            },
            err => {
                return err;
            }
        )
    }

    fetchCourseLevelWidgetData(obj) {
        let url = this.baseUrl + '/api/v1/courseClassSchedule/fetchMasterCourseDetails/todaySchedule';
        return this.http.post(url, obj, { headers: this.headers }).map(
            res => {
                return res;
            },
            err => {
                return err;
            }
        )
    }

    fetchCourseAttendance(obj) {
        let url = this.baseUrl + '/api/v1/attendance/course';
        return this.http.post(url, obj, { headers: this.headers }).map(
            res => {
                return res;
            },
            err => {
                return err;
            }
        )
    }

    updateCourseAttendance(obj): Observable<any> {
        let url = this.baseUrl + "/api/v1/attendance/course";

        return this.http.put(url, obj, { headers: this.headers }).map(
            res => {
                return res;
            },
            err => {
                return err;
            }
        )
    }

    remindCourseLevel(obj): Observable<any> {
        let url = this.baseUrl + "/api/v1/courseClassSchedule/sendCourseMasterReminder";

        return this.http.post(url, obj, { headers: this.headers }).map(
            res => {
                return res;
            },
            err => {
                return err;
            }
        )
    }

    getListOfTopics(batchId): Observable<any> {
        let url = this.baseUrl + "/api/v1/topic_manager/getAllTopics/" + this.institute_id;

        return this.http.post(url, batchId, { headers: this.headers }).map(
            res => {
                return res;
            },
            err => {
                return err;
            }
        )
    }

    fetchCombinedData(standard_id, subject_id) {
        let url = this.baseUrl + "/api/v1/batches/fetchCombinedBatchData/" + this.institute_id + "?standard_id=" + standard_id + "&subject_id=" + subject_id + "&assigned=Y";
        return this.http.get(url, { headers: this.headers }).map(
            res => {
                return res;
            },
            err => {
                return err;
            }
        )
    }

    fetchStudentListData(batch_id) {
        let url = this.baseUrl + "/api/v1//studentBatchMap/batches/" + batch_id;
        return this.http.post(url, "", { headers: this.headers }).map(
            res => {
                return res;
            },
            err => {
                return err;
            }
        )
    }


    saveMessageTOServer(obj) {
        let url = this.baseUrl + "/api/v1/notification/message/" + this.institute_id;
        return this.http.post(url, obj, { headers: this.headers }).map(
            res => {
                return res;
            },
            err => {
                return err;
            }
        )
    }

    getAllActiveStudentList() {
        let url = this.baseUrl + "/api/v1/students/all/" + this.institute_id + "?active=Y";
        return this.http.get(url, { headers: this.headers }).map(
            res => {
                return res;
            },
            err => {
                return err;
            }
        )
    }

    getAllTeacherList() {
        let url = this.baseUrl + "/api/v1/teachers/all/" + this.institute_id + "?active=Y";
        return this.http.get(url, { headers: this.headers }).map(
            res => {
                return res;
            },
            err => {
                return err;
            }
        )
    }

    getAllInActiveList() {
        let url = this.baseUrl + "/api/v1/students/all/" + this.institute_id + "?active=NA";
        return this.http.get(url, { headers: this.headers }).map(
            res => {
                return res;
            },
            err => {
                return err;
            }
        )
    }

    getAllAluminiList() {
        let url = this.baseUrl + "/api/v1/archive/students/alumni/" + this.institute_id;
        return this.http.get(url, { headers: this.headers }).map(
            res => {
                return res;
            },
            err => {
                return err;
            }
        )
    }

    getMessageList(obj) {
        let url = this.baseUrl + "/api/v1/notification/message/" + this.institute_id + "/all";
        return this.http.post(url, obj, { headers: this.headers }).map(
            res => {
                return res;
            },
            err => {
                return err;
            }
        )
    }


    sendNotification(obj) {
        obj.institution_id = this.institute_id;
        let url = this.baseUrl + "/api/v1/alerts/config";
        return this.http.post(url, obj, { headers: this.headers }).map(
            res => {
                return res;
            },
            err => {
                return err;
            }
        )
    }

    sendPushNotificationToServer(obj) {
        obj.institution_id = this.institute_id;
        let url = this.baseUrl + "/api/v1/pushNotification/send";
        return this.http.post(url, obj, { headers: this.headers }).map(
            res => {
                return res;
            },
            err => {
                return err;
            }
        )
    }

    smsForAddDownload(obj) {
        let url = this.baseUrl + "/api/v1/profiles/sendAPPSMS/" + this.institute_id;
        return this.http.post(url, obj, { headers: this.headers }).map(
            res => {
                return res;
            },
            err => {
                return err;
            }
        )
    }


    ///Course Model Api

    getAllMasterCourse() {
        let url = this.baseUrl + "/api/v1/courseMaster/fetch/" + this.institute_id + "/all";
        return this.http.get(url, { headers: this.headers }).map(
            res => {
                return res;
            },
            err => {
                return err;
            }
        )
    }

    getAllCourse(name) {
        let url = this.baseUrl + "/api/v1/courseMaster/fetch/" + this.institute_id + "/" + name;
        return this.http.get(url, { headers: this.headers }).map(
            res => {
                return res;
            },
            err => {
                return err;
            }
        )
    }

    getStudentListOfCourse(obje) {
        let url = this.baseUrl + "/api/v1/studentBatchMap/manageBatchStudent/" + this.institute_id;
        return this.http.post(url, obje, { headers: this.headers }).map(
            res => {
                return res;
            },
            err => {
                return err;
            }
        )
    }


    getMasterCourseDetails(obj) {
        obj.inst_id = this.institute_id;
        let url = this.baseUrl + "/api/v1/courseClassSchedule/fetch";
        return this.http.post(url, obj, { headers: this.headers }).map(
            res => {
                return res;
            },
            err => {
                return err;
            }
        )
    }



    /// Exam Section

    //get Exam Schedule 

    getExamSchedule(obj) {
        let url = this.baseUrl + "/api/v1/dashboard/admin/studentExamSchedules/" + this.institute_id;
        return this.http.post(url, obj, { headers: this.headers }).map(
            res => { return res; },
            err => { return err; }
        )
    }

    cancelExamSchedule(obj) {
        let url = this.baseUrl + "/api/v1/batchExamSched/cancel";
        return this.http.put(url, obj, { headers: this.headers }).map(
            res => { return res; },
            err => { return err; }
        )
    }

    notifyStudentExam(id) {
        let url = this.baseUrl + "/api/v1/batchExamSched/notify/" + this.institute_id + "/" + id;
        return this.http.get(url, { headers: this.headers }).map(
            res => { return res; },
            err => { return err; }
        )
    }

    sendReminder(obj) {
        obj.inst_id = this.institute_id;
        let url = this.baseUrl + "/api/v1/courseExamSchedule/sendReminder";
        return this.http.post(url, obj, { headers: this.headers }).map(
            res => { return res; },
            err => { return err; }
        )
    }

    fetchStudentList(data) {
        let url = this.baseUrl + "/api/v1/attendance/exam";
        return this.http.post(url, data, { headers: this.headers }).map(
            res => { return res; },
            err => { return err; }
        )
    }

    markAttendance(data) {
        let url = this.baseUrl + "/api/v1/attendance/exam";
        return this.http.put(url, data, { headers: this.headers }).map(
            res => { return res; },
            err => { return err; }
        )
    }

    fetchStudentExamDetails(batch_id, Schedule) {
        let url = this.baseUrl + "/api/v1/StdExam/" + batch_id + '?schd_id=' + Schedule;
        return this.http.get(url, { headers: this.headers }).map(
            res => { return res; },
            err => { return err; }
        )
    }

    updateAttendanceDetails(obj) {
        let url = this.baseUrl + "/api/v1/StdExam";
        return this.http.post(url, obj, { headers: this.headers }).map(
            res => { return res; },
            err => { return err; }
        )
    }

    getExamGrades() {
        let url = this.baseUrl + "/api/v1/grade_manager/getDetail/" + this.institute_id;
        return this.http.get(url, { headers: this.headers }).map(
            res => { return res; },
            err => { return err; }
        )
    }

    //Course Model API

    getCourseExamFromServer(obj) {
        obj.inst_id = this.institute_id;
        let url = this.baseUrl + "/api/v1/courseExamSchedule/fetchExamSchld";
        return this.http.post(url, obj, { headers: this.headers }).map(
            res => { return res },
            err => { return err }
        )
    }

    markStudentAttendance(obj) {
        let url = this.baseUrl + "/api/v1/StdCourseExam/markAttendance";
        return this.http.post(url, obj, { headers: this.headers }).map(
            res => { return res },
            err => { return err }
        )
    }

    markStudentMarks(obj) {
        let url = this.baseUrl + '/api/v1/StdCourseExam/updateMarks';
        return this.http.post(url, obj, { headers: this.headers }).map(
            res => { return res },
            err => { return err }
        )
    }

    getExamStudentsList(id) {
        let url = this.baseUrl + "/api/v1/StdCourseExam/" + id;
        return this.http.get(url, { headers: this.headers }).map(
            res => { return res; },
            err => { return err; }
        )
    }

    cancelExamScheduleCourse(obj) {
        obj.inst_id = this.institute_id;
        let url = this.baseUrl + "/api/v1/courseExamSchedule/cancel";
        return this.http.post(url, obj, { headers: this.headers }).map(
            res => { return res; },
            err => { return err; }
        )
    }

    // SMS Approve/Reject

    changesSMSStatus(obj, id) {
        let url = this.baseUrl + "/api/v1/notification/message/" + this.institute_id + "/" + id;
        return this.http.put(url, obj, { headers: this.headers }).map(
            res => { return res },
            err => { return err }
        );
    }

}