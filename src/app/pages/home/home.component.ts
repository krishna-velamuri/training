import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="home-container">
      <header class="hero">
        <h1>Welcome to Angular Training</h1>
        <p>A comprehensive sample application demonstrating Angular features</p>
      </header>

      <section class="features">
        <div class="feature-grid">
          <div class="feature-card">
            <div class="feature-icon">👥</div>
            <h3>User Management</h3>
            <p>Browse and manage user profiles with detailed information</p>
            <a routerLink="/users" class="feature-link">View Users</a>
          </div>

          <div class="feature-card">
            <div class="feature-icon">🔍</div>
            <h3>Search & Filter</h3>
            <p>Search users by name, email, or company with real-time results</p>
            <a routerLink="/users" class="feature-link">Try Search</a>
          </div>

          <div class="feature-card">
            <div class="feature-icon">📊</div>
            <h3>Dashboard</h3>
            <p>View analytics and insights about your user base</p>
            <a routerLink="/dashboard" class="feature-link">View Dashboard</a>
          </div>

          <div class="feature-card">
            <div class="feature-icon">⚙️</div>
            <h3>Settings</h3>
            <p>Configure application preferences and user settings</p>
            <a routerLink="/settings" class="feature-link">Open Settings</a>
          </div>

          <div class="feature-card">
            <div class="feature-icon">📝</div>
            <h3>Template Forms</h3>
            <p>Learn template-driven forms with multi-step wizard and validation</p>
            <a routerLink="/template-forms" class="feature-link">Try Template Forms</a>
          </div>

          <div class="feature-card">
            <div class="feature-icon">⚡</div>
            <h3>Reactive Forms</h3>
            <p>Explore reactive forms with dynamic controls and advanced validation</p>
            <a routerLink="/reactive-forms" class="feature-link">Try Reactive Forms</a>
          </div>
        </div>
      </section>

      <section class="technologies">
        <h2>Technologies Used</h2>
        <div class="tech-grid">
          <div class="tech-item">
            <span class="tech-name">Angular 18</span>
            <span class="tech-desc">Latest Angular framework</span>
          </div>
          <div class="tech-item">
            <span class="tech-name">RxJS</span>
            <span class="tech-desc">Reactive programming</span>
          </div>
          <div class="tech-item">
            <span class="tech-name">TypeScript</span>
            <span class="tech-desc">Type-safe development</span>
          </div>
          <div class="tech-item">
            <span class="tech-name">Angular Router</span>
            <span class="tech-desc">Navigation & routing</span>
          </div>
          <div class="tech-item">
            <span class="tech-name">Services</span>
            <span class="tech-desc">Dependency injection</span>
          </div>
          <div class="tech-item">
            <span class="tech-name">Standalone Components</span>
            <span class="tech-desc">Modern Angular architecture</span>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .home-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .hero {
      text-align: center;
      margin-bottom: 4rem;
      padding: 4rem 2rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    }

    .hero h1 {
      font-size: 3rem;
      margin-bottom: 1rem;
      font-weight: 700;
    }

    .hero p {
      font-size: 1.25rem;
      opacity: 0.9;
    }

    .features {
      margin-bottom: 4rem;
    }

    .feature-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 2rem;
      margin-top: 2rem;
    }

    .feature-card {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      text-align: center;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .feature-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
    }

    .feature-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .feature-card h3 {
      color: #333;
      margin-bottom: 1rem;
      font-size: 1.5rem;
    }

    .feature-card p {
      color: #666;
      margin-bottom: 1.5rem;
      line-height: 1.6;
    }

    .feature-link {
      display: inline-block;
      background: #667eea;
      color: white;
      padding: 0.75rem 1.5rem;
      border-radius: 6px;
      text-decoration: none;
      transition: background 0.3s ease;
    }

    .feature-link:hover {
      background: #5a6fd8;
    }

    .technologies {
      background: #f8f9fa;
      padding: 3rem 2rem;
      border-radius: 12px;
    }

    .technologies h2 {
      text-align: center;
      color: #333;
      margin-bottom: 2rem;
      font-size: 2rem;
    }

    .tech-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
    }

    .tech-item {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    .tech-name {
      font-weight: 600;
      color: #333;
      margin-bottom: 0.5rem;
      font-size: 1.1rem;
    }

    .tech-desc {
      color: #666;
      font-size: 0.9rem;
    }

    @media (max-width: 768px) {
      .home-container {
        padding: 1rem;
      }
      
      .hero h1 {
        font-size: 2rem;
      }
      
      .hero p {
        font-size: 1rem;
      }
      
      .feature-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class HomeComponent {
  constructor() { }
}
