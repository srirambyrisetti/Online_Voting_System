import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor() {}

  userid: number = 0;
  Username: string = '';
  Email: string = '';
  Constituency: string = '';
  Role: string = '';
  VoterId: string = '';
  jwttoken: string = '';

  getUser() {
    return {
      userid: this.userid,
      role: this.Role,
      username: this.Username,
      email: this.Email,
      Constituency: this.Constituency,
    };
  }

  getAdmin() {
    return {
      userid: this.userid,
      role: this.Role,
      username: this.Username,
      email: this.Email,
    };
  }

  setUser(
    userid: number,
    role: string,
    username: string,
    email: string,
    Constituency: string
  ) {
    this.userid = userid;
    this.Role = role;
    this.Username = username;
    this.Email = email;
    this.Constituency = Constituency;
  }

  setAdmin(userid: number, role: string, username: string, email: string) {
    this.userid = userid;
    this.Role = role;
    this.Username = username;
    this.Email = email;
  }
}
