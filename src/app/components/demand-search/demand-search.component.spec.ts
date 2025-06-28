import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandSearchComponent } from './demand-search.component';

describe('DemandSearchComponent', () => {
  let component: DemandSearchComponent;
  let fixture: ComponentFixture<DemandSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemandSearchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DemandSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
