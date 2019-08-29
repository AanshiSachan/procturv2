import moment = require("moment");

export class product_details {
    entity_id:string=null;
    created_date: string = "";
    updated_date: string = "";
    institute_id: string = "";
    is_active: string = "";
    title: string = "";
    logo_url: any = null;
    about: string = "";
    is_paid: any = true;
    price: number = 0.00;
    valid_from_date: string = moment().format('DD-MMM-YYYY');
    valid_to_date: string = moment().format('DD-MMM-YYYY');
    status: number = 10;
    purchase_limit: number = 0;
    product_ecourse_maps: any[] = [];
    product_items_types: any[] = [];
    product_item_stats: any = {
        study_material:0,
        mock_test: 0,
        online_exams: 0,
        live_classes: 0,
        assignments: 0
    }
}