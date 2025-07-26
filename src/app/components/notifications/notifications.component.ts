import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { NotificationService, Notification } from '../../services/notification.service';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="notifications-container">
      <div 
        *ngFor="let notification of notifications; trackBy: trackByNotificationId"
        class="notification"
        [class.notification-success]="notification.type === 'success'"
        [class.notification-error]="notification.type === 'error'"
        [class.notification-warning]="notification.type === 'warning'"
        [class.notification-info]="notification.type === 'info'"
      >
        <div class="notification-icon">
          <span *ngIf="notification.type === 'success'">✅</span>
          <span *ngIf="notification.type === 'error'">❌</span>
          <span *ngIf="notification.type === 'warning'">⚠️</span>
          <span *ngIf="notification.type === 'info'">ℹ️</span>
        </div>
        <div class="notification-content">
          <p class="notification-message">{{notification.message}}</p>
          <small class="notification-time">{{formatTime(notification.timestamp)}}</small>
        </div>
        <button 
          (click)="removeNotification(notification.id)"
          class="notification-close"
          aria-label="Close notification"
        >
          ×
        </button>
      </div>
    </div>
  `,
  styles: [`
    .notifications-container {
      position: fixed;
      top: 1rem;
      right: 1rem;
      z-index: 1000;
      max-width: 400px;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      pointer-events: none;
    }

    .notification {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      padding: 1rem;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      background: white;
      border-left: 4px solid #667eea;
      min-width: 300px;
      pointer-events: auto;
      transform: translateX(100%);
      animation: slideIn 0.3s ease forwards;
    }

    @keyframes slideIn {
      to {
        transform: translateX(0);
      }
    }

    .notification-success {
      border-left-color: #48bb78;
      background: #f0fff4;
    }

    .notification-error {
      border-left-color: #e53e3e;
      background: #fed7d7;
    }

    .notification-warning {
      border-left-color: #ed8936;
      background: #fefcbf;
    }

    .notification-info {
      border-left-color: #4299e1;
      background: #ebf8ff;
    }

    .notification-icon {
      font-size: 1.25rem;
      flex-shrink: 0;
      margin-top: 0.125rem;
    }

    .notification-content {
      flex: 1;
      min-width: 0;
    }

    .notification-message {
      color: #333;
      margin: 0 0 0.25rem 0;
      font-weight: 500;
      line-height: 1.4;
      word-wrap: break-word;
    }

    .notification-time {
      color: #666;
      font-size: 0.75rem;
    }

    .notification-close {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: #666;
      padding: 0;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      flex-shrink: 0;
    }

    .notification-close:hover {
      background: rgba(0, 0, 0, 0.1);
      color: #333;
    }

    @media (max-width: 768px) {
      .notifications-container {
        top: 0.5rem;
        right: 0.5rem;
        left: 0.5rem;
        max-width: none;
      }
      
      .notification {
        min-width: auto;
      }
    }
  `]
})
export class NotificationsComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  private destroy$ = new Subject<void>();

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.notificationService.notifications$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(notifications => {
      this.notifications = notifications;
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  removeNotification(id: number) {
    this.notificationService.removeNotification(id);
  }

  formatTime(timestamp: Date): string {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  }

  trackByNotificationId(index: number, notification: Notification): number {
    return notification.id;
  }
}
