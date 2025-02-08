import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateDocumentModalComponent } from './update-document-modal.component';

describe('AddDocumentModalComponent', () => {
  let component: UpdateDocumentModalComponent;
  let fixture: ComponentFixture<UpdateDocumentModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpdateDocumentModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateDocumentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
