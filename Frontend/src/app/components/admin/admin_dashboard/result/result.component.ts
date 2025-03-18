import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-result',
  imports: [CommonModule, FormsModule],
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css'],
})
export class ResultComponent implements OnInit {
  electionResults: any = [];
  winnerMessage: string = '';
  selectedElection: number = 0;
  elections: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchElections();
    // this.selectedElection = this.elections[0].electionId;
    // this.fetchResults();
  }

  fetchResults() {
    this.fetchElectionResults();
    this.fetchElectionWinner();
  }

  fetchElections() {
    console.log('Fetching Elections for user');
    this.http.get<any[]>(`https://localhost:44354/api/Election`).subscribe(
      (res: any[]) => {
        console.log('Fetched elections', res);
        this.elections = res;
      },
      (error) => {
        console.error('Error fetching elections', error);
      }
    );
  }

  fetchElectionResults() {
    this.http
      .get(
        `https://localhost:44354/api/Election/results/${this.selectedElection}`
      )
      .subscribe(
        (response: any) => {
          this.electionResults = Object.entries(response).map(
            ([constituency, candidates]: any) => ({
              constituency,
              candidates,
            })
          );
        },
        (error) => {
          console.error('Error fetching election results:', error);
        }
      );
  }

  fetchElectionWinner() {
    this.http
      .get(
        `https://localhost:44354/api/Election/winner/${this.selectedElection}`
      )
      .subscribe(
        (response: any) => {
          if (response.message) {
            this.winnerMessage = response.message;
          }
        },
        (error) => {
          console.error('Error fetching election winner:', error);
        }
      );
  }
}
