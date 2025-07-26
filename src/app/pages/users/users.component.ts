import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subject, takeUntil, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { UserService, User } from '../../services/user.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="users-container">
      <header class="users-header">
        <h1>Users</h1>
        <div class="search-container">
          <input
            type="text"
            placeholder="Search users..."
            [(ngModel)]="searchTerm"
            (input)="onSearchChange($event)"
            class="search-input"
          />
          <div class="search-icon">🔍</div>
        </div>
      </header>

      <div class="users-stats">
        <div class="stat-card">
          <div class="stat-number">{{filteredUsers.length}}</div>
          <div class="stat-label">Total Users</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{getUsersWithCompany()}}</div>
          <div class="stat-label">With Company</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{getUniqueCompanies()}}</div>
          <div class="stat-label">Companies</div>
        </div>
      </div>

      <div class="loading" *ngIf="loading">
        <div class="spinner"></div>
        <p>Loading users...</p>
      </div>

      <div class="users-grid" *ngIf="!loading">
        <div
          *ngFor="let user of filteredUsers; trackBy: trackByUserId"
          class="user-card"
        >
          <div class="user-avatar">
            {{getInitials(user.name)}}
          </div>
          <div class="user-info">
            <h3>{{user.name}}</h3>
            <p class="user-email">{{user.email}}</p>
            <p class="user-company">{{user.company}}</p>
            <div class="user-contact">
              <span class="contact-item">📱 {{user.phone}}</span>
              <span class="contact-item">🌐 {{user.website}}</span>
            </div>
          </div>
          <div class="user-actions">
            <a [routerLink]="['/users', user.id, user.name]" class="btn btn-primary">
              View Details
            </a>
            <button (click)="deleteUser(user.id)" class="btn btn-danger">
              Delete
            </button>
          </div>
        </div>
      </div>

      <div class="no-results" *ngIf="!loading && filteredUsers.length === 0">
        <div class="no-results-icon">😕</div>
        <h3>No users found</h3>
        <p>Try adjusting your search criteria</p>
      </div>
    </div>
  `,
  styles: [`
    .users-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .users-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .users-header h1 {
      color: #333;
      font-size: 2.5rem;
      margin: 0;
    }

    .search-container {
      position: relative;
      display: flex;
      align-items: center;
    }

    .search-input {
      padding: 0.75rem 3rem 0.75rem 1rem;
      border: 2px solid #e2e8f0;
      border-radius: 8px;
      font-size: 1rem;
      min-width: 300px;
      transition: border-color 0.3s ease;
    }

    .search-input:focus {
      outline: none;
      border-color: #667eea;
    }

    .search-icon {
      position: absolute;
      right: 1rem;
      color: #a0aec0;
    }

    .users-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      text-align: center;
    }

    .stat-number {
      font-size: 2rem;
      font-weight: 700;
      color: #667eea;
      margin-bottom: 0.5rem;
    }

    .stat-label {
      color: #666;
      font-size: 0.9rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
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

    .users-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 1.5rem;
    }

    .user-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .user-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
    }

    .user-avatar {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 1.5rem;
      margin-bottom: 1rem;
    }

    .user-info h3 {
      color: #333;
      margin: 0 0 0.5rem 0;
      font-size: 1.25rem;
    }

    .user-email {
      color: #667eea;
      margin: 0 0 0.5rem 0;
      font-weight: 500;
    }

    .user-company {
      color: #666;
      margin: 0 0 1rem 0;
      font-style: italic;
    }

    .user-contact {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      margin-bottom: 1rem;
    }

    .contact-item {
      color: #666;
      font-size: 0.9rem;
    }

    .user-actions {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 6px;
      text-decoration: none;
      cursor: pointer;
      font-size: 0.9rem;
      transition: all 0.3s ease;
      display: inline-block;
      text-align: center;
    }

    .btn-primary {
      background: #667eea;
      color: white;
    }

    .btn-primary:hover {
      background: #5a6fd8;
    }

    .btn-danger {
      background: #e53e3e;
      color: white;
    }

    .btn-danger:hover {
      background: #c53030;
    }

    .no-results {
      text-align: center;
      padding: 3rem;
      color: #666;
    }

    .no-results-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    .no-results h3 {
      margin-bottom: 0.5rem;
      color: #333;
    }

    @media (max-width: 768px) {
      .users-container {
        padding: 1rem;
      }
      
      .users-header {
        flex-direction: column;
        align-items: stretch;
      }
      
      .search-input {
        min-width: 100%;
      }
      
      .users-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class UsersComponent implements OnInit, OnDestroy {
  users: User[] = [];
  filteredUsers: User[] = [];
  searchTerm: string = '';
  loading: boolean = false;
  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  constructor(
    private userService: UserService,
    private notificationService: NotificationService
  ) {
    // Setup search with debounce
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => this.userService.searchUsers(term)),
      takeUntil(this.destroy$)
    ).subscribe(users => {
      this.filteredUsers = users;
      this.loading = false;
    });
  }

  ngOnInit() {
    this.loadUsers();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadUsers() {
    this.loading = true;
    this.userService.getUsers().pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (users) => {
        this.users = users;
        this.filteredUsers = users;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.notificationService.error('Failed to load users');
        this.loading = false;
      }
    });
  }

  onSearchChange(event: Event) {
    const term = (event.target as HTMLInputElement).value;
    this.searchTerm = term;
    this.loading = true;
    this.searchSubject.next(term);
  }

  deleteUser(userId: number) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(userId).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: (success) => {
          if (success) {
            this.notificationService.success('User deleted successfully');
            this.loadUsers();
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

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  getUsersWithCompany(): number {
    return this.filteredUsers.filter(u => u.company && u.company.trim() !== '').length;
  }

  getUniqueCompanies(): number {
    const companies = new Set(this.filteredUsers.map(u => u.company));
    return companies.size;
  }

  trackByUserId(index: number, user: User): number {
    return user.id;
  }
}
