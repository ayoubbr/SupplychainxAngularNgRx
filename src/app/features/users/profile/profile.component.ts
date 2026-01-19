import { Component, computed, Signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService, User } from '../../../core/auth/auth.service';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="profile-container">
      <div class="glass-panel profile-card">
        <div class="profile-header">
          <div class="avatar-circle">
            {{ user()?.username?.charAt(0)?.toUpperCase() }}
          </div>
          <h1>{{ user()?.username }}</h1>
          <div class="roles">
            <span class="role-badge" *ngFor="let role of user()?.roles">{{ role }}</span>
          </div>
        </div>

        <div class="profile-details">
          <div class="detail-item">
            <label>Username</label>
            <div class="value">{{ user()?.username }}</div>
          </div>

          <div class="tokens-info">
             <div class="detail-item">
                <label>Access Token Expires In</label>
                <div class="value" [class.expired]="accessTokenTimeLeft <= 0">
                    {{ formatTime(accessTokenTimeLeft) }}
                </div>
             </div>
             <div class="detail-item">
                <label>Refresh Token Expires In</label>
                <div class="value" [class.expired]="refreshTokenTimeLeft <= 0">
                    {{ formatTime(refreshTokenTimeLeft) }}
                </div>
             </div>
          </div>

          <div class="actions">
             <button class="btn-refresh" (click)="testRefreshToken()">
                🔄 Test Refresh Token
             </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-container {
      display: flex;
      justify-content: center;
      padding: 4rem;
    }

    .profile-card {
      width: 100%;
      max-width: 500px;
      padding: 3rem;
      text-align: center;
    }

    .avatar-circle {
      width: 80px;
      height: 80px;
      background: linear-gradient(135deg, #0ea5e9, #2563eb);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2.5rem;
      font-weight: bold;
      color: white;
      margin: 0 auto 1.5rem;
    }

    .glass-panel {
      /*background: rgba(30, 41, 59, 0.4);*/
      backdrop-filter: blur(12px);
      border: 1px solid rgba(148, 163, 184, 0.1);
      border-radius: 16px;
    }

    h1 {
      color: white;
      margin-bottom: 0.5rem;
    }

    .roles {
      display: flex;
      gap: 0.5rem;
      justify-content: center;
      margin-bottom: 2rem;
    }

    .role-badge {
      background: rgba(148, 163, 184, 0.1);
      color: #94a3b8;
      padding: 4px 12px;
      border-radius: 99px;
      font-size: 0.85rem;
    }

    .profile-details {
      text-align: left;
    }

    .detail-item {
      margin-bottom: 1.5rem;
    }

    .detail-item label {
      display: block;
      color: #64748b;
      font-size: 0.9rem;
      margin-bottom: 0.25rem;
    }

    .detail-item .value {
      color: #f8fafc;
      font-size: 1.1rem;
      font-family: monospace;
    }

    .detail-item .value.expired {
        color: #ef4444;
    }

    .actions {
        display: flex;
        justify-content: center;
        margin-top: 2rem;
    }

    .btn-refresh {
        background: rgba(16, 185, 129, 0.2);
        color: #34d399;
        border: 1px solid rgba(16, 185, 129, 0.3);
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s;
        font-weight: 600;
    }

    .btn-refresh:hover {
        background: rgba(16, 185, 129, 0.3);
        transform: translateY(-1px);
    }
  `]
})
export class ProfileComponent implements OnInit, OnDestroy {
  user: Signal<User | null>;
  accessTokenTimeLeft: number = 0;
  refreshTokenTimeLeft: number = 0;
  private intervalId: any;

  constructor(private authService: AuthService, private toastService: ToastService) {
    this.user = this.authService.currentUser;
  }

  ngOnInit() {
    this.updateTimes();
    this.intervalId = setInterval(() => this.updateTimes(), 1000);
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  updateTimes() {
    const now = Date.now();
    const accessExp = this.authService.getAccessTokenExpiration();
    const refreshExp = this.authService.getRefreshTokenExpiration();

    this.accessTokenTimeLeft = accessExp ? Math.floor((accessExp - now) / 1000) : 0;
    this.refreshTokenTimeLeft = refreshExp ? Math.floor((refreshExp - now) / 1000) : 0;
  }

  formatTime(seconds: number): string {
    if (seconds <= 0) return 'Expired';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  }

  testRefreshToken() {
    this.toastService.info('Refreshing token...');
    this.authService.refreshToken().subscribe({
      next: () => {
        this.toastService.success('Token refreshed successfully!');
        this.updateTimes(); // Instant update
      },
      error: (err) => {
        this.toastService.error('Failed to refresh token');
        console.error(err);
      }
    });
  }
}
