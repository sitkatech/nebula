import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PairedRegressionAnalysisComponent } from './paired-regression-analysis.component';

describe('PairedRegressionAnalysisComponent', () => {
  let component: PairedRegressionAnalysisComponent;
  let fixture: ComponentFixture<PairedRegressionAnalysisComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PairedRegressionAnalysisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PairedRegressionAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
