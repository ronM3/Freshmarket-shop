import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent {
  faEdit = faEdit;
  fileName = '';
  imagePath = '';
  @Output() childEvent = new EventEmitter<string>();
  constructor(private http: HttpClient) { }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.fileName = file.name;
      this.imagePath = `http://127.0.0.1:3001/${this.fileName}`
      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileName", this.fileName);
      const upload$ = this.http.post("http://localhost:3001/files/upload", formData);
      this.childEvent.emit(this.imagePath);
      upload$.subscribe();
    }
  }
}
