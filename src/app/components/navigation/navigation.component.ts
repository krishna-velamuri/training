import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar">
      <div class="nav-container">
        <div class="nav-brand">
          <a routerLink="/" class="brand-link">
            <span class="brand-icon">🚀</span>
            <span class="brand-text">Angular Training</span>
          </a>
        </div>
        
        <div class="nav-menu" [class.nav-menu-active]="isMenuOpen">
          <ul class="nav-list">
            <li class="nav-item">
              <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-link">
                <span class="nav-icon">🏠</span>
                <span class="nav-text">Home</span>
              </a>
            </li>
            <li class="nav-item">
              <a routerLink="/users" routerLinkActive="active" class="nav-link">
                <span class="nav-icon">👥</span>
                <span class="nav-text">Users</span>
              </a>
            </li>
            <li class="nav-item">
              <a routerLink="/dashboard" routerLinkActive="active" class="nav-link">
                <span class="nav-icon">📊</span>
                <span class="nav-text">Dashboard</span>
              </a>
            </li>
            <li class="nav-item">
              <a routerLink="/settings" routerLinkActive="active" class="nav-link">
                <span class="nav-icon">⚙️</span>
                <span class="nav-text">Settings</span>
              </a>
            </li>
            <li class="nav-item">
              <a routerLink="/template-forms" routerLinkActive="active" class="nav-link">
                <span class="nav-icon">📝</span>
                <span class="nav-text">Template Forms</span>
              </a>
            </li>
            <li class="nav-item">
              <a routerLink="/reactive-forms" routerLinkActive="active" class="nav-link">
                <span class="nav-icon">⚡</span>
                <span class="nav-text">Reactive Forms</span>
              </a>
            </li>
          </ul>
        </div>
        
        <div class="nav-toggle" (click)="toggleMenu()">
          <span class="toggle-bar"></span>
          <span class="toggle-bar"></span>
          <span class="toggle-bar"></span>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .nav-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 70px;
    }

    .nav-brand {
      display: flex;
      align-items: center;
    }

    .brand-link {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      text-decoration: none;
      color: white;
      font-weight: 700;
      font-size: 1.5rem;
      transition: opacity 0.3s ease;
    }

    .brand-link:hover {
      opacity: 0.8;
    }

    .brand-icon {
      font-size: 2rem;
    }

    .brand-text {
      font-family: 'Inter Tight', sans-serif;
    }

    .nav-menu {
      display: flex;
      align-items: center;
    }

    .nav-list {
      display: flex;
      list-style: none;
      margin: 0;
      padding: 0;
      gap: 0.5rem;
    }

    .nav-item {
      display: flex;
    }

    .nav-link {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1rem;
      text-decoration: none;
      color: rgba(255, 255, 255, 0.8);
      border-radius: 8px;
      transition: all 0.3s ease;
      font-weight: 500;
      position: relative;
      overflow: hidden;
    }

    .nav-link::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.1);
      transform: translateX(-100%);
      transition: transform 0.3s ease;
    }

    .nav-link:hover {
      color: white;
      transform: translateY(-2px);
    }

    .nav-link:hover::before {
      transform: translateX(0);
    }

    .nav-link.active {
      color: white;
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
    }

    .nav-icon {
      font-size: 1.1rem;
    }

    .nav-text {
      font-size: 0.95rem;
    }

    .nav-toggle {
      display: none;
      flex-direction: column;
      cursor: pointer;
      gap: 4px;
      padding: 0.5rem;
    }

    .toggle-bar {
      width: 25px;
      height: 3px;
      background: white;
      border-radius: 2px;
      transition: all 0.3s ease;
    }

    .nav-toggle:hover .toggle-bar {
      background: rgba(255, 255, 255, 0.8);
    }

    @media (max-width: 768px) {
      .nav-menu {
        position: fixed;
        top: 70px;
        left: 0;
        right: 0;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        backdrop-filter: blur(10px);
        transform: translateY(-100%);
        transition: transform 0.3s ease;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
      }

      .nav-menu-active {
        transform: translateY(0);
      }

      .nav-list {
        flex-direction: column;
        padding: 1rem 0;
        gap: 0;
      }

      .nav-link {
        padding: 1rem 1.5rem;
        border-radius: 0;
        justify-content: flex-start;
      }

      .nav-link:hover {
        transform: none;
        background: rgba(255, 255, 255, 0.1);
      }

      .nav-toggle {
        display: flex;
      }
    }

    @media (max-width: 480px) {
      .nav-container {
        padding: 0 0.5rem;
      }

      .brand-text {
        font-size: 1.25rem;
      }
    }
  `]
})
export class NavigationComponent {
  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
