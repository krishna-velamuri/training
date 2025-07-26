import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subject, takeUntil, switchMap } from 'rxjs';
import { UserService, User } from '../../services/user.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="user-detail-container">
      <div class="breadcrumb">
        <a routerLink="/users" class="breadcrumb-link">Users</a>
        <span class="breadcrumb-separator">/</span>
        <span class="breadcrumb-current">{{user?.name || 'User Details'}}</span>
      </div>

      <div class="loading" *ngIf="loading">
        <div class="spinner"></div>
        <p>Loading user details...</p>
      </div>

      <div class="user-not-found" *ngIf="!loading && !user">
        <div class="not-found-icon">😕</div>
        <h2>User Not Found</h2>
        <p>The user you're looking for doesn't exist.</p>
        <a routerLink="/users" class="btn btn-primary">Back to Users</a>
      </div>

      <div class="user-detail-content" *ngIf="!loading && user">
        <div class="user-header">
          <div class="user-avatar-large">
            {{getInitials(user.name)}}
          </div>
          <div class="user-basic-info">
            <h1>{{user.name}}</h1>
            <p class="user-email">{{user.email}}</p>
            <p class="user-company">{{user.company}}</p>
          </div>
          <div class="user-actions">
            <button (click)="editUser()" class="btn btn-secondary">
              Edit User
            </button>
            <button (click)="deleteUser()" class="btn btn-danger">
              Delete User
            </button>
          </div>
        </div>

        <div class="user-details-grid">
          <div class="detail-card">
            <div class="detail-header">
              <div class="detail-icon">📞</div>
              <h3>Contact Information</h3>
            </div>
            <div class="detail-content">
              <div class="detail-item">
                <span class="detail-label">Phone:</span>
                <span class="detail-value">{{user.phone}}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Email:</span>
                <span class="detail-value">{{user.email}}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Website:</span>
                <span class="detail-value">
                  <a [href]="'https://' + user.website" target="_blank" class="website-link">
                    {{user.website}}
                  </a>
                </span>
              </div>
            </div>
          </div>

          <div class="detail-card">
            <div class="detail-header">
              <div class="detail-icon">🏢</div>
              <h3>Company Information</h3>
            </div>
            <div class="detail-content">
              <div class="detail-item">
                <span class="detail-label">Company:</span>
                <span class="detail-value">{{user.company}}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Role:</span>
                <span class="detail-value">{{getRandomRole()}}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Department:</span>
                <span class="detail-value">{{getRandomDepartment()}}</span>
              </div>
            </div>
          </div>

          <div class="detail-card">
            <div class="detail-header">
              <div class="detail-icon">📍</div>
              <h3>Address</h3>
            </div>
            <div class="detail-content">
              <div class="detail-item">
                <span class="detail-label">Street:</span>
                <span class="detail-value">{{user.address.street}}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">City:</span>
                <span class="detail-value">{{user.address.city}}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">ZIP Code:</span>
                <span class="detail-value">{{user.address.zipcode}}</span>
              </div>
            </div>
          </div>

          <div class="detail-card">
            <div class="detail-header">
              <div class="detail-icon">📊</div>
              <h3>Statistics</h3>
            </div>
            <div class="detail-content">
              <div class="detail-item">
                <span class="detail-label">Member Since:</span>
                <span class="detail-value">{{getRandomDate()}}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Last Active:</span>
                <span class="detail-value">{{getRandomLastActive()}}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Projects:</span>
                <span class="detail-value">{{getRandomProjects()}}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="user-activity">
          <h3>Recent Activity</h3>
          <div class="activity-list">
            <div class="activity-item" *ngFor="let activity of getRecentActivity()">
              <div class="activity-icon">{{activity.icon}}</div>
              <div class="activity-content">
                <p class="activity-description">{{activity.description}}</p>
                <span class="activity-time">{{activity.time}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .user-detail-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .breadcrumb {
      display: flex;
      align-items: center;
      margin-bottom: 2rem;
      font-size: 0.9rem;
    }

    .breadcrumb-link {
      color: #667eea;
      text-decoration: none;
      transition: color 0.3s ease;
    }

    .breadcrumb-link:hover {
      color: #5a6fd8;
    }

    .breadcrumb-separator {
      margin: 0 0.5rem;
      color: #a0aec0;
    }

    .breadcrumb-current {
      color: #666;
      font-weight: 500;
    }

    .loading {
      text-align: center;
      padding: 3rem;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #667eea;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .user-not-found {
      text-align: center;
      padding: 3rem;
      color: #666;
    }

    .not-found-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    .user-header {
      display: flex;
      align-items: center;
      gap: 2rem;
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      margin-bottom: 2rem;
      flex-wrap: wrap;
    }

    .user-avatar-large {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 2.5rem;
      flex-shrink: 0;
    }

    .user-basic-info {
      flex: 1;
      min-width: 200px;
    }

    .user-basic-info h1 {
      color: #333;
      margin: 0 0 0.5rem 0;
      font-size: 2rem;
    }

    .user-email {
      color: #667eea;
      margin: 0 0 0.5rem 0;
      font-weight: 500;
      font-size: 1.1rem;
    }

    .user-company {
      color: #666;
      margin: 0;
      font-style: italic;
      font-size: 1rem;
    }

    .user-actions {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 6px;
      text-decoration: none;
      cursor: pointer;
      font-size: 1rem;
      transition: all 0.3s ease;
      display: inline-block;
      text-align: center;
      white-space: nowrap;
    }

    .btn-primary {
      background: #667eea;
      color: white;
    }

    .btn-primary:hover {
      background: #5a6fd8;
    }

    .btn-secondary {
      background: #a0aec0;
      color: white;
    }

    .btn-secondary:hover {
      background: #718096;
    }

    .btn-danger {
      background: #e53e3e;
      color: white;
    }

    .btn-danger:hover {
      background: #c53030;
    }

    .user-details-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .detail-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }

    .detail-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .detail-icon {
      font-size: 1.5rem;
    }

    .detail-header h3 {
      color: #333;
      margin: 0;
      font-size: 1.25rem;
    }

    .detail-content {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .detail-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
    }

    .detail-label {
      font-weight: 500;
      color: #666;
      min-width: 100px;
    }

    .detail-value {
      color: #333;
      text-align: right;
    }

    .website-link {
      color: #667eea;
      text-decoration: none;
    }

    .website-link:hover {
      text-decoration: underline;
    }

    .user-activity {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }

    .user-activity h3 {
      color: #333;
      margin: 0 0 1.5rem 0;
      font-size: 1.5rem;
    }

    .activity-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .activity-item {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .activity-icon {
      font-size: 1.5rem;
      flex-shrink: 0;
    }

    .activity-content {
      flex: 1;
    }

    .activity-description {
      color: #333;
      margin: 0 0 0.5rem 0;
      font-weight: 500;
    }

    .activity-time {
      color: #666;
      font-size: 0.9rem;
    }

    @media (max-width: 768px) {
      .user-detail-container {
        padding: 1rem;
      }
      
      .user-header {
        flex-direction: column;
        text-align: center;
      }
      
      .user-details-grid {
        grid-template-columns: 1fr;
      }
      
      .detail-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
      }
      
      .detail-value {
        text-align: left;
      }
    }
  `]
})
export class UserDetailComponent implements OnInit, OnDestroy {
  user: User | null = null;
  loading: boolean = false;
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.route.params.pipe(
      switchMap(params => {
        const userId = +params['id'];
        if (isNaN(userId)) {
          this.router.navigate(['/users']);
          return [];
        }
        this.loading = true;
        return this.userService.getUserById(userId);
      }),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (user) => {
        this.user = user || null;
        this.loading = false;
        if (!user) {
          this.notificationService.warning('User not found');
        }
      },
      error: (error) => {
        console.error('Error loading user:', error);
        this.notificationService.error('Failed to load user details');
        this.loading = false;
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  editUser() {
    if (this.user) {
      this.router.navigate(['/users', this.user.id, 'edit']);
    }
  }

  deleteUser() {
    if (this.user && confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(this.user.id).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: (success) => {
          if (success) {
            this.notificationService.success('User deleted successfully');
            this.router.navigate(['/users']);
          } else {
            this.notificationService.error('Failed to delete user');
          }
        },
        error: (error) => {
          console.error('Error deleting user:', error);
          this.notificationService.error('Failed to delete user');
        }
      });
    }
  }

  getRandomRole(): string {
    const roles = ['Software Engineer', 'Product Manager', 'Designer', 'Marketing Manager', 'Sales Representative'];
    return roles[Math.floor(Math.random() * roles.length)];
  }

  getRandomDepartment(): string {
    const departments = ['Engineering', 'Product', 'Design', 'Marketing', 'Sales', 'Operations'];
    return departments[Math.floor(Math.random() * departments.length)];
  }

  getRandomDate(): string {
    const startDate = new Date('2020-01-01');
    const endDate = new Date();
    const randomDate = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
    return randomDate.toLocaleDateString();
  }

  getRandomLastActive(): string {
    const days = Math.floor(Math.random() * 30) + 1;
    return `${days} days ago`;
  }

  getRandomProjects(): number {
    return Math.floor(Math.random() * 20) + 1;
  }

  getRecentActivity() {
    return [
      {
        icon: '📝',
        description: 'Updated profile information',
        time: '2 hours ago'
      },
      {
        icon: '💬',
        description: 'Posted a comment on project discussion',
        time: '1 day ago'
      },
      {
        icon: '🔄',
        description: 'Completed task: Update user documentation',
        time: '3 days ago'
      },
      {
        icon: '🎯',
        description: 'Joined new project team',
        time: '1 week ago'
      }
    ];
  }
}
