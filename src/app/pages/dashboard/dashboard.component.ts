import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subject, takeUntil, map, combineLatest } from 'rxjs';
import { UserService, User } from '../../services/user.service';

interface DashboardStats {
  totalUsers: number;
  totalCompanies: number;
  topCities: { city: string; count: number }[];
  topCompanies: { company: string; count: number }[];
  recentUsers: User[];
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard-container">
      <header class="dashboard-header">
        <h1>Dashboard</h1>
        <p>Overview of your user management system</p>
      </header>

      <div class="loading" *ngIf="loading">
        <div class="spinner"></div>
        <p>Loading dashboard data...</p>
      </div>

      <div class="dashboard-content" *ngIf="!loading && stats">
        <!-- Key Metrics -->
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-icon">👥</div>
            <div class="metric-info">
              <div class="metric-value">{{stats.totalUsers}}</div>
              <div class="metric-label">Total Users</div>
            </div>
          </div>
          
          <div class="metric-card">
            <div class="metric-icon">🏢</div>
            <div class="metric-info">
              <div class="metric-value">{{stats.totalCompanies}}</div>
              <div class="metric-label">Companies</div>
            </div>
          </div>
          
          <div class="metric-card">
            <div class="metric-icon">📍</div>
            <div class="metric-info">
              <div class="metric-value">{{stats.topCities.length}}</div>
              <div class="metric-label">Cities</div>
            </div>
          </div>
          
          <div class="metric-card">
            <div class="metric-icon">📊</div>
            <div class="metric-info">
              <div class="metric-value">{{getAverageUsersPerCompany()}}</div>
              <div class="metric-label">Avg Users/Company</div>
            </div>
          </div>
        </div>

        <!-- Charts and Analytics -->
        <div class="analytics-grid">
          <!-- Top Cities -->
          <div class="analytics-card">
            <h3>Top Cities</h3>
            <div class="chart-container">
              <div class="bar-chart">
                <div 
                  *ngFor="let city of stats.topCities; let i = index"
                  class="bar-item"
                  [style.height.%]="(city.count / getMaxCityCount()) * 100"
                  [style.background]="getBarColor(i)"
                >
                  <div class="bar-label">{{city.city}}</div>
                  <div class="bar-value">{{city.count}}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Top Companies -->
          <div class="analytics-card">
            <h3>Top Companies</h3>
            <div class="company-list">
              <div *ngFor="let company of stats.topCompanies; let i = index" class="company-item">
                <div class="company-rank">{{i + 1}}</div>
                <div class="company-info">
                  <div class="company-name">{{company.company}}</div>
                  <div class="company-count">{{company.count}} users</div>
                </div>
                <div class="company-bar">
                  <div 
                    class="company-bar-fill"
                    [style.width.%]="(company.count / getMaxCompanyCount()) * 100"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Recent Users -->
          <div class="analytics-card">
            <h3>Recent Users</h3>
            <div class="recent-users">
              <div *ngFor="let user of stats.recentUsers" class="user-item">
                <div class="user-avatar">
                  {{getInitials(user.name)}}
                </div>
                <div class="user-info">
                  <div class="user-name">{{user.name}}</div>
                  <div class="user-email">{{user.email}}</div>
                </div>
                <a [routerLink]="['/users', user.id]" class="user-link">View</a>
              </div>
            </div>
          </div>

