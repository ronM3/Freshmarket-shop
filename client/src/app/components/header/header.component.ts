import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TokenStorageService } from 'src/app/services/TokenStorageService';
import { UserService } from 'src/app/services/user.service';
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @ViewChild('mySidenav', { static: true }) MySidenav!: ElementRef;
  public searchText: string;
  public isMenuCollapsed = true;
  isLoggedIn = false;
  showAdminButton: boolean = false;
  userName?: string;
  userType?: string;
  faUser = faUser;
  faArrowRightFromBracket = faArrowRightFromBracket;

  constructor(private tokenStorageService: TokenStorageService, private userService: UserService, private router: Router) { }

  openNav() {
    this.MySidenav.nativeElement.style.width = "250px";
  }
  closeNav() {
    this.MySidenav.nativeElement.style.width = "0";
  }
  scrollTop(): void {
    window.scrollTo(0, 0)
  }
  logout() {
    // this.router.navigate(["/home"]);
    this.tokenStorageService.signOut();
  }
  ngOnInit() {
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.userName = user.substring(0, user.lastIndexOf("@"));
    }
    this.userType = this.tokenStorageService.getUserType()
    if (this.userType === "admin") {
      console.log(this.userType);
      this.showAdminButton = true;
    }
    else {
      this.showAdminButton = false;
    }
  }
}