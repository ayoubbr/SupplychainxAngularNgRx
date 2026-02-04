import { Component } from "@angular/core"
import { RouterModule } from "@angular/router"
import { AuthService } from '../../../core/auth/auth.service';
import { ThemeService } from '../../../core/services/theme.service';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSun, faMoon, faUser, faSignOutAlt, faBars, faHome, faShoppingBag, faIndustry, faTruck } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: "app-header",
  standalone: true,
  imports: [RouterModule, FontAwesomeModule],
  templateUrl: "./header.component.html",
  styleUrl: "./header.component.css",
})
export class HeaderComponent {
  faSun = faSun;
  faMoon = faMoon;
  faUser = faUser;
  faSignOutAlt = faSignOutAlt;
  faBars = faBars;
  faHome = faHome;
  faShoppingBag = faShoppingBag;
  faIndustry = faIndustry;
  faTruck = faTruck;

  isMenuOpen = false

  constructor(public authService: AuthService, public themeService: ThemeService) {
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen
  }
}
