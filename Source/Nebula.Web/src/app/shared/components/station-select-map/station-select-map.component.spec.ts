import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StationSelectMapComponent } from './station-select-map.component';

describe('StationSelectMapComponent', () => {
  let component: StationSelectMapComponent;
  let fixture: ComponentFixture<StationSelectMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StationSelectMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StationSelectMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
