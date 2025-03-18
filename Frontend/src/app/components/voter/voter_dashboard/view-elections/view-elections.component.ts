import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

interface Election {
  electionId: number;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
}
@Component({
  selector: 'app-view-elections',
  imports: [CommonModule],
  templateUrl: './view-elections.component.html',
  styleUrl: './view-elections.component.css',
})
export class ViewElectionsComponent implements OnInit {
  elections: Election[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
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
}
