export class Topic {
  topicId: string;
  topicName: string;
  parentTopicId: string;
  estimated_time: number;
  description: string;
  subTopic: Topic[];
  addSubtopic: any[];
  isEdit: boolean = false;
  isExpand:boolean = false;
}

export class Create_Topic {
  name: string = '';
  standard_id: string = '-1';
  subject_id: string = '-1';
  parent_topic_id: string = '-1';
  description: string = '';
  estimated_time: number = 0;
  institute_topic_id: string = '-1';
  priority_order: number = 0;
}
