import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  constructor() { }
  signOut(): void {
    sessionStorage.clear();
    window.location.reload();
  }

  public getToken(): string | null {
    let token = sessionStorage.getItem("token")
    return token;
  }

  public getUserId(): any {
    const userID = sessionStorage.getItem("user_id")
    if (userID) {
      return userID;
    }
    return {};
  }

  public getUserType(): any {
    const userType = sessionStorage.getItem("userType")
    if (userType) {
      return userType;
    }
    return {};
  }

  public getUser(): any {
    const user = sessionStorage.getItem("userName");
    if (user) {

      return user;
    }
    return {};
  }
}
