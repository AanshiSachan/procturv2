export interface StudentForm {
	student_name?: any, //"test 122",
	country_id?: any,
	state_id?: any,
	city_id?: any,
	area_id?: any,
	student_sex?: any, //"M",
	student_email?: any, // "tester@gmail.com",
	student_phone?: any, // "8844334455",
	student_curr_addr?: any, // "kskskskksddddddddd",
	dob?: any, // "2005-07-12",
	doj?: any, // "2017-10-25",
	expiry_date?: any // "2017-10-25",
	school_name?: any, // "943",
	student_class?: any, // "1269",
	student_class_key?: any,
	parent_name?: any, // "test parent",
	parent_email?: any, // "ggere@gmail.com",
	parent_phone?: any, // "2233331111",
	guardian_name?: any, // "sksk",
	guardian_email?: any, // "jdjdd@gmail.com",
	guardian_phone?: any, // "9999992222",
	is_active?: any, // "Y",
	institution_id?: any, // "100123",
	assignedBatches?: any, // ["5660", "2447", "4163", "3067"],
	assignedBatchescademicYearArray?: any;
	assignedCourse_Subject_FeeTemplateArray?: any;
	fee_type?: any, // 0,
	fee_due_day?: any, // 0,
	batchJoiningDates?: any, // ["2017-10-25", "2017-10-25", "2017-10-25", "2017-10-25"],
	comments?: any, // "",
	photo?: any, // null,
	enquiry_id?: any, // "",
	student_disp_id?: any, // "",
	student_manual_username?: any, // null,
	social_medium?: any, // -1,
	attendance_device_id?: any, // "",
	religion?: any, // "",
	standard_id?: any, // null,
	subject_id?: any, // null,
	slot_id?: any, // null,
	language_inst_status?: any, // null,
	stuCustomLi?: any, //
	deleteCourse_SubjectUnPaidFeeSchedules: any,
	archivedStudent?: any,
	studentFileUploadJson?: any,
	assigned_to_id?: any
	optional_subject_id?: any,
	birth_place?: any,
	blood_group?: any,
	category?: any,
	nationality?: any,
	student_adhar_no?: any,
	parent_adhar_no?: any,
	parent_profession?: any,
	mother_tounge?: any,
	extra_curricular_activities?: any,
	educational_group?: any,
	pin_code?: any,
	inst_acad_year_id?: any
}
