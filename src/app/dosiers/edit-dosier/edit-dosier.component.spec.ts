import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDosierComponent } from './edit-dosier.component';

describe('EditDosierComponent', () => {
  let component: EditDosierComponent;
  let fixture: ComponentFixture<EditDosierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditDosierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDosierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
