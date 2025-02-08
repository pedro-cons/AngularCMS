import { DocumentRequest } from './../models/document.request.model';
import { AuthRequest } from './../models/auth.request.model';
import { CmsService } from './../services/cms.service';
import { DocumentNoContentResponse } from './../models/documentNoContent.response.model';
import { Component, OnInit } from '@angular/core';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'Web';
  documents: DocumentNoContentResponse[] = [];
  selectedDocument: DocumentRequest | null = null;

  credentials: AuthRequest = {
    tenantid: environment.id,
    password: environment.password,
    username: environment.username,
  };

  constructor(private cmsService: CmsService) {}

  ngOnInit(): void {
    this.cmsService.authorize(this.credentials).subscribe({
      next: (authResponse) => {
        this.cmsService.storeToken(authResponse);
        this.getAllNoContent();
      },
      error: (err) => console.error('Authentication failed:', err),
    });
  }

  getAllNoContent(): void {
    this.cmsService.getAllNoContentDocument().subscribe({
      next: (docs) => (this.documents = docs),
      error: (err) => console.error('Failed to load documents:', err),
    });
  }

  insertOrUpdateDocument(document: DocumentRequest) {
    this.cmsService.insertOrUpdateDocument(document).subscribe({
      next: (response) => {
        console.log(response);
        if (response.status === 200 || response.status === 204) {
          console.log('Document added/updated successfully');
          this.getAllNoContent();
        } else {
          console.error('Failed to add or update the document');
          alert(
            'Failed to add or update the document. Please try again later.'
          );
        }
      },
      error: (err) => {
        console.error('Error during the document request:', err);
        alert(
          'An error occurred while processing your request. Please try again.'
        );
      },
    });
  }

  addDocument(): void {
    const modal = document.getElementById('addDocumentModal');
    if (modal) {
      modal.style.display = 'block';
    }
  }

  onDocumentAdded(newDocument: DocumentRequest): void {
    this.insertOrUpdateDocument(newDocument);
  }

  editDocument(documentId: string): void {
    this.cmsService.getDocumentById(documentId).subscribe({
      next: (document) => {
        this.selectedDocument = document;
        this.openUpdateModal();
      },
      error: (err) => {
        console.error('An error occurred while processing your request:', err);
      },
    });
  }

  openUpdateModal(): void {
    const modal = document.getElementById('updateDocumentModal');
    if (modal) {
      modal.style.display = 'block';
    }
  }

  onDocumentUpdated(updatedDocument: DocumentRequest): void {
    this.insertOrUpdateDocument(updatedDocument);
  }

  openUpdateDocumentModal(document: DocumentRequest): void {
    this.selectedDocument = { ...document };
  }

  deleteDocument(documentId: string): void {
    this.cmsService.deleteDocument(documentId).subscribe({
      next: (docs) => {
        this.getAllNoContent();
      },
      error: (err) => console.error('Failed to delete the document:', err),
    });
  }
}
