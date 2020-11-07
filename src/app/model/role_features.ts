export class role {

    static features = {
        // New features
        DASHBOARD_SCHEDULE: true,
        DASHBOARD_FEE_STATS: true,
        DASHBOARD_ACCOUNT_STATS: true,
        DASHBOARD_BIRTHDAY: true,
        DASHBOARD_LEAD_STATS: true,
        LEAD_MENU_ITEM: true,
        LEAD_ADD_CAMPAIGN: true,
        LEAD_MANAGE_CAMPAIGN: true,
        LEAD_MANAGE_ENQUIRY: true,
        STUDENT_MENU_ITEM: true,
        STUDENT_ADD_UPLOAD: true,
        STUDENT_MANAGE: true,
        STUDENT_REPORT_CARD: true,
        FEE_MENU: true,
        FEE_MANAGE: true,
        FEE_CHEQUE_MANAGE: true,
        FEE_DUE_DETAILS: true,
        FEE_PAYMENT_HISTORY: true,
        CLASS_MENU: true,
        EXAMS_MENU: true,
        STUDY_MATERIAL_MENU: true,
        LIVE_CLASS_MENU: true,
        COMMUNICATE_MENU: true,
        COMMUNICATE_ADD_SEND: true,
        COMMUNICATE_PTM: true,
        COMMUNICATE_EVENTS: true,
        ESTORE_MENU: true,
        ESTORE_MANAGE_PRODUCT: true,
        ESTORE_REGISTER_USER: true,
        ESTORE_MANAGE_OFFER: true,
        LIBRARY_MENU: true,
        EXPENSE_MENU: true,
        ONLINE_TESTS_MENU: true,
        REPORTS_MENU: true,
        REPORT_ENQUIRY_COUNSELLOR: true,
        REPORTS_ENQUIRY_SOURCE: true,
        REPORTS_ENQUIRY_REFFER_BY: true,
        REPORTS_ENQUIRY_CAMPAIGN: true,
        REPORT_ENQUIRY_COURSE_WISE: true,
        REPORT_FEES_DUE_REPORT: true,
        REPORT_FEE_GST_REPORT: true,
        REPORT_FEE_MONITORING_DASHBOARD: true,
        REPORT_FEES_ONLINE_FEES: true,
        REPORT_COURSE_EXAM_R: true,
        REPORT_COURSE_ATTENDANCE: true,
        REPORT_COURSE_BIOMETRIC: true,
        REPORT_COURSE_EXAM_DASHBOARD: true,
        REPORT_PRODUCT_SALES: true,
        REPORT_PRODUCT_COUPON: true,
        REPORT_MISC_SMS: true,
        REPORTS_MISC_EMAIL: true,
        MANAGE_BRANCHES_MENU: true,
        MY_ACCOUNTS_MENU: true,
        USERS_MENU: true,
        SETTINGS_MENU: true,
        SETUP_MENU: true,
        MOBILE_NUMBER_VISIBILITY: true,
        DOWNLOAD_FEE_REPORT: true,
        DOWNLOAD_STUDENT_REPORT: true,
        DOWNLOAD_ENQUIRY_REPORT: true
        };
    // customPermissions : {
    // Old features
    manageBatchAttendance?: any;
    manageFee?: any;
    manageStudentExam?: any;
    manageNotificationsMessages?: any;
    manageNotifications?: any;
    viewInstituteExpenses?: any;
    viewInstituteIncomes?: any;
    viewEnquiries?: any;
    manageBatchExamAttendance?: any;
    manageBatchPTM?: any;
    manage_file_manager?: any;
    manageEnquiriesByAdmin?: any;
    manageFeeLimitedAccess1?: any;
    manageFeeLimitedAccess2?: any;
    activity_employee_manage?: any;
    activity_employee_attendance?: any;
    activity_employee_leaves?: any;
    activity_employee_holidays?: any;
    attendanceReport?: any;
    feeReport?: any;
    studentExamReport?: any;
    studentReport?: any;
    manageBatchTimeTableReport?:any;
    smsReport?: any;
    emailReport?: any;
    ProfitNLossReport?: any;
    viewStudents?: any;
    registerdStudents?: any;
    manageStudentBatches?: any;
    viewBatch?: any;
    batchClassSchedule?: any;
    feeSchedule?: any;
    examSchedule?: any;
    manageCoursePlanner?: any;
    batchExamTestMapping?: any;
    viewStandard?: any;
    viewSubject?: any;
    viewTeacher?: any;
    manageSchools?: any;
    viewCourseMasters?: any;
    studentWiseFeeStructure?: any;
    viewSlots?: any;
    manageClassRooms?: any;
    manageAcademicYears?: any;
    viewUserProfiles?: any;
    instituteDetails?: any;
    instituteSettings?: any;
    manage_roles?: any;
    courseClassSchedule?: any;
    courseExamSchedule?: any;
    coursefeeSchedule?: any;
    manageCourseCoursePlanner?: any;
    manageStudentCoursesAssignment?: any;
    courseExamTestMapping?: any;
    fee_payment_for_past_dates?: any;
    fee_transaction_change?: any;
    fee_Summary_stats_and_chart?: any;
    fee_reconfiguration?: any;
    show_payment_history_by_counseller?: any;
    fee_summary_report?: any;
    fee_discounting?: any;
    update_payment_and_manage_cheque_pdc?: any;
    manage_expense_full_acess?: any;
    manage_expense_limited_access?: any;
    Fee_Report_Payment_history_Full_Access?: any;
    activity_study_material?: any;
    display_the_student_account_credentials?: any;
    Library_Management?: any;
    Reports_Enquiry_Report?: any;
    Download_Enquiry_Report?: any;
    Download_Student_Report?: any;
    Download_Fee_Report?: any;
    Mobile_Number_Visibility?: any;
    eStore_Visibility?: any;
    Enquiry_Bulk_Upload_Feature?: any;

    // }
    checkPermissions() {
        console.log(sessionStorage.getItem('permissions'));
        let session_permission = sessionStorage.getItem('permissions');
        let permissions = [];
        if(sessionStorage.getItem('permissions') != '' && sessionStorage.getItem('permissions') != null) {
        permissions = JSON.parse(session_permission);
        }
        console.log(permissions);
        role.features.DASHBOARD_SCHEDULE = permissions.includes(5001) ? true : false;
        role.features.DASHBOARD_FEE_STATS = permissions.includes(5002) ? true : false;
        role.features.DASHBOARD_ACCOUNT_STATS = permissions.includes(5003) ? true : false;
        role.features.DASHBOARD_BIRTHDAY = permissions.includes(5004) ? true : false;
        role.features.DASHBOARD_LEAD_STATS = permissions.includes(5005) ? true : false;
        role.features.LEAD_MENU_ITEM = permissions.includes(5006) ?  true : false;
        role.features.LEAD_ADD_CAMPAIGN = permissions.includes(5007) ? true : false;
        role.features.LEAD_MANAGE_CAMPAIGN = permissions.includes(5008) ? true : false;
        role.features.LEAD_MANAGE_ENQUIRY = permissions.includes(5009) ? true : false;
        role.features.STUDENT_MENU_ITEM = permissions.includes(5010) ? true : false;
        role.features.STUDENT_ADD_UPLOAD = permissions.includes(5011) ? true : false;
        role.features.STUDENT_MANAGE = permissions.includes(5012) ? true : false;
        role.features.STUDENT_REPORT_CARD = permissions.includes(5013) ? true : false;
        role.features.FEE_MENU = permissions.includes(5014) ? true : false;
        role.features.FEE_MANAGE = permissions.includes(5015) ? true : false;
        role.features.FEE_CHEQUE_MANAGE = permissions.includes(5016) ? true : false;
        role.features.FEE_DUE_DETAILS = permissions.includes(5017) ? true : false;
        role.features.FEE_PAYMENT_HISTORY = permissions.includes(5018) ? true : false;
        role.features.CLASS_MENU = permissions.includes(5019) ? true : false;
        role.features.EXAMS_MENU = permissions.includes(5020) ? true : false;
        role.features.STUDY_MATERIAL_MENU = permissions.includes(5021) ? true : false;
        role.features.LIVE_CLASS_MENU = permissions.includes(5022) ? true : false;
        role.features.COMMUNICATE_MENU = permissions.includes(5023) ? true : false;
        role.features.COMMUNICATE_ADD_SEND = permissions.includes(5024) ? true : false;
        role.features.COMMUNICATE_PTM = permissions.includes(5025) ? true : false;
        role.features.COMMUNICATE_EVENTS = permissions.includes(5026) ? true : false;
        role.features.ESTORE_MENU = permissions.includes(5027) ? true : false;
        role.features.ESTORE_MANAGE_PRODUCT = permissions.includes(5028) ? true : false;
        role.features.ESTORE_REGISTER_USER = permissions.includes(5029) ? true : false;
        role.features.ESTORE_MANAGE_OFFER = permissions.includes(5030) ? true : false;
        role.features.LIBRARY_MENU = permissions.includes(5031) ? true : false;
        role.features.EXPENSE_MENU = permissions.includes(5032) ? true : false;
        role.features.ONLINE_TESTS_MENU = permissions.includes(5033) ? true : false;
        role.features.REPORTS_MENU = permissions.includes(5034) ? true : false;
        role.features.REPORT_ENQUIRY_COUNSELLOR = permissions.includes(5035) ? true : false;
        role.features.REPORTS_ENQUIRY_SOURCE = permissions.includes(5036) ? true : false;
        role.features.REPORTS_ENQUIRY_REFFER_BY = permissions.includes(5037) ? true : false;
        role.features.REPORTS_ENQUIRY_CAMPAIGN = permissions.includes(5038) ? true : false;
        role.features.REPORT_ENQUIRY_COURSE_WISE = permissions.includes(5039) ? true : false;
        role.features.REPORT_FEES_DUE_REPORT = permissions.includes(5040) ? true : false;
        role.features.REPORT_FEE_GST_REPORT = permissions.includes(5041) ? true : false;
        role.features.REPORT_FEE_MONITORING_DASHBOARD = permissions.includes(5042) ? true : false;
        role.features.REPORT_FEES_ONLINE_FEES = permissions.includes(5043) ? true : false;
        role.features.REPORT_COURSE_EXAM_R = permissions.includes(5044) ? true : false;
        role.features.REPORT_COURSE_ATTENDANCE = permissions.includes(5045) ? true : false;
        role.features.REPORT_COURSE_BIOMETRIC = permissions.includes(5046) ? true : false;
        role.features.REPORT_COURSE_EXAM_DASHBOARD = permissions.includes(5047) ? true : false;
        role.features.REPORT_PRODUCT_SALES = permissions.includes(5048) ? true : false;
        role.features.REPORT_PRODUCT_COUPON = permissions.includes(5049) ? true : false;
        role.features.REPORT_MISC_SMS = permissions.includes(5050) ? true : false;
        role.features.REPORTS_MISC_EMAIL = permissions.includes(5051) ? true : false;
        role.features.MANAGE_BRANCHES_MENU = permissions.includes(5052) ? true : false;
        role.features.MY_ACCOUNTS_MENU = permissions.includes(5053) ? true : false;
        role.features.USERS_MENU = permissions.includes(5054) ? true : false;
        role.features.SETTINGS_MENU = permissions.includes(5055) ? true : false;
        role.features.SETUP_MENU = permissions.includes(5056) ? true : false;
        role.features.MOBILE_NUMBER_VISIBILITY = permissions.includes(5057) ? true : false;
        role.features.DOWNLOAD_FEE_REPORT = permissions.includes(5058) ? true : false;
        role.features.DOWNLOAD_STUDENT_REPORT = permissions.includes(5059) ? true : false;
        role.features.DOWNLOAD_ENQUIRY_REPORT = permissions.includes(5060) ? true : false;
    }
}