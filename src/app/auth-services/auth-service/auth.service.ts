import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const basicURL = ["http://localhost:8080/api/auth"]

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  signup(signupRequest: any): Observable<any> {
    return this.http.post(basicURL + "/signup", signupRequest)
  }
}
