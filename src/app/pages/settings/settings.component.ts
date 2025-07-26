import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../services/notification.service';

interface AppSettings {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  autoSave: boolean;
  language: string;
  itemsPerPage: number;
  emailNotifications: boolean;
  pushNotifications: boolean;
  dataSync: boolean;
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="settings-container">
      <header class="settings-header">
        <h1>Settings</h1>
        <p>Configure your application preferences</p>
      </header>

      <div class="settings-content">
        <div class="settings-section">
          <h2>Appearance</h2>
          <div class="setting-item">
            <label class="setting-label">Theme</label>
            <select [(ngModel)]="settings.theme" class="setting-select">
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto (System)</option>
            </select>
          </div>
        </div>

        <div class="settings-section">
          <h2>General</h2>
          <div class="setting-item">
            <label class="setting-label">Language</label>
            <select [(ngModel)]="settings.language" class="setting-select">
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="it">Italian</option>
            </select>
          </div>
          
          <div class="setting-item">
            <label class="setting-label">Items per page</label>
            <select [(ngModel)]="settings.itemsPerPage" class="setting-select">
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
          
          <div class="setting-item">
            <label class="setting-checkbox">
              <input 
                type="checkbox" 
                [(ngModel)]="settings.autoSave"
                class="checkbox-input"
              />
              <span class="checkbox-custom"></span>
              Auto-save changes
            </label>
            <p class="setting-description">Automatically save changes as you make them</p>
          </div>
        </div>

        <div class="settings-section">
          <h2>Notifications</h2>
          <div class="setting-item">
            <label class="setting-checkbox">
              <input 
                type="checkbox" 
                [(ngModel)]="settings.notifications"
                class="checkbox-input"
              />
              <span class="checkbox-custom"></span>
              Enable notifications
            </label>
            <p class="setting-description">Show notifications for important events</p>
          </div>
          
          <div class="setting-item">
            <label class="setting-checkbox">
              <input 
                type="checkbox" 
                [(ngModel)]="settings.emailNotifications"
                class="checkbox-input"
              />
              <span class="checkbox-custom"></span>
              Email notifications
            </label>
            <p class="setting-description">Receive notifications via email</p>
          </div>
          
          <div class="setting-item">
            <label class="setting-checkbox">
              <input 
                type="checkbox" 
                [(ngModel)]="settings.pushNotifications"
                class="checkbox-input"
              />
              <span class="checkbox-custom"></span>
              Push notifications
            </label>
            <p class="setting-description">Receive push notifications in your browser</p>
          </div>
        </div>

        <div class="settings-section">
          <h2>Data & Privacy</h2>
          <div class="setting-item">
            <label class="setting-checkbox">
              <input 
                type="checkbox" 
                [(ngModel)]="settings.dataSync"
                class="checkbox-input"
              />
              <span class="checkbox-custom"></span>
              Data synchronization
            </label>
            <p class="setting-description">Sync data across devices</p>
          </div>
        </div>

        <div class="settings-section">
          <h2>Account Actions</h2>
          <div class="action-buttons">
            <button (click)="exportData()" class="btn btn-secondary">
              📤 Export Data
            </button>
            <button (click)="clearCache()" class="btn btn-secondary">
              🧹 Clear Cache
            </button>
            <button (click)="resetSettings()" class="btn btn-warning">
              🔄 Reset Settings
            </button>
          </div>
        </div>

