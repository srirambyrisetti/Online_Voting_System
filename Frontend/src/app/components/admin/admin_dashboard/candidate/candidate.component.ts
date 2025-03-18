import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-candidate',
  standalone: true,
  templateUrl: './candidate.component.html',
  styleUrl: './candidate.component.css',
  imports: [ReactiveFormsModule, CommonModule, FormsModule], // Ensure CommonModule is imported
})
export class CandidateComponent {
  candidateForm: FormGroup;
  candidates: any[] = [];
  editIndex: number | null = null;
  elections: any[] = [];
  selectedElection: number = 0;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.fetchElections();
    this.fetchCandidates();
    this.candidateForm = this.fb.group({
      electionId: ['', Validators.required],
      name: ['', Validators.required],
      partyName: ['', Validators.required],
      constituency: ['', Validators.required],
    });
  }

  fetchElections() {
    this.http.get<any[]>('https://localhost:44354/api/Election').subscribe(
      (res: any[]) => {
        console.log('Fetched Candidates', res);
        this.elections = res;
      },
      (error) => {
        console.error('Error fetching Candidates', error);
      }
    );
  }

  fetchCandidates() {
    this.http.get<any[]>('https://localhost:44354/api/Candidate').subscribe(
      (res: any[]) => {
        console.log('Fetched elections', res);
        this.candidates = res;
      },
      (error) => {
        console.error('Error fetching candidates', error);
      }
    );
  }

  // onSubmit() {
  //   if (this.candidateForm.valid) {
  //     if (this.editIndex === null) {
  //       const exists = this.candidates.some(
  //         (c) =>
  //           c.constituency === this.candidateForm.value.constituency &&
  //           c.partyName === this.candidateForm.value.partyName
  //       );
  //       if (exists) {
  //         alert(
  //           'A candidate from this party already exists in this constituency.'
  //         );
  //         return;
  //       }
  //       this.candidates.push(this.candidateForm.value);
  //     } else {
  //       this.candidates[this.editIndex] = this.candidateForm.value;
  //       this.editIndex = null;
  //     }
  //     this.candidateForm.reset();
  //   }
  // }

  onSubmit() {
    const candidateDetails = {
      candidateId: this.candidateForm.value.candidateId,
      electionId: this.candidateForm.value.electionId,
      name: this.candidateForm.value.name,
      party: this.candidateForm.value.partyName,
      constituency: this.candidateForm.value.constituency,
    };
    //console.log('Form data:', formData);
    this.http
      .post('https://localhost:44354/api/Candidate', candidateDetails)
      .subscribe(
        (response) => {
          console.log('Form submitted successfully', response);
          this.fetchCandidates();
        },
        (error) => {
          console.error('Error submitting form', error);
        }
      );
  }

  deleteCandidate(candidateId: number) {
    this.http
      .delete(`https://localhost:44354/api/Candidate/${candidateId}`)
      .subscribe(
        () => {
          console.log(`Candidate with id ${candidateId} deleted successfully`);
          this.fetchCandidates();
        },
        (error) => {
          console.error('Error deleting candidate', error);
        }
      );
  }
}
