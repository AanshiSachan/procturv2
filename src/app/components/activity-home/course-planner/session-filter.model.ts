
export class SessionFilter {
  isCompleted?: boolean = true;
  isPending?: boolean = true;
  isCancelled?: boolean = true;
  isUpcoming?: boolean = true;
  isMarksUpdate?: boolean = true;
  from_date?: string = "";
  to_date?: string = "";
  masterCourse?: string = "";
  courseId?: string = "";
  batchId?: string = "";
  standardId?: string = "";
  subjectId?: string = "";
  facultyId?: string = "";
  thisWeek?: boolean = true;
  lastWeek?: boolean = false;
  thisMonth?: boolean = false;
  custom?: boolean = false;
};
