import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DocumentRequest } from '../../../models/document.request.model';
@Component({
  selector: 'app-update-document-modal',
  templateUrl: './update-document-modal.component.html',
  styleUrls: ['./update-document-modal.component.css'],
})
export class UpdateDocumentModalComponent {
  @Input() documentToUpdate: DocumentRequest = {
    id: '',
    title: '',
    content: '',
    publishDate: Date.now(),
    expiryDate: Date.now(),
  };

  @Output() updatedDocumentRequest = new EventEmitter<DocumentRequest>();

  closeModal(): void {
    const modal = document.getElementById('updateDocumentModal');
    if (modal) {
      modal.style.display = 'none';
    }

    this.documentToUpdate = {
      id: '',
      title: '',
      content: '',
      publishDate: Date.now(),
      expiryDate: Date.now(),
    };
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
    return this.documentToUpdate
      ? this.formatDateForInput(this.documentToUpdate.publishDate)
      : '';
  }

  get formattedExpiryDate(): string {
    return this.documentToUpdate
      ? this.formatDateForInput(this.documentToUpdate.expiryDate)
      : '';
  }

  set formattedPublishDate(date: string) {
    if (this.documentToUpdate) {
      const localDate = new Date(date + 'T00:00:00');
      this.documentToUpdate.publishDate = localDate.getTime();
    }
  }

  set formattedExpiryDate(date: string) {
    if (this.documentToUpdate) {
      const localDate = new Date(date + 'T00:00:00');
      this.documentToUpdate.expiryDate = localDate.getTime();
    }
  }

  updateDocument(): void {
    if (this.documentToUpdate) {
      this.updatedDocumentRequest.emit(this.documentToUpdate);
    }
    this.closeModal();
  }
}
