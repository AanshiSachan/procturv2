import { Injectable } from '@angular/core';

@Injectable()
export class MessageShowService {

  toastTypes: any = {
    error: 'error',
    success: 'success',
    info: 'info',
    warning: 'warning'
  }
  object: any = {
    toastMessages: {
      notFound: 'No Records Found'
    },
    SMSMessages: {
      saveSMS: "SMS Template saved",
      failSMS: "Failed To Edit SMS Template",
      notSend: 'Unable To Send SMS',
      sendSMS: 'SMS sent',
      blankSMS: "Cannot Send Blank SMS",
      addNewSMS: "New SMS Added"
    },
    internetError: {
      unableToConnect: 'Unable To Connect To Server',

    },
    enquiryMessages: {
      failEnquiry: "Failed To Assign Enquiry",
      assignEnquiry: 'Enquiries Assigned',
      update: 'Enquiry Updated',
      failUpdate: 'Failed To Update Enquiry',
      adminEnquiry: 'You Are Not Authorized To Assign Enquiries, Contact Administrator For Access',
      bulkAction: 'Please Select An Enquiry To Perform Bulk Action',
      sendBulkSMS: 'Please Select An Enquiry To Send Bulk SMS',
      delete: "Enquiry Deleted from Record",
      failDelete: 'Failed To Delete Enquiry',
      unableDelete: "Unable to Delete Enquiries",
      selectToDelete: 'Please Select An Enquiry To Be Deleted',
      deleteEnquiry: 'You Are Not Authorized To Delete Enquiries, Contact Administrator For Access'

    },
    dateTimeMessages: {
      invalideDateTime: "Invalid Date Time Input",
    }
  };

  constructor() { }

}
