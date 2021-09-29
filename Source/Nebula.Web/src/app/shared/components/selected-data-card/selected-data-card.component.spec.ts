import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedDataCardComponent } from './selected-data-card.component';

describe('SelectedDataCardComponent', () => {
  let component: SelectedDataCardComponent;
  let fixture: ComponentFixture<SelectedDataCardComponent>;

  beforeEach(async(() => {
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
