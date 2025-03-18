// import { Component, OnInit } from '@angular/core';
// import {
//   FormBuilder,
//   FormGroup,
//   ReactiveFormsModule,
//   Validators,
// } from '@angular/forms';
// import { HttpClient } from '@angular/common/http';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-cast-vote',
//   standalone: true,
//   templateUrl: './cast-vote.component.html',
//   styleUrls: ['./cast-vote.component.css'],
//   imports: [CommonModule, ReactiveFormsModule],
// })
// export class CastVoteComponent implements OnInit {
//   voteForm!: FormGroup;
//   voterId!: number;
//   candidates: any;

//   constructor(private fb: FormBuilder, private http: HttpClient) {}

//   ngOnInit(): void {
//     this.voterId = Number(localStorage.getItem('voterId')); // Assume voterId is stored after login
//     this.initializeForm();
//     this.fetchCandidates();
//   }

//   initializeForm(): void {
//     this.voteForm = this.fb.group({
//       candidateId: ['', Validators.required],
//     });
//   }

//   fetchCandidates(): void {
//     this.http.get(`http://localhost:44354/api/candidates`).subscribe({
//       next: (res) => {
//         this.candidates = res;
//       },
//       error: (err) => {
//         console.error('Error fetching candidates:', err);
//       },
//     });
//   }

//   castVote(): void {
//     if (this.voteForm.invalid) return;

//     const voteData = {
//       userId: this.voterId,
//       candidateId: this.voteForm.value.candidateId,
//     };

//     this.http.post('http://localhost:44354/api/Vote', voteData).subscribe({
//       next: (res) => {
//         alert('Vote cast successfully!');
//       },
//       error: (err) => {
//         alert(err.error.message || 'Failed to cast vote.');
//       },
//     });
//   }
// }

import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserService } from '../../../../services/user.service';

interface Election {
  electionId: number;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
}

@Component({
  selector: 'app-vote',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './cast-vote.component.html',
  styleUrls: ['./cast-vote.component.css'],
})
export class VoteComponent implements OnInit {
  userid: number = 0;
  voteForm: FormGroup;
  elections: Election[] = [];
  candidates: any[] = [];
  selectedElectionId: number = 0;
  selectedCandidateId: number = 0;
  userConstituency: string = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private userservice: UserService
  ) {
    this.voteForm = this.fb.group({
      electionId: ['', Validators.required],
      candidateId: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.userid = this.userservice.getUser().userid;
    this.userConstituency = this.userservice.getUser().Constituency;
    this.fetchElections();
  }

  fetchElections(): void {
    this.http
      .get<Election[]>('https://localhost:44354/api/Voter/view-elections')
      .subscribe(
        (data: Election[]) => {
          this.elections = data;
        },
        (error) => {
          console.error('Error fetching elections:', error);
        }
      );
  }

  // fetchCandidates() {
  //   this.http.get<any[]>('https://localhost:44354/api/Candidate').subscribe(
  //     (res: any[]) => {
  //       this.candidates = res;
  //       console.log('All candidates:', this.candidates);
  //       this.candidates = res.filter(
  //         (candidate) =>
  //           candidate.constituency === this.userConstituency &&
  //           candidate.electionId === this.voteForm.value.electionId
  //       );
  //       console.log('Filtered candidates:', this.candidates);
  //     },
  //     (error) => {
  //       console.error('Error fetching candidates', error);
  //     }
  //   );
  // }
  fetchCandidates() {
    this.selectedElectionId = this.voteForm.value.electionId;
    this.http
      .get<any[]>(
        `https://localhost:44354/api/Candidate/ByElection/${this.selectedElectionId}`
      )
      .subscribe(
        (res: any[]) => {
          this.candidates = res.filter(
            (candidate) => candidate.constituency === this.userConstituency
          );
          console.log('Filtered candidates:', this.candidates);
        },
        (error) => {
          console.error('Error fetching candidates', error);
        }
      );
  }

  castVote() {
    if (this.voteForm.valid) {
      // const voteData = this.voteForm.value;
      // console.log('Vote cast:', voteData);
      // Submit the vote using your service or API
      this.selectedCandidateId = this.voteForm.value.candidateId;
      this.http
        .post('https://localhost:44354/api/Vote', {
          userId: this.userid,
          candidateId: this.selectedCandidateId,
        })
        .subscribe(
          (response: any) => {
            console.log('Vote cast response ', response);
            alert('Vote cast successfully!');
          },
          (error) => {
            console.error('Failed to cast vote:', error);
            alert('You have already voted in this election');
          }
        );
    }
  }
}
