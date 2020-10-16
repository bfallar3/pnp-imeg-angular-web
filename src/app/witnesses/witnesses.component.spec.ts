import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WitnessesComponent } from './witnesses.component';

describe('WitnessesComponent', () => {
  let component: WitnessesComponent;
  let fixture: ComponentFixture<WitnessesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WitnessesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WitnessesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
