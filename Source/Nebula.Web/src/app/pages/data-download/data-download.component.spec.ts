import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataDownloadComponent } from './data-download.component';

describe('DataDownloadComponent', () => {
  let component: DataDownloadComponent;
  let fixture: ComponentFixture<DataDownloadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataDownloadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
