import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceInnerPage } from './service-inner.page';

describe('ServiceInnerPage', () => {
  let component: ServiceInnerPage;
  let fixture: ComponentFixture<ServiceInnerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceInnerPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceInnerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
