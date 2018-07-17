export interface BatchModel {
    batch_id: number;
    teacher_id: number;
    alt_teacher_id: number;
    subject_id: number;
    batch_name: string;
    batch_code?: any;
    is_active: string;
    start_date: string;
    end_date: string;
    created_by?: any;
    created_date?: string;
    standard_id: number;
    standard_name: string;
    subject_name: string;
    isAssigned: string;
    total_students: number;
    batchIds?: any;
    file_access_start_time: string;
    file_access_end_time: string;
    is_file_shared: string;
    teacher_name: string;
    class_room_id: number;
    class_room_name: string;
    standardLi?: any;
    subjectLi?: any;
    batchLi?: any;
    start_time?: any;
    end_time?: any;
    weeklyScheduleEnabled: string;
    is_exam_grad_feature: number;
    isStudentToBeInactivated: string;
    inst_admin_userid?: any;
    academic_year_id: string;
    feeTemplateList: FeeTemplateList[];
    selected_fee_template_id: number;
    inst_id: number;
    batchArray?: any;
    role?: any;
}


interface FeeTemplateList {
    feeTypeMap?: any;
    customFeeSchedules?: any;
    registeredServiceTax?: any;
    toCreate: boolean;
    studentArray?: any;
    studentwise_total_fees_amount: number;
    studentwise_total_fees_balance_amount: number;
    studentwise_total_fees_amount_paid: number;
    studentwise_total_fees_discount: number;
    studentwise_fees_tax_applicable: string;
    no_of_installments: number;
    discount_fee_reason?: any;
    template_name: string;
    template_id: number;
    template_effective_date: string;
    is_fee_schedule_created: string;
    is_fee_tx_done: string;
    is_undo: string;
    is_fee_other_inst_created: string;
    is_delete_other_fee_types: number;
    chequeDetailsJson?: any;
    payment_mode: string;
    remarks: string;
    paid_date: string;
    is_cheque_details_required: string;
    reference_no: string;
    invoice_no?: any;
    course_id: number;
    subject_id: number;
    standard_id: number;
    master_course: string;
    course_subject_name: string;
    student_create_screen: boolean;
    master_course_standard_name: string;
    is_default: number;
    template_total_initial_amount: number;
    enable_fee_discount_installment_wise: boolean;
}

export interface BatchData {
    isSelected: boolean,
    data: BatchModel,
    assignDate?: any,
}

export class BatchList implements BatchData {

    isSelected: boolean = false;
    data: BatchModel;
    assignDate?: any = "";
    
    constructor(isSelected: boolean, data: BatchModel, assignDate: any) {
        this.isSelected = isSelected;
        this.data = data;
        this.assignDate = assignDate;
    }
}