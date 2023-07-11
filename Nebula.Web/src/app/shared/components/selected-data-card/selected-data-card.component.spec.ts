import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SelectedDataCardComponent } from './selected-data-card.component';

describe('SelectedDataCardComponent', () => {
  let component: SelectedDataCardComponent;
  let fixture: ComponentFixture<SelectedDataCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectedDataCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectedDataCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
