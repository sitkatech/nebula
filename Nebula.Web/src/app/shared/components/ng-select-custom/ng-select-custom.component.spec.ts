import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NgSelectCustomComponent } from './ng-select-custom.component';

describe('NgSelectCustomComponent', () => {
  let component: NgSelectCustomComponent;
  let fixture: ComponentFixture<NgSelectCustomComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NgSelectCustomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgSelectCustomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
