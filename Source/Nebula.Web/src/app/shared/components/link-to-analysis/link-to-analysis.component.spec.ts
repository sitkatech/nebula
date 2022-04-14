import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LinkToAnalysisComponent } from './link-to-analysis.component';

describe('LinkToAnalysisComponent', () => {
  let component: LinkToAnalysisComponent;
  let fixture: ComponentFixture<LinkToAnalysisComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkToAnalysisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkToAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
