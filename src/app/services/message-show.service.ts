import { Injectable } from '@angular/core';
import { Toast, ToasterService, ToasterConfig } from 'angular2-toaster';

@Injectable()
export class MessageShowService {

  constructor(
    private toasterService: ToasterService
  ) { }

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
      sendSMS: 'Test Message Send Successfully!',
      blankSMS: "Cannot Send Blank SMS",
      addNewSMS: "New SMS Added",
      notMultiSMS: 'Cannot Send Multiple Test SMS',
      loadError: "Error loading SMS",

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
      incorrectDetails: "Incorrect Details"
    },
    academicMessages: {

    },
    campaignMessages: {
      selectMsg: "Campaign created successfully!",
    },
    generalMessages: {
      notFound: 'No Records Found',
      invalidNumber: "Invalid Mobile Number",
    },
    functionalMsg: {
      uploadFail: "File uploaded Failed",
      invalidType: "Invalid File Type",
      uploaded: "File uploaded successfully!",
      sameName: "Name already exist",
      mandatoryInfo: "Please provide mandatory information"
    },
    batchMsg: {
      notSelect: "Batch Not Selected",
      inValid: 'Subject And Batch Invalid',
      notStandard: 'Standard Not Selected',
      selectAll: 'Standard, Subject And Batch Not Selected',
    },
    loginMsg: {
      invalid: {
        title: "Invalid Input",
        body: "Please specify Email ID/Phone No"
      },
      invalidPass: {
        title: "Error",
        body: "Please specify Password"
      },
      notRegister: {
        title: "Error",
        body: "Invalid Login Credentials"
      },
      instituteNotRegister: {
        title: "Institute not registered",
        body: "Your institute not registered to use this"
      },
      invalidEmail: {
        title: "Email Not Verified",
        body: "Kindly, Login to mail and verify that its you"
      },
      opt: {
        notFound: {
          title: "Not Found",
          body: "Kindly, Enter the OTP"
        },
        expired: {
          title: "OTP Expired",
          body: "Kindly, Regenerate the OTP"
        },
        inCorrect: {
          title: "OTP Incorrect",
          body: "Kindly, Enter the right OTP"
        }

      },
      success:{
        title: "Password Reset Successfull",
        body: "Kindly check your Mobile/Email Id for further Details!"
      }

    }
  };

  // toast function 
  showErrorMessage(objType, massage, body) {
    let toast: Toast = {
      type: objType,
      title: massage,
      body: body
    };
    this.toasterService.pop(toast);
  }


  getMessages() {
    return this.object;
  }
}
