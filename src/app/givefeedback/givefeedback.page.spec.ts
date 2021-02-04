import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GivefeedbackPage } from './givefeedback.page';

describe('GivefeedbackPage', () => {
  let component: GivefeedbackPage;
  let fixture: ComponentFixture<GivefeedbackPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GivefeedbackPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GivefeedbackPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
