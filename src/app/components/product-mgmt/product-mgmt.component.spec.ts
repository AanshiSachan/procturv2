import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductMgmtComponent } from './product-mgmt.component';

describe('ProductMgmtComponent', () => {
  let component: ProductMgmtComponent;
  let fixture: ComponentFixture<ProductMgmtComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductMgmtComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductMgmtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
