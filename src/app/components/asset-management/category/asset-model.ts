export class AssetModel {

    active = true;
    category_id;
    asset_code = '';
    asset_condition = '-1';
    location_id = '';
    asset_name = '';
    institute_id = sessionStorage.getItem('institute_id');
    quantity: number;

}
