import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, HttpClientModule], // ✅ Ensure ReactiveFormsModule is imported
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registerForm: FormGroup;
  apiUrl = 'https://localhost:44354/api'; // Replace with your backend URL
  userType: string = '';
  age: number = 0;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.registerForm = this.fb.group({
      userType: ['', Validators.required], // Admin or Voter
      username: [''], // Admin only
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],

      // Voter-specific fields
      name: [''],
      dob: [''],
      age: [{ value: '', disabled: true }], // Auto-calculated
      address: [''],
      phone: ['', [Validators.pattern('[0-9]{10}')]],
      gender: [''],
      constituency: [''],
    });
  }

  // ✅ **Fix: Add onUserTypeChange method**
  // onUserTypeChange() {
  //   const userType = this.registerForm.value.userType;

  //   if (userType === 'Admin') {
  //     this.registerForm.controls['username'].setValidators([
  //       Validators.required,
  //     ]);
  //     this.registerForm.controls['name'].clearValidators();
  //     this.registerForm.controls['dob'].clearValidators();
  //     this.registerForm.controls['address'].clearValidators();
  //     this.registerForm.controls['phone'].clearValidators();
  //     this.registerForm.controls['gender'].clearValidators();
  //     this.registerForm.controls['constituency'].clearValidators();
  //   } else if (userType === 'Voter') {
  //     this.registerForm.controls['username'].clearValidators();
  //     this.registerForm.controls['name'].setValidators([Validators.required]);
  //     this.registerForm.controls['dob'].setValidators([Validators.required]);
  //     this.registerForm.controls['address'].setValidators([
  //       Validators.required,
  //     ]);
  //     this.registerForm.controls['phone'].setValidators([
  //       Validators.required,
  //       Validators.pattern('[0-9]{10}'),
  //     ]);
  //     this.registerForm.controls['gender'].setValidators([Validators.required]);
  //     this.registerForm.controls['constituency'].setValidators([
  //       Validators.required,
  //     ]);
  //   }

  //   this.registerForm.updateValueAndValidity();
  // }
  onUserTypeChange() {
    setTimeout(() => {
      // 👈 Add this to delay detection
      if (this.registerForm.value.userType === 'Admin') {
        this.registerForm.controls['username'].setValidators([
          Validators.required,
        ]);
        this.registerForm.controls['name'].clearValidators();
        this.registerForm.controls['dob'].clearValidators();
        this.registerForm.controls['address'].clearValidators();
        this.registerForm.controls['phone'].clearValidators();
        this.registerForm.controls['gender'].clearValidators();
        this.registerForm.controls['constituency'].clearValidators();
      } else {
        this.registerForm.controls['username'].clearValidators();
        this.registerForm.controls['name'].setValidators([Validators.required]);
        this.registerForm.controls['dob'].setValidators([Validators.required]);
        this.registerForm.controls['address'].setValidators([
          Validators.required,
        ]);
        this.registerForm.controls['phone'].setValidators([
          Validators.required,
          Validators.pattern('[0-9]{10}'),
        ]);
        this.registerForm.controls['gender'].setValidators([
          Validators.required,
        ]);
        this.registerForm.controls['constituency'].setValidators([
          Validators.required,
        ]);
      }
      this.registerForm.updateValueAndValidity();
    });
  }
  // ✅ **Fix: Add calculateAge() method**
  calculateAge() {
    const dob = this.registerForm.value.dob;
    if (dob) {
      const birthDate = new Date(dob);
      const today = new Date();
      this.age = today.getFullYear() - birthDate.getFullYear();
      this.registerForm.controls['age'].setValue(this.age);
    }
  }

  // ✅ **Fix: Add onSubmit() method**
  onSubmit() {
    if (this.registerForm.valid) {
      const formData = this.registerForm.value;

      if (formData.userType === 'Admin') {
        this.http
          .post(`${this.apiUrl}/Admin/register`, {
            username: formData.username,
            email: formData.email,
            password: formData.password,
            role: 'Admin',
          })
          .subscribe(
            (response) =>
              console.log('Admin registered successfully', response),
            (error) => console.error('Error registering admin:', error)
          );
      } else {
        this.http
          .post(`${this.apiUrl}/Voter/register`, {
            username: formData.name,
            email: formData.email,
            password: formData.password,
            dob: formData.dob,
            age: this.age,
            address: formData.address,
            phoneNumber: formData.phone,
            gender: formData.gender,
            constituency: formData.constituency,
          })
          .subscribe(
            (response) =>
              console.log('Voter registered successfully', response),
            (error) => console.error('Error registering voter:', error)
          );
      }
    }
  }
}
