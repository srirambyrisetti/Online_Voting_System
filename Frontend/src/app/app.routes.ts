// import { Routes } from '@angular/router';

// export const routes: Routes = [];

// import { Routes } from '@angular/router';
// import { HomeComponent } from './components/home/home.component';
// import { RegisterComponent } from './components/auth/register/register.component';
// import { LoginComponent } from './components/auth/login/login.component';

// export const routes: Routes = [
//   { path: '', component: HomeComponent },
//   { path: 'register', component: RegisterComponent },
//   // Redirect unknown routes to home
//   { path: 'login', component: LoginComponent },
// ];

// import { Routes } from '@angular/router';
// import { HomeComponent } from './components/home/home.component';
// import { RegistrationComponent } from './components/auth/register/register.component';

// export const routes: Routes = [
//   { path: '', component: HomeComponent },
//   { path: 'register', component: RegistrationComponent },
// ];

import { Routes } from '@angular/router';
import { HomeComponent } from '../app/components/home/home.component';
import { RegisterComponent } from '../app/components/auth/register/register.component';
import { LoginComponent } from '../app/components/auth/login/login.component';
import { AdminDashboardComponent } from '../app/components/admin/admin-dashboard/admin-dashboard.component';
import { VoterDashboardComponent } from '../app/components/voter/voter-dashboard/voter-dashboard.component';
import { ElectionComponent } from '../app/components/admin/admin_dashboard/elections/elections.component';
import { CandidateComponent } from '../app/components/admin/admin_dashboard/candidate/candidate.component';
import { VoterComponent } from '../app/components/admin/admin_dashboard/voters/voters.component';
import { ResultComponent } from './components/admin/admin_dashboard/result/result.component';
import { VoteComponent } from './components/voter/voter_dashboard/cast-vote/cast-vote.component';
import { ViewElectionsComponent } from './components/voter/voter_dashboard/view-elections/view-elections.component';
import { VoteHistoryComponent } from './components/voter/voter_dashboard/vote-history/vote-history.component';
import { AdminloginComponent } from './components/auth/adminlogin/adminlogin.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'adminlogin', component: AdminloginComponent },
  { path: 'admin-dashboard', component: AdminDashboardComponent },
  { path: 'voter-dashboard', component: VoterDashboardComponent },
  { path: 'admin-election', component: ElectionComponent },
  { path: 'admin-candidates', component: CandidateComponent },
  { path: 'admin-voters', component: VoterComponent },
  { path: 'admin-result', component: ResultComponent },
  { path: 'cast-vote', component: VoteComponent },
  { path: 'view-election', component: ViewElectionsComponent },
  { path: 'vote-history', component: VoteHistoryComponent },

  { path: '**', redirectTo: '' },
];
