import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';

@Component({
    selector: 'app-toast',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="toast-container">
      <div *ngFor="let toast of toastService.toasts()"
           class="toast"
           [ngClass]="toast.type">
        <div class="toast-content">
          <span class="icon" *ngIf="toast.type === 'success'">✅</span>
          <span class="icon" *ngIf="toast.type === 'error'">❌</span>
          <span class="icon" *ngIf="toast.type === 'info'">ℹ️</span>
          <span class="message">{{ toast.message }}</span>
        </div>
        <button class="close-btn" (click)="toastService.remove(toast.id)">✕</button>
      </div>
    </div>
  `,
    styles: [`
    .toast-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      pointer-events: none; /* Allow clicking through container */
    }

    .toast {
      pointer-events: auto; /* Re-enable clicks on toasts */
      min-width: 300px;
      padding: 1rem;
      border-radius: 12px;
      background: rgba(30, 41, 59, 0.9);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(148, 163, 184, 0.1);
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #f8fafc;
      animation: slideIn 0.3s ease-out forwards;
      transition: all 0.3s ease;
    }

    .toast.success {
      border-left: 4px solid #4ade80;
      background: linear-gradient(to right, rgba(74, 222, 128, 0.1), rgba(30, 41, 59, 0.9));
    }

    .toast.error {
      border-left: 4px solid #ef4444;
      background: linear-gradient(to right, rgba(239, 68, 68, 0.1), rgba(30, 41, 59, 0.9));
    }

    .toast.info {
      border-left: 4px solid #38bdf8;
      background: linear-gradient(to right, rgba(56, 189, 248, 0.1), rgba(30, 41, 59, 0.9));
    }

    .toast-content {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .icon {
      font-size: 1.2rem;
    }

    .message {
      font-size: 0.95rem;
      font-weight: 500;
    }

    .close-btn {
      background: none;
      border: none;
      color: #94a3b8;
      font-size: 1.2rem;
      cursor: pointer;
      padding: 4px;
      opacity: 0.7;
      transition: opacity 0.2s;
    }

    .close-btn:hover {
      opacity: 1;
      color: #f1f5f9;
    }

    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `]
})
export class ToastComponent {
    constructor(public toastService: ToastService) {
    }
}
