// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import {
//   FormGroup,
//   FormControl,
//   Validators,
//   ReactiveFormsModule,
// } from '@angular/forms';
// import { HttpClient } from '@angular/common/http';

// @Component({
//   selector: 'app-election',
//   imports: [CommonModule, ReactiveFormsModule],
//   templateUrl: './elections.component.html',
//   styleUrls: ['./elections.component.css'],
// })
// export class ElectionComponent implements OnInit {
//   electionForm: FormGroup;
//   elections: any[] = [];
//   editingElectionId: number | null = null;
//   readonly apiUrl = 'http://localhost:44354/api/Election';

//   constructor(private http: HttpClient) {
//     this.electionForm = new FormGroup({
//       title: new FormControl('', [Validators.required]),
//       startDate: new FormControl('', [Validators.required]),
//       endDate: new FormControl('', [Validators.required]),
//     });
//   }

//   ngOnInit() {
//     this.loadElections();
//   }

//   // Load Elections
//   loadElections() {
//     this.http.get<any[]>('https://localhost:44354/api/Election').subscribe(
//       (data: any[]) => {
//         console.log(data);
//         this.elections = data;
//       },
//       (error) => {
//         console.error('Error loading elections:', error);
//       }
//     );
//   }

//   // Add or Update Election
//   onSubmit() {
//     if (this.electionForm.valid) {
//       const electionData = this.electionForm.value;

//       if (this.editingElectionId !== null) {
//         // Update election
//         this.http
//           .put(`${this.apiUrl}/${this.editingElectionId}`, electionData)
//           .subscribe(
//             () => {
//               this.loadElections(); // Reload elections after update
//               this.resetForm();
//             },
//             (error) => console.error('Error updating election:', error)
//           );
//       } else {
//         // Add new election
//         this.http.post(this.apiUrl, electionData).subscribe(
//           (response) => {
//             console.log('Election added:', response);
//             this.loadElections(); // Reload elections after adding
//             this.resetForm();
//           },
//           (error) => console.error('Error adding election:', error)
//         );
//       }
//     }
//   }

//   // Edit Election
//   editElection(election: any) {
//     this.electionForm.setValue({
//       title: election.title,
//       startDate: election.startDate,
//       endDate: election.endDate,
//     });
//     this.editingElectionId = election.electionId;
//   }

//   // Delete Election
//   deleteElection(id: number) {
//     this.http.delete(`${this.apiUrl}/${id}`).subscribe(
//       () => {
//         this.loadElections();
//       },
//       (error) => console.error('Error deleting election:', error)
//     );
//   }

//   // Reset Form
//   resetForm() {
//     this.electionForm.reset();
//     this.editingElectionId = null;
//   }
// }

import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-election',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], // Ensure Angular built-in modules are included
  templateUrl: './elections.component.html',
  styleUrls: ['./elections.component.css'],
})
export class ElectionComponent implements OnInit {
  electionForm: FormGroup;
  elections: any[] = [];
  editingElectionId: number | null = null;
  private apiUrl = 'https://localhost:44354/api/Election';

  constructor(private http: HttpClient) {
    this.electionForm = new FormGroup({
      title: new FormControl('', Validators.required),
      startDate: new FormControl('', Validators.required),
      endDate: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    this.loadElections();
  }

  loadElections() {
    this.http.get<any[]>(`https://localhost:44354/api/Election`).subscribe(
      (res) => {
        this.elections = res;
      },
      (error) => {
        console.error('Error loading elections:', error.message);
      }
    );
  }

  submitElection() {
    if (this.electionForm.valid) {
      const electionData = this.electionForm.value;

      const request = this.editingElectionId
        ? this.http.put(
            `${this.apiUrl}/${this.editingElectionId}`,
            electionData
          )
        : this.http.post(`https://localhost:44354/api/Election`, electionData);

      request.subscribe({
        next: () => {
          this.loadElections();
          this.resetForm();
        },
        error: (error) =>
          console.error('Error adding/updating election:', error.message),
      });
    }
  }

  editElection(election: any) {
    this.electionForm.setValue({
      title: election.title,
      startDate: election.startDate,
      endDate: election.endDate,
    });
    this.editingElectionId = election.electionId;
  }

  deleteElection(id: number) {
    this.http.delete(`https://localhost:44354/api/Election/${id}`).subscribe(
      () => this.loadElections(),
      (error) => console.error('Error deleting election:', error)
    );
  }

  resetForm() {
    this.electionForm.reset();
    this.editingElectionId = null;
  }
}
