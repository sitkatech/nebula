import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiversionScenarioComponent } from './diversion-scenario.component';

describe('DiversionScenarioComponent', () => {
  let component: DiversionScenarioComponent;
  let fixture: ComponentFixture<DiversionScenarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiversionScenarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiversionScenarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
