import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'names' })
export class CustomNamePipe implements PipeTransform {
    transform(value: any): string {
        switch (value) {

            case 'All': {
                return "All Enquiries";
            }

            case 'Pending Followup': {
                return "Enquiries Pending Followup";
            }

            case 'Open': {
                return "Open Enquiries";
            }

            case 'In_Progress': {
                return "In-Progress Enquiries";
            }

            case 'Registered': {
                return "Student Registered";
            }

            case 'Student_Admitted': {
                return "Student Admitted";
            }

            case 'Inactive': {
                return "Inactive Enquiries";
            }

            case 'Walkin': {
                return "Walkin Enquiries";
            }

            default: {
                return value;
            }

        }

    }

}