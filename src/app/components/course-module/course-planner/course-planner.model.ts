import * as moment from 'moment';

export class CoursePlanner {
  standard_id?: String = "-1";
  subject_id?: String = "-1";
  master_course_name?: String = "-1";
  course_id?: String = "-1";
  batch_id?: String = "-1";
  from_date?: String = moment().isoWeekday("Monday").format("MM-DD-YYYY");
  to_date?: String = moment().weekday(7).format("MM-DD-YYYY");
  isCompleted?: String = "Y";
  isPending?: String = "Y";
  isCancelled?: String = "Y";
  isUpcoming?: String = "Y";
  isMarksUpdate?: String = "Y";
  teacher_id?: String = "-1";
};
