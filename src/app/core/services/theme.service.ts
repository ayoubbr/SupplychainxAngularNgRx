import { Injectable, signal, effect } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    themeSignal = signal<'light' | 'dark'>('dark');

    constructor() {
        this.initializeTheme();

        // Automatically update the class/attribute on body whenever the signal changes
        effect(() => {
            const theme = this.themeSignal();
            document.body.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
        });
    }

    private initializeTheme() {
        const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
        if (savedTheme) {
            this.themeSignal.set(savedTheme);
        } else {
            // Default to dark if no preference is saved
            this.themeSignal.set('dark');
        }
    }

    toggleTheme() {
        this.themeSignal.update(current => current === 'dark' ? 'light' : 'dark');
    }

    isDark(): boolean {
        return this.themeSignal() === 'dark';
    }
}
