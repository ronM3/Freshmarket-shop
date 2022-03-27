import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IdExist } from "../Models/IdExist";
import { IUser } from '../Models/IUser';
import { NewUserDetails } from '../Models/newUserDetails';
import { SuccessAddingUserResponse } from '../Models/SuccessAddingUserResponse';
import { SuccessfulLoginServerResponse } from '../Models/SuccessfulLoginServerResponse';
import { UserLoginDetails } from '../Models/UserLoginDetails';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  userType?: string;
  email?: string;
  id?: number;
  constructor(private http: HttpClient) { }

  getDetailsOfUser(): Observable<IUser[]> {
    return this.http.get<IUser[]>("/users/")
  }

  login(userLoginDetails: UserLoginDetails): Observable<SuccessfulLoginServerResponse> {
    return this.http.post<SuccessfulLoginServerResponse>("/users/login", userLoginDetails)
  }

  createUser(newUserDetails: NewUserDetails): Observable<SuccessAddingUserResponse> {
    return this.http.post<SuccessAddingUserResponse>("/users/", newUserDetails);
  }

  isUserIdExist(id: IdExist): Observable<IdExist> {
    id = { id: id }
    return this.http.post<IdExist>("/users/idCheck/", id);
  }

}
