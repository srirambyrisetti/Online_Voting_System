import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-voter',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './voters.component.html',
  styleUrls: ['./voters.component.css'],
})
export class VoterComponent implements OnInit {
  voters: any[] = [];
  editForm: FormGroup;
  selectedVoter: any = null;
  selectedVoterID: number = 0;
  apiUrl = 'https://localhost:44354/api/Voter/AllVoters'; // Backend API URL

  constructor(private http: HttpClient, private fb: FormBuilder) {
    this.editForm = this.fb.group({
      username: [''],
      email: [''],
      age: [''],
      constituency: [''],
      address: [''],
      gender: [''],
      voterId: [''],
    });
  }

  ngOnInit() {
    this.fetchVoters();
  }

  fetchVoters() {
    this.http.get<any[]>(this.apiUrl).subscribe(
      (data) => {
        this.voters = data;
      },
      (error) => {
        console.error('Error fetching voters:', error);
      }
    );
  }

  saveVoter() {
    if (this.selectedVoter) {
      const updatedVoter = this.editForm.value;
      this.http
        .put(
          `https://localhost:44354/api/voters/${this.selectedVoterID}`,
          updatedVoter
        )
        .subscribe(
          () => {
            this.fetchVoters();
            this.selectedVoter = null;
          },
          (error) => console.error('Error updating voter:', error)
        );
    }
  }

  // deleteVoter(voterId: number) {
  //   this.http.delete(`https://localhost:44354/api/voters/${voterId}`).subscribe(
  //     () => {
  //       this.voters = this.voters.filter((v) => v.voterId !== voterId);
  //       this.fetchVoters();
  //     },
  //     (error) => {
  //       console.error('Error deleting voter:', error);
  //     }
  //   );
  // }
}