          <!-- Activity Feed -->
          <div class="analytics-card">
            <h3>System Activity</h3>
            <div class="activity-feed">
              <div *ngFor="let activity of getSystemActivity()" class="activity-item">
                <div class="activity-icon">{{activity.icon}}</div>
                <div class="activity-content">
                  <div class="activity-description">{{activity.description}}</div>
                  <div class="activity-time">{{activity.time}}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="quick-actions">
          <h3>Quick Actions</h3>
          <div class="action-buttons">
            <a routerLink="/users" class="action-btn">
              <div class="action-icon">👥</div>
              <div class="action-text">View All Users</div>
            </a>
            <button (click)="refreshData()" class="action-btn">
              <div class="action-icon">🔄</div>
              <div class="action-text">Refresh Data</div>
            </button>
            <a routerLink="/settings" class="action-btn">
              <div class="action-icon">⚙️</div>
              <div class="action-text">Settings</div>
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem;
    }

    .dashboard-header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .dashboard-header h1 {
      color: #333;
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
    }

    .dashboard-header p {
      color: #666;
      font-size: 1.1rem;
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

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 3rem;
    }

    .metric-card {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      gap: 1.5rem;
      transition: transform 0.3s ease;
    }

    .metric-card:hover {
      transform: translateY(-2px);
    }

    .metric-icon {
      font-size: 3rem;
      padding: 1rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      filter: grayscale(0.2);
    }

    .metric-value {
      font-size: 2.5rem;
      font-weight: 700;
      color: #333;
      margin-bottom: 0.5rem;
    }

    .metric-label {
      color: #666;
      font-size: 0.9rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .analytics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 2rem;
      margin-bottom: 3rem;
    }

    .analytics-card {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }

    .analytics-card h3 {
      color: #333;
      margin: 0 0 1.5rem 0;
      font-size: 1.5rem;
    }

    .chart-container {
      height: 200px;
      display: flex;
      align-items: end;
      justify-content: center;
    }

    .bar-chart {
      display: flex;
      align-items: end;
      gap: 1rem;
      height: 100%;
      width: 100%;
    }

    .bar-item {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      min-height: 20px;
      border-radius: 4px 4px 0 0;
      position: relative;
      transition: opacity 0.3s ease;
    }

    .bar-item:hover {
      opacity: 0.8;
    }

    .bar-label {
      position: absolute;
      bottom: -2rem;
      font-size: 0.8rem;
      color: #666;
      text-align: center;
      width: 100%;
    }

    .bar-value {
      position: absolute;
      top: -1.5rem;
      font-size: 0.8rem;
      color: #333;
      font-weight: 600;
    }

    .company-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .company-item {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .company-rank {
      background: #667eea;
      color: white;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 0.9rem;
    }

    .company-info {
      flex: 1;
    }

    .company-name {
      font-weight: 600;
      color: #333;
    }

    .company-count {
      font-size: 0.9rem;
      color: #666;
    }

    .company-bar {
      width: 100px;
      height: 6px;
      background: #e2e8f0;
      border-radius: 3px;
      overflow: hidden;
    }

    .company-bar-fill {
      height: 100%;
      background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
      transition: width 0.3s ease;
    }

    .recent-users {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .user-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.5rem;
      border-radius: 8px;
      transition: background 0.3s ease;
    }

    .user-item:hover {
      background: #f8f9fa;
    }

    .user-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 0.9rem;
    }

    .user-info {
      flex: 1;
    }

    .user-name {
      font-weight: 500;
      color: #333;
    }

    .user-email {
      font-size: 0.9rem;
      color: #666;
    }

    .user-link {
      background: #667eea;
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      text-decoration: none;
      font-size: 0.9rem;
      transition: background 0.3s ease;
    }

    .user-link:hover {
      background: #5a6fd8;
    }

    .activity-feed {
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

    .activity-description {
      font-weight: 500;
      color: #333;
      margin-bottom: 0.5rem;
    }

    .activity-time {
      font-size: 0.9rem;
      color: #666;
    }

    .quick-actions {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }

    .quick-actions h3 {
      color: #333;
      margin: 0 0 1.5rem 0;
      font-size: 1.5rem;
    }

    .action-buttons {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .action-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      padding: 1.5rem;
      background: #f8f9fa;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      text-decoration: none;
      color: #333;
      transition: all 0.3s ease;
      min-width: 120px;
    }

    .action-btn:hover {
      background: #e2e8f0;
      transform: translateY(-2px);
    }

    .action-icon {
      font-size: 1.5rem;
    }

    .action-text {
      font-size: 0.9rem;
      font-weight: 500;
    }

    @media (max-width: 768px) {
      .dashboard-container {
        padding: 1rem;
      }
      
      .metrics-grid {
        grid-template-columns: 1fr;
      }
      
      .analytics-grid {
        grid-template-columns: 1fr;
      }
      
      .action-buttons {
        justify-content: center;
      }
    }
  `]
})
export class DashboardComponent implements OnInit, OnDestroy {
  stats: DashboardStats | null = null;
  loading: boolean = false;
  private destroy$ = new Subject<void>();

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadDashboardData() {
    this.loading = true;
    this.userService.getUsers().pipe(
      map(users => this.calculateStats(users)),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (stats) => {
        this.stats = stats;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard data:', error);
        this.loading = false;
      }
    });
  }

  private calculateStats(users: User[]): DashboardStats {
    const cityCount: { [key: string]: number } = {};
    const companyCount: { [key: string]: number } = {};

    users.forEach(user => {
      cityCount[user.address.city] = (cityCount[user.address.city] || 0) + 1;
      companyCount[user.company] = (companyCount[user.company] || 0) + 1;
    });

    const topCities = Object.entries(cityCount)
      .map(([city, count]) => ({ city, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const topCompanies = Object.entries(companyCount)
      .map(([company, count]) => ({ company, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalUsers: users.length,
      totalCompanies: Object.keys(companyCount).length,
      topCities,
      topCompanies,
      recentUsers: users.slice(0, 5) // Simulate recent users
    };
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  getMaxCityCount(): number {
    return Math.max(...(this.stats?.topCities.map(c => c.count) || [1]));
  }

  getMaxCompanyCount(): number {
    return Math.max(...(this.stats?.topCompanies.map(c => c.count) || [1]));
  }

  getAverageUsersPerCompany(): number {
    if (!this.stats || this.stats.totalCompanies === 0) return 0;
    return Math.round(this.stats.totalUsers / this.stats.totalCompanies);
  }

  getBarColor(index: number): string {
    const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe'];
    return colors[index % colors.length];
  }

  getSystemActivity() {
    return [
      {
        icon: '🔄',
        description: 'System backup completed successfully',
        time: '2 hours ago'
      },
      {
        icon: '👤',
        description: 'New user registration',
        time: '4 hours ago'
      },
      {
        icon: '📊',
        description: 'Monthly report generated',
        time: '1 day ago'
      },
      {
        icon: '⚙️',
        description: 'System maintenance scheduled',
        time: '2 days ago'
      }
    ];
  }

  refreshData() {
    this.loadDashboardData();
  }
}
