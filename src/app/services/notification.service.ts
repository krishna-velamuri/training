import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, timer } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface Notification {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications: Notification[] = [];
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  private idCounter = 1;

  notifications$ = this.notificationsSubject.asObservable();

  constructor() { }

  private addNotification(notification: Omit<Notification, 'id' | 'timestamp'>): void {
    const newNotification: Notification = {
      id: this.idCounter++,
      timestamp: new Date(),
      ...notification
    };

    this.notifications.push(newNotification);
    this.notificationsSubject.next(this.notifications);

    // Auto-remove after 5 seconds
    timer(5000).pipe(
      tap(() => this.removeNotification(newNotification.id))
    ).subscribe();
  }

  success(message: string): void {
    this.addNotification({ message, type: 'success' });
  }

  error(message: string): void {
    this.addNotification({ message, type: 'error' });
  }

  info(message: string): void {
    this.addNotification({ message, type: 'info' });
  }

  warning(message: string): void {
    this.addNotification({ message, type: 'warning' });
  }

  removeNotification(id: number): void {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.notificationsSubject.next(this.notifications);
  }

  clearAll(): void {
    this.notifications = [];
    this.notificationsSubject.next(this.notifications);
  }
}
