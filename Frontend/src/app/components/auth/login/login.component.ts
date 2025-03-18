import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [ReactiveFormsModule, CommonModule],
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private userservice: UserService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['voter', Validators.required], // Default role selection
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      const loginDetails = this.loginForm.value;

      this.http
        .post('https://localhost:44354/api/Voter/login', loginDetails)
        .subscribe(
          (response: any) => {
            console.log('Login response:', response);
            if (response.role === 'Voter') {
              //sessionStorage.setItem('userRole', 'admin'); // Store role in session
              this.userservice.setUser(
                response.userid,
                response.role,
                response.username,
                response.email,
                response.constituency
              );
              this.router.navigate(['/voter-dashboard']);
            } else if (response.role === 'Admin') {
              // sessionStorage.setItem('userRole', 'voter'); // Store role in session
              this.router.navigate(['/admin-dashboard']);
            }
          },
          (error) => {
            alert('Invalid login credentials. Please try again.');
          }
        );
    }
  }
}
