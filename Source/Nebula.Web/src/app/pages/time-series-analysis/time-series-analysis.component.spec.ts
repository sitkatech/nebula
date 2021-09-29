import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeSeriesAnalysisComponent } from './time-series-analysis.component';

describe('TimeSeriesAnalysisComponent', () => {
  let component: TimeSeriesAnalysisComponent;
  let fixture: ComponentFixture<TimeSeriesAnalysisComponent>;

  beforeEach(async(() => {
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