        <div class="settings-actions">
          <button (click)="saveSettings()" class="btn btn-primary">
            💾 Save Changes
          </button>
          <button (click)="cancelChanges()" class="btn btn-secondary">
            ❌ Cancel
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .settings-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
    }

    .settings-header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .settings-header h1 {
      color: #333;
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
    }

    .settings-header p {
      color: #666;
      font-size: 1.1rem;
    }

    .settings-content {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .settings-section {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }

    .settings-section h2 {
      color: #333;
      font-size: 1.5rem;
      margin: 0 0 1.5rem 0;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid #e2e8f0;
    }

    .setting-item {
      margin-bottom: 1.5rem;
    }

    .setting-item:last-child {
      margin-bottom: 0;
    }

    .setting-label {
      display: block;
      color: #333;
      font-weight: 500;
      margin-bottom: 0.5rem;
    }

    .setting-select {
      width: 100%;
      padding: 0.75rem;
      border: 2px solid #e2e8f0;
      border-radius: 8px;
      font-size: 1rem;
      background: white;
      transition: border-color 0.3s ease;
    }

    .setting-select:focus {
      outline: none;
      border-color: #667eea;
    }

    .setting-checkbox {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      cursor: pointer;
      font-weight: 500;
      color: #333;
    }

    .checkbox-input {
      display: none;
    }

    .checkbox-custom {
      width: 20px;
      height: 20px;
      border: 2px solid #e2e8f0;
      border-radius: 4px;
      background: white;
      position: relative;
      transition: all 0.3s ease;
    }

    .checkbox-input:checked + .checkbox-custom {
      background: #667eea;
      border-color: #667eea;
    }

    .checkbox-input:checked + .checkbox-custom::after {
      content: '✓';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: white;
      font-size: 0.8rem;
      font-weight: 700;
    }

    .setting-description {
      color: #666;
      font-size: 0.9rem;
      margin: 0.5rem 0 0 2.25rem;
      line-height: 1.4;
    }

    .action-buttons {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .settings-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
      padding-top: 1rem;
      border-top: 1px solid #e2e8f0;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 1rem;
      font-weight: 500;
      transition: all 0.3s ease;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }

    .btn-primary {
      background: #667eea;
      color: white;
    }

    .btn-primary:hover {
      background: #5a6fd8;
      transform: translateY(-2px);
    }

    .btn-secondary {
      background: #a0aec0;
      color: white;
    }

    .btn-secondary:hover {
      background: #718096;
      transform: translateY(-2px);
    }

    .btn-warning {
      background: #ed8936;
      color: white;
    }

    .btn-warning:hover {
      background: #dd7324;
      transform: translateY(-2px);
    }

    @media (max-width: 768px) {
      .settings-container {
        padding: 1rem;
      }
      
      .settings-header h1 {
        font-size: 2rem;
      }
      
      .settings-section {
        padding: 1.5rem;
      }
      
      .action-buttons {
        flex-direction: column;
      }
      
      .settings-actions {
        flex-direction: column;
      }
    }
  `]
})
export class SettingsComponent implements OnInit {
  settings: AppSettings = {
    theme: 'light',
    notifications: true,
    autoSave: true,
    language: 'en',
    itemsPerPage: 25,
    emailNotifications: false,
    pushNotifications: true,
    dataSync: true
  };

  private originalSettings: AppSettings = { ...this.settings };

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.loadSettings();
  }

  loadSettings() {
    const savedSettings = localStorage.getItem('app-settings');
    if (savedSettings) {
      this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
      this.originalSettings = { ...this.settings };
    }
  }

  saveSettings() {
    localStorage.setItem('app-settings', JSON.stringify(this.settings));
    this.originalSettings = { ...this.settings };
    this.notificationService.success('Settings saved successfully!');
  }

  cancelChanges() {
    this.settings = { ...this.originalSettings };
    this.notificationService.info('Changes canceled');
  }

  resetSettings() {
    if (confirm('Are you sure you want to reset all settings to default values?')) {
      this.settings = {
        theme: 'light',
        notifications: true,
        autoSave: true,
        language: 'en',
        itemsPerPage: 25,
        emailNotifications: false,
        pushNotifications: true,
        dataSync: true
      };
      this.notificationService.warning('Settings reset to default values');
    }
  }

  exportData() {
    const data = {
      settings: this.settings,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'app-settings-export.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    this.notificationService.success('Data exported successfully!');
  }

  clearCache() {
    if (confirm('Are you sure you want to clear the application cache?')) {
      localStorage.removeItem('app-cache');
      sessionStorage.clear();
      this.notificationService.success('Cache cleared successfully!');
    }
  }
}
