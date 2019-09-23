import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoLectureComponent } from './video-lecture.component';

describe('VideoLectureComponent', () => {
  let component: VideoLectureComponent;
  let fixture: ComponentFixture<VideoLectureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoLectureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoLectureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
