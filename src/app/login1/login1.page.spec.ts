import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Login1Page } from './login1.page';

describe('Login1Page', () => {
  let component: Login1Page;
  let fixture: ComponentFixture<Login1Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Login1Page ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Login1Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
