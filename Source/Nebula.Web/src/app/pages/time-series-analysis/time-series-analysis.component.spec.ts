import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TimeSeriesAnalysisComponent } from './time-series-analysis.component';

describe('TimeSeriesAnalysisComponent', () => {
  let component: TimeSeriesAnalysisComponent;
  let fixture: ComponentFixture<TimeSeriesAnalysisComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TimeSeriesAnalysisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeSeriesAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
