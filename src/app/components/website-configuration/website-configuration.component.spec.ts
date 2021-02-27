import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WebsiteConfigurationComponent } from './website-configuration.component';

describe('WebsiteConfigurationComponent', () => {
  let component: WebsiteConfigurationComponent;
  let fixture: ComponentFixture<WebsiteConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WebsiteConfigurationComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WebsiteConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
