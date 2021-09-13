import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StationSelectCardComponent } from './station-select-card.component';

describe('StationSelectCardComponent', () => {
  let component: StationSelectCardComponent;
  let fixture: ComponentFixture<StationSelectCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StationSelectCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StationSelectCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
