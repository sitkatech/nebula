import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiVariableMultiSiteComponent } from './multi-variable-multi-site.component';

describe('MultiVariableMultiSiteComponent', () => {
  let component: MultiVariableMultiSiteComponent;
  let fixture: ComponentFixture<MultiVariableMultiSiteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiVariableMultiSiteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiVariableMultiSiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
