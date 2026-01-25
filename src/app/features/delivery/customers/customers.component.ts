import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-customers',
    standalone: true,
    imports: [CommonModule, RouterOutlet],
    template: `<router-outlet></router-outlet>`,
    styles: []
})
export class CustomersComponent {
    // Logic moved to specific components (List, Form, Detail) and NgRx Store
}
