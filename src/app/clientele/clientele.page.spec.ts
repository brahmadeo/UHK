import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientelePage } from './clientele.page';

describe('ClientelePage', () => {
  let component: ClientelePage;
  let fixture: ComponentFixture<ClientelePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientelePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientelePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
