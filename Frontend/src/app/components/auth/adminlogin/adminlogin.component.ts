import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-adminlogin',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './adminlogin.component.html',
  styleUrl: './adminlogin.component.css',
})
export class AdminloginComponent {
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
        .post('https://localhost:44354/api/Admin/login', loginDetails)
        .subscribe(
          (response: any) => {
            console.log('Login response:', response);
            this.userservice.setAdmin(
              response.userid,
              response.role,
              response.username,
              response.email
            );
            alert('Login successful!');
            this.router.navigate(['/admin-dashboard']);
          },
          (error) => {
            alert('Invalid login credentials. Please try again.');
          }
        );
    }
  }
}
