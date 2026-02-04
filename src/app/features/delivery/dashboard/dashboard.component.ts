import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUsers, faBox, faTruck, faCheckCircle, faArrowUp, faArrowDown, faArrowRight } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-delivery-dashboard',
    standalone: true,
    imports: [RouterLink, FontAwesomeModule],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
    faUsers = faUsers;
    faBox = faBox;
    faTruck = faTruck;
    faCheckCircle = faCheckCircle;
    faArrowUp = faArrowUp;
    faArrowDown = faArrowDown;
    faArrowRight = faArrowRight;
}
