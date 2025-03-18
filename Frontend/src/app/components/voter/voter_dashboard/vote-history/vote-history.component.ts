import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../../services/user.service';
interface Votehistory {
  voteId: number;
  candidateName: string;
  electionTitle: string;
  voteDate: Date;
}
@Component({
  selector: 'app-vote-history',
  imports: [CommonModule],
  templateUrl: './vote-history.component.html',
  styleUrl: './vote-history.component.css',
})
export class VoteHistoryComponent implements OnInit {
  userId: number = 0; // Replace with dynamic User ID from authentication
  voteHistory: Votehistory[] = [];
  errorMessage: string = '';

  constructor(private http: HttpClient, private userservice: UserService) {}

  ngOnInit(): void {
    this.userId = this.userservice.getUser().userid;
    this.fetchVoteHistory();
  }

  fetchVoteHistory() {
    this.http
      .get<Votehistory[]>(
        `https://localhost:44354/api/Vote/history/${this.userId}`
      )
      .subscribe(
        (data: Votehistory[]) => {
          if (data.length > 0) {
            this.voteHistory = data;
          } else {
            this.errorMessage = 'No voting history found.';
          }
        },
        (error) => {
          console.error('Error fetching voting history:', error);
          this.errorMessage =
            'Failed to load voting history. Please try again later.';
        }
      );
  }
}
