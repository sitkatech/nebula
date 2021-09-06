import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PairedRegressionAnalysisComponent } from './paired-regression-analysis.component';

describe('PairedRegressionAnalysisComponent', () => {
  let component: PairedRegressionAnalysisComponent;
  let fixture: ComponentFixture<PairedRegressionAnalysisComponent>;

  beforeEach(async(() => {
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
