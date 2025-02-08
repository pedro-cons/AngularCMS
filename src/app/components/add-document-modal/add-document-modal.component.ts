import { Component, EventEmitter, Output } from '@angular/core';
import { DocumentRequest } from '../../../models/document.request.model';
@Component({
  selector: 'app-add-document-modal',
  templateUrl: './add-document-modal.component.html',
  styleUrls: ['./add-document-modal.component.css'],
})
export class AddDocumentModalComponent {
  @Output() documentAdded = new EventEmitter<DocumentRequest>();

  newDocument: DocumentRequest = {
    id: '',
    title: '',
    publishDate: Date.now(),
    expiryDate: Date.now(),
    content: '',
  };

  constructor() {}

  closeModal(): void {
    const modal = document.getElementById('addDocumentModal');
    if (modal) {
      modal.style.display = 'none';
    }
  }

  formatDateForInput(date: number): string {
    if (date) {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = (d.getMonth() + 1).toString().padStart(2, '0');
      const day = d.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    return '';
  }

  get formattedPublishDate(): string {
    return this.formatDateForInput(this.newDocument.publishDate);
  }

  get formattedExpiryDate(): string {
    return this.formatDateForInput(this.newDocument.expiryDate);
  }

  set formattedPublishDate(date: string) {
    const localDate = new Date(date + 'T00:00:00');
    this.newDocument.publishDate = localDate.getTime();
  }

  set formattedExpiryDate(date: string) {
    const localDate = new Date(date + 'T00:00:00');
    this.newDocument.expiryDate = localDate.getTime();
  }

  addDocument(): void {
    this.documentAdded.emit(this.newDocument);
    this.closeModal();
  }
}
