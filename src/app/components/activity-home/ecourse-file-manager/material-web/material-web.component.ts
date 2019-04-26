import { Component, OnInit, Input, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-material-web',
  templateUrl: './material-web.component.html',
  styleUrls: ['./material-web.component.scss']
})
export class MaterialWebComponent implements OnInit {

  @Input()
  ngTemplateOutletContext: Object;
  @Input()
  ngTemplateOutlet: TemplateRef<any>;

  @Input()
  treeData: any = [
      {name:"parent1", subnodes:[]},
      {name:"parent2", 
          subnodes:[
                  {name:"parent2_child1", subnodes:[]}
              ]},
      {name:"parent3", 
          subnodes:[
                  {name:"parent3_child1", 
                      subnodes:[
                              {name:"parent3_child1_child1", subnodes:[]}
                          ]
                  }
              ]
      }
  ];


  @Input()
  materialData: any = [
    {
        "topic_id": 103,
        "topic_name": "Laws and Friction",
        "total_videos": 0,
        "total_study_materials": 0,
        "total_exam": 0,
        "total_assignments": 0,
        "total_notes": 0,
        "total_gallery": 0,
        "total_others": 0,
        "parent_topic_id": 0,
        "institute_id": 0,
        "total_audio_notes": 0,
        "total_images": 0,
        "total_previous_year_questions_paper": 0,
        "videosList": [
            {
                "file_id": "403",
                "file_name": null,
                "size": "0.0",
                "desc": "url aws",
                "downloads": 0,
                "institute_id": 0,
                "title": "Prime YouTube Video",
                "category_id": 231,
                "category_name": "Youtube URL",
                "subject_id": 0,
                "topic_id": 0,
                "uploadedBy": "admin",
                "course_types": "",
                "video_url": "100058/https://www.youtube.com/watch?v=MCYyUhjk-Ns",
                "sub_topic_id": 0,
                "fileIdArray": null,
                "activeORInactivArray": null,
                "is_readonly": "N"
            }
        ]
    },
    {
        "topic_id": 109,
        "topic_name": "Formulae",
        "total_videos": 0,
        "total_study_materials": 0,
        "total_exam": 0,
        "total_assignments": 0,
        "total_notes": 0,
        "total_gallery": 0,
        "total_others": 0,
        "parent_topic_id": 0,
        "institute_id": 0,
        "total_audio_notes": 0,
        "total_images": 0,
        "total_previous_year_questions_paper": 0,
        "videosList": [
            {
                "file_id": "403",
                "file_name": null,
                "size": "0.0",
                "desc": "url aws",
                "downloads": 0,
                "institute_id": 0,
                "title": "SSC CGL Part I",
                "category_id": 231,
                "category_name": "Youtube URL",
                "subject_id": 0,
                "topic_id": 0,
                "uploadedBy": "admin",
                "course_types": "",
                "video_url": "100058/https://www.youtube.com/watch?v=MCYyUhjk-Ns",
                "sub_topic_id": 0,
                "fileIdArray": null,
                "activeORInactivArray": null,
                "is_readonly": "N"
            }
        ],
        "assignmentList": [
            {
                "file_id": "387",
                "file_name": "https://s3-ap-southeast-1.amazonaws.com/testeduimspro/Admissions_Summary_Report.xls",
                "size": "0.02836",
                "desc": "upload aws",
                "downloads": 0,
                "institute_id": 0,
                "title": "CGL Part I Notes",
                "category_id": 63,
                "category_name": "Assignment",
                "subject_id": 0,
                "topic_id": 0,
                "uploadedBy": "admin",
                "course_types": "",
                "video_url": null,
                "sub_topic_id": 0,
                "fileIdArray": null,
                "activeORInactivArray": null,
                "is_readonly": "N"
            }
        ],
        "subTopics": [
          {
              "topic_id": 103,
              "topic_name": "Laws and Friction",
              "total_videos": 0,
              "total_study_materials": 0,
              "total_exam": 0,
              "total_assignments": 0,
              "total_notes": 0,
              "total_gallery": 0,
              "total_others": 0,
              "parent_topic_id": 0,
              "institute_id": 0,
              "total_audio_notes": 0,
              "total_images": 0,
              "total_previous_year_questions_paper": 0,
              "videosList": [
                  {
                      "file_id": "403",
                      "file_name": null,
                      "size": "0.0",
                      "desc": "url aws",
                      "downloads": 0,
                      "institute_id": 0,
                      "title": "",
                      "category_id": 231,
                      "category_name": "Youtube URL",
                      "subject_id": 0,
                      "topic_id": 0,
                      "uploadedBy": "admin",
                      "course_types": "",
                      "video_url": "100058/https://www.youtube.com/watch?v=MCYyUhjk-Ns",
                      "sub_topic_id": 0,
                      "fileIdArray": null,
                      "activeORInactivArray": null,
                      "is_readonly": "N"
                  }
              ]
          },
          {
              "topic_id": 109,
              "topic_name": "Formulae",
              "total_videos": 0,
              "total_study_materials": 0,
              "total_exam": 0,
              "total_assignments": 0,
              "total_notes": 0,
              "total_gallery": 0,
              "total_others": 0,
              "parent_topic_id": 0,
              "institute_id": 0,
              "total_audio_notes": 0,
              "total_images": 0,
              "total_previous_year_questions_paper": 0,
              "videosList": [
                  {
                      "file_id": "403",
                      "file_name": null,
                      "size": "0.0",
                      "desc": "url aws",
                      "downloads": 0,
                      "institute_id": 0,
                      "title": "",
                      "category_id": 231,
                      "category_name": "Youtube URL",
                      "subject_id": 0,
                      "topic_id": 0,
                      "uploadedBy": "admin",
                      "course_types": "",
                      "video_url": "100058/https://www.youtube.com/watch?v=MCYyUhjk-Ns",
                      "sub_topic_id": 0,
                      "fileIdArray": null,
                      "activeORInactivArray": null,
                      "is_readonly": "N"
                  }
              ],
              "assignmentList": [
                  {
                      "file_id": "387",
                      "file_name": "https://s3-ap-southeast-1.amazonaws.com/testeduimspro/Admissions_Summary_Report.xls",
                      "size": "0.02836",
                      "desc": "upload aws",
                      "downloads": 0,
                      "institute_id": 0,
                      "title": "",
                      "category_id": 63,
                      "category_name": "Assignment",
                      "subject_id": 0,
                      "topic_id": 0,
                      "uploadedBy": "admin",
                      "course_types": "",
                      "video_url": null,
                      "sub_topic_id": 0,
                      "fileIdArray": null,
                      "activeORInactivArray": null,
                      "is_readonly": "N"
                  }
              ],
              "subTopics": [
                {
                    "topic_id": 103,
                    "topic_name": "Laws and Friction",
                    "total_videos": 0,
                    "total_study_materials": 0,
                    "total_exam": 0,
                    "total_assignments": 0,
                    "total_notes": 0,
                    "total_gallery": 0,
                    "total_others": 0,
                    "parent_topic_id": 0,
                    "institute_id": 0,
                    "total_audio_notes": 0,
                    "total_images": 0,
                    "total_previous_year_questions_paper": 0,
                    "videosList": [
                        {
                            "file_id": "403",
                            "file_name": null,
                            "size": "0.0",
                            "desc": "url aws",
                            "downloads": 0,
                            "institute_id": 0,
                            "title": "",
                            "category_id": 231,
                            "category_name": "Youtube URL",
                            "subject_id": 0,
                            "topic_id": 0,
                            "uploadedBy": "admin",
                            "course_types": "",
                            "video_url": "100058/https://www.youtube.com/watch?v=MCYyUhjk-Ns",
                            "sub_topic_id": 0,
                            "fileIdArray": null,
                            "activeORInactivArray": null,
                            "is_readonly": "N"
                        }
                    ]
                },
                {
                    "topic_id": 109,
                    "topic_name": "Formulae",
                    "total_videos": 0,
                    "total_study_materials": 0,
                    "total_exam": 0,
                    "total_assignments": 0,
                    "total_notes": 0,
                    "total_gallery": 0,
                    "total_others": 0,
                    "parent_topic_id": 0,
                    "institute_id": 0,
                    "total_audio_notes": 0,
                    "total_images": 0,
                    "total_previous_year_questions_paper": 0,
                    "videosList": [
                        {
                            "file_id": "403",
                            "file_name": null,
                            "size": "0.0",
                            "desc": "url aws",
                            "downloads": 0,
                            "institute_id": 0,
                            "title": "",
                            "category_id": 231,
                            "category_name": "Youtube URL",
                            "subject_id": 0,
                            "topic_id": 0,
                            "uploadedBy": "admin",
                            "course_types": "",
                            "video_url": "100058/https://www.youtube.com/watch?v=MCYyUhjk-Ns",
                            "sub_topic_id": 0,
                            "fileIdArray": null,
                            "activeORInactivArray": null,
                            "is_readonly": "N"
                        }
                    ],
                    "assignmentList": [
                        {
                            "file_id": "387",
                            "file_name": "https://s3-ap-southeast-1.amazonaws.com/testeduimspro/Admissions_Summary_Report.xls",
                            "size": "0.02836",
                            "desc": "upload aws",
                            "downloads": 0,
                            "institute_id": 0,
                            "title": "",
                            "category_id": 63,
                            "category_name": "Assignment",
                            "subject_id": 0,
                            "topic_id": 0,
                            "uploadedBy": "admin",
                            "course_types": "",
                            "video_url": null,
                            "sub_topic_id": 0,
                            "fileIdArray": null,
                            "activeORInactivArray": null,
                            "is_readonly": "N"
                        }
                    ]
                }
            ]
          }
      ]
    }
];

  constructor() { }

  ngOnInit() {
  }

  toggleRows(event)
  {
    console.log(event);
    let operation = event.target.attributes['data'].value;
    let length = event.target.parentNode.parentNode.parentNode.children.length;
    for (let i = 1; i < length; i++) {
      let child_el = event.target.parentNode.parentNode.parentNode.children[i];
      if(operation == 'hide')
      {
        child_el.classList.remove('fade-in');
        child_el.classList.add('fade-out');

        event.target.classList.remove('btn-close');
        event.target.classList.add('btn-open');
        event.target.attributes['data'].value = 'show';
      }
      else{
        child_el.classList.remove('fade-out');
        child_el.classList.add('fade-in');

        event.target.classList.add('btn-close');
        event.target.classList.remove('btn-open');
        event.target.attributes['data'].value = 'hide';
      }
    }
    
  }

}
