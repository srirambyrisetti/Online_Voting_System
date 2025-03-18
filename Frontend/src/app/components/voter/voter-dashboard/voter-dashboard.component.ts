import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-voter-dashboard',
  imports: [RouterModule],
  templateUrl: './voter-dashboard.component.html',
  styleUrls: ['./voter-dashboard.component.css'],
})
export class VoterDashboardComponent {
  logout() {
    alert('Logging out...');
    // Redirect to home page
    window.location.href = '/';
  }
  constructor(private router: Router) {}
  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}
