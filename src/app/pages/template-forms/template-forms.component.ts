import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { UserFormService, FormUser } from '../../services/user-form.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-template-forms',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="form-container">
      <div class="form-header">
        <h1>Template-Driven Forms</h1>
        <p>Comprehensive examples of Angular template-driven forms with various validation techniques</p>
        <div class="breadcrumb">
          <a routerLink="/" class="breadcrumb-link">Home</a>
          <span class="breadcrumb-separator">/</span>
          <span class="breadcrumb-current">Template Forms</span>
        </div>
      </div>

      <div class="form-content">
        <!-- Form Progress Indicator -->
        <div class="form-progress">
          <div class="progress-step" [class.active]="currentStep >= 1" [class.completed]="currentStep > 1">
            <div class="step-number">1</div>
            <div class="step-label">Personal Info</div>
          </div>
          <div class="progress-line" [class.completed]="currentStep > 1"></div>
          <div class="progress-step" [class.active]="currentStep >= 2" [class.completed]="currentStep > 2">
            <div class="step-number">2</div>
            <div class="step-label">Professional</div>
          </div>
          <div class="progress-line" [class.completed]="currentStep > 2"></div>
          <div class="progress-step" [class.active]="currentStep >= 3">
            <div class="step-number">3</div>
            <div class="step-label">Preferences</div>
          </div>
        </div>

        <!-- Main Form -->
        <form #userForm="ngForm" (ngSubmit)="onSubmit(userForm)" class="user-form" novalidate>
          
          <!-- Step 1: Personal Information -->
          <div class="form-step" [class.active]="currentStep === 1">
            <h2>Personal Information</h2>
            
            <div class="form-row">
              <div class="form-group">
                <label for="firstName">First Name *</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  [(ngModel)]="user.firstName"
                  #firstName="ngModel"
                  required
                  minlength="2"
                  maxlength="50"
                  pattern="[a-zA-Z]*"
                  class="form-control"
                  [class.invalid]="firstName.invalid && firstName.touched"
                  placeholder="Enter your first name"
                />
                <div class="error-messages" *ngIf="firstName.invalid && firstName.touched">
                  <small *ngIf="firstName.errors?.['required']">First name is required</small>
                  <small *ngIf="firstName.errors?.['minlength']">First name must be at least 2 characters</small>
                  <small *ngIf="firstName.errors?.['maxlength']">First name cannot exceed 50 characters</small>
                  <small *ngIf="firstName.errors?.['pattern']">First name can only contain letters</small>
                </div>
              </div>

              <div class="form-group">
                <label for="lastName">Last Name *</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  [(ngModel)]="user.lastName"
                  #lastName="ngModel"
                  required
                  minlength="2"
                  maxlength="50"
                  pattern="[a-zA-Z]*"
                  class="form-control"
                  [class.invalid]="lastName.invalid && lastName.touched"
                  placeholder="Enter your last name"
                />
                <div class="error-messages" *ngIf="lastName.invalid && lastName.touched">
                  <small *ngIf="lastName.errors?.['required']">Last name is required</small>
                  <small *ngIf="lastName.errors?.['minlength']">Last name must be at least 2 characters</small>
                  <small *ngIf="lastName.errors?.['maxlength']">Last name cannot exceed 50 characters</small>
                  <small *ngIf="lastName.errors?.['pattern']">Last name can only contain letters</small>
                </div>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  [(ngModel)]="user.email"
                  #email="ngModel"
                  required
                  email
                  class="form-control"
                  [class.invalid]="email.invalid && email.touched"
                  placeholder="Enter your email address"
                />
                <div class="error-messages" *ngIf="email.invalid && email.touched">
                  <small *ngIf="email.errors?.['required']">Email is required</small>
                  <small *ngIf="email.errors?.['email']">Please enter a valid email address</small>
                </div>
              </div>

              <div class="form-group">
                <label for="phone">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  [(ngModel)]="user.phone"
                  #phone="ngModel"
                  required
                  pattern="[0-9\\-\\s\\(\\)\\+]{10,15}"
                  class="form-control"
                  [class.invalid]="phone.invalid && phone.touched"
                  placeholder="(555) 123-4567"
                />
                <div class="error-messages" *ngIf="phone.invalid && phone.touched">
                  <small *ngIf="phone.errors?.['required']">Phone number is required</small>
                  <small *ngIf="phone.errors?.['pattern']">Please enter a valid phone number</small>
                </div>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="dateOfBirth">Date of Birth *</label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  [(ngModel)]="user.dateOfBirth"
                  #dateOfBirth="ngModel"
                  required
                  [max]="maxDate"
                  [min]="minDate"
                  class="form-control"
                  [class.invalid]="dateOfBirth.invalid && dateOfBirth.touched"
                />
                <div class="error-messages" *ngIf="dateOfBirth.invalid && dateOfBirth.touched">
                  <small *ngIf="dateOfBirth.errors?.['required']">Date of birth is required</small>
                  <small *ngIf="dateOfBirth.errors?.['max']">You must be at least 16 years old</small>
                  <small *ngIf="dateOfBirth.errors?.['min']">Please enter a valid date</small>
                </div>
              </div>

              <div class="form-group">
                <label for="gender">Gender</label>
                <select
                  id="gender"
                  name="gender"
                  [(ngModel)]="user.gender"
                  class="form-control"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label for="website">Website URL</label>
              <input
                type="url"
                id="website"
                name="website"
                [(ngModel)]="user.website"
                #website="ngModel"
                pattern="https?://.+"
                class="form-control"
                [class.invalid]="website.invalid && website.touched"
                placeholder="https://example.com"
              />
              <div class="error-messages" *ngIf="website.invalid && website.touched">
                <small *ngIf="website.errors?.['pattern']">Please enter a valid URL (including http:// or https://)</small>
              </div>
            </div>
          </div>

          <!-- Step 2: Professional Information -->
          <div class="form-step" [class.active]="currentStep === 2">
            <h2>Professional Information</h2>
            
            <div class="form-row">
              <div class="form-group">
                <label for="company">Company *</label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  [(ngModel)]="user.company"
                  #company="ngModel"
                  required
                  minlength="2"
                  maxlength="100"
                  class="form-control"
                  [class.invalid]="company.invalid && company.touched"
                  placeholder="Enter your company name"
                />
                <div class="error-messages" *ngIf="company.invalid && company.touched">
                  <small *ngIf="company.errors?.['required']">Company is required</small>
                  <small *ngIf="company.errors?.['minlength']">Company name must be at least 2 characters</small>
                  <small *ngIf="company.errors?.['maxlength']">Company name cannot exceed 100 characters</small>
                </div>
              </div>

              <div class="form-group">
                <label for="position">Position *</label>
                <input
                  type="text"
                  id="position"
                  name="position"
                  [(ngModel)]="user.position"
                  #position="ngModel"
                  required
                  minlength="2"
                  maxlength="100"
                  class="form-control"
                  [class.invalid]="position.invalid && position.touched"
                  placeholder="Enter your job position"
                />
                <div class="error-messages" *ngIf="position.invalid && position.touched">
                  <small *ngIf="position.errors?.['required']">Position is required</small>
                  <small *ngIf="position.errors?.['minlength']">Position must be at least 2 characters</small>
                  <small *ngIf="position.errors?.['maxlength']">Position cannot exceed 100 characters</small>
                </div>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="experience">Years of Experience *</label>
                <input
                  type="number"
                  id="experience"
                  name="experience"
                  [(ngModel)]="user.experience"
                  #experience="ngModel"
                  required
                  min="0"
                  max="50"
                  class="form-control"
                  [class.invalid]="experience.invalid && experience.touched"
                  placeholder="0"
                />
                <div class="error-messages" *ngIf="experience.invalid && experience.touched">
                  <small *ngIf="experience.errors?.['required']">Experience is required</small>
                  <small *ngIf="experience.errors?.['min']">Experience cannot be negative</small>
                  <small *ngIf="experience.errors?.['max']">Experience cannot exceed 50 years</small>
                </div>
              </div>

              <div class="form-group">
                <label for="salary">Annual Salary (USD)</label>
                <input
                  type="number"
                  id="salary"
                  name="salary"
                  [(ngModel)]="user.salary"
                  #salary="ngModel"
                  min="0"
                  max="1000000"
                  class="form-control"
                  [class.invalid]="salary.invalid && salary.touched"
                  placeholder="50000"
                />
                <div class="error-messages" *ngIf="salary.invalid && salary.touched">
                  <small *ngIf="salary.errors?.['min']">Salary cannot be negative</small>
                  <small *ngIf="salary.errors?.['max']">Salary cannot exceed $1,000,000</small>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label for="skills">Skills (comma-separated)</label>
              <textarea
                id="skills"
                name="skills"
                [(ngModel)]="skillsText"
                class="form-control"
                placeholder="JavaScript, TypeScript, Angular, React..."
                rows="3"
              ></textarea>
              <small class="form-help">Separate skills with commas</small>
            </div>

            <div class="form-group">
              <label for="bio">Professional Bio</label>
              <textarea
                id="bio"
                name="bio"
                [(ngModel)]="user.bio"
                #bio="ngModel"
                maxlength="500"
                class="form-control"
                [class.invalid]="bio.invalid && bio.touched"
                placeholder="Tell us about yourself..."
                rows="4"
              ></textarea>
              <div class="character-count">
                {{(user.bio && user.bio.length) || 0}}/500 characters
              </div>
              <div class="error-messages" *ngIf="bio.invalid && bio.touched">
                <small *ngIf="bio.errors?.['maxlength']">Bio cannot exceed 500 characters</small>
              </div>
            </div>
          </div>

          <!-- Step 3: Preferences -->
          <div class="form-step" [class.active]="currentStep === 3">
            <h2>Preferences & Settings</h2>
            
            <div class="form-group">
              <label for="country">Country *</label>
              <select
                id="country"
                name="country"
                [(ngModel)]="user.country"
                #country="ngModel"
                required
                class="form-control"
                [class.invalid]="country.invalid && country.touched"
              >
                <option value="">Select a country</option>
                <option *ngFor="let countryOption of countries" [value]="countryOption">
                  {{countryOption}}
                </option>
              </select>
              <div class="error-messages" *ngIf="country.invalid && country.touched">
                <small *ngIf="country.errors?.['required']">Country is required</small>
              </div>
            </div>

            <div class="form-group">
              <label>Contact Preference *</label>
              <div class="radio-group">
                <label class="radio-option">
                  <input
                    type="radio"
                    name="contactPreference"
                    value="email"
                    [(ngModel)]="user.contactPreference"
                    #contactPreference="ngModel"
                    required
                  />
                  <span class="radio-custom"></span>
                  Email
                </label>
                <label class="radio-option">
                  <input
                    type="radio"
                    name="contactPreference"
                    value="phone"
                    [(ngModel)]="user.contactPreference"
                    #contactPreference="ngModel"
                    required
                  />
                  <span class="radio-custom"></span>
                  Phone
                </label>
                <label class="radio-option">
                  <input
                    type="radio"
                    name="contactPreference"
                    value="both"
                    [(ngModel)]="user.contactPreference"
                    #contactPreference="ngModel"
                    required
                  />
                  <span class="radio-custom"></span>
                  Both
                </label>
              </div>
              <div class="error-messages" *ngIf="contactPreference.invalid && contactPreference.touched">
                <small *ngIf="contactPreference.errors?.['required']">Please select a contact preference</small>
              </div>
            </div>

            <div class="form-group">
              <div class="checkbox-group">
                <label class="checkbox-option">
                  <input
                    type="checkbox"
                    name="newsletter"
                    [(ngModel)]="user.newsletter"
                  />
                  <span class="checkbox-custom"></span>
                  Subscribe to newsletter
                </label>
              </div>
            </div>

            <div class="form-group">
              <div class="checkbox-group">
                <label class="checkbox-option">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    [(ngModel)]="user.agreeToTerms"
                    #agreeToTerms="ngModel"
                    required
                  />
                  <span class="checkbox-custom"></span>
                  I agree to the <a href="#" target="_blank">Terms and Conditions</a> *
                </label>
              </div>
              <div class="error-messages" *ngIf="agreeToTerms.invalid && agreeToTerms.touched">
                <small *ngIf="agreeToTerms.errors?.['required']">You must agree to the terms and conditions</small>
              </div>
            </div>
          </div>

          <!-- Form Navigation -->
          <div class="form-navigation">
            <button
              type="button"
              *ngIf="currentStep > 1"
              (click)="previousStep()"
              class="btn btn-secondary"
            >
              Previous
            </button>
            
            <button
              type="button"
              *ngIf="currentStep < 3"
              (click)="nextStep(userForm)"
              class="btn btn-primary"
              [disabled]="!canProceedToNext(userForm)"
            >
              Next
            </button>
            
            <button
              type="submit"
              *ngIf="currentStep === 3"
              class="btn btn-success"
              [disabled]="userForm.invalid || isSubmitting"
            >
              <span *ngIf="isSubmitting" class="spinner"></span>
              {{isSubmitting ? 'Submitting...' : 'Submit Form'}}
            </button>
          </div>
        </form>

        <!-- Form Debug Info (for learning purposes) -->
        <div class="debug-info" *ngIf="showDebugInfo">
          <h3>Form Debug Information</h3>
          <div class="debug-section">
            <h4>Form State</h4>
            <pre>{{getFormDebugInfo(userForm)}}</pre>
          </div>
          <div class="debug-section">
            <h4>Form Values</h4>
            <pre>{{user | json}}</pre>
          </div>
        </div>

        <button
          type="button"
          (click)="showDebugInfo = !showDebugInfo"
          class="btn btn-info debug-toggle"
        >
          {{showDebugInfo ? 'Hide' : 'Show'}} Debug Info
        </button>
      </div>
    </div>
  `,
  styles: [`
    .form-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
      background: #f8f9fa;
      min-height: 100vh;
    }

    .form-header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .form-header h1 {
      color: #333;
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
    }

    .form-header p {
      color: #666;
      font-size: 1.1rem;
      margin-bottom: 1rem;
    }

    .breadcrumb {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.9rem;
    }

    .breadcrumb-link {
      color: #667eea;
      text-decoration: none;
    }

    .breadcrumb-link:hover {
      text-decoration: underline;
    }

    .breadcrumb-separator {
      color: #a0aec0;
    }

    .breadcrumb-current {
      color: #666;
      font-weight: 500;
    }

    .form-content {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    .form-progress {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .progress-step {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
    }

    .step-number {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      transition: all 0.3s ease;
    }

    .progress-step.active .step-number {
      background: white;
      color: #667eea;
    }

    .progress-step.completed .step-number {
      background: #48bb78;
      color: white;
    }

    .step-label {
      font-size: 0.9rem;
      opacity: 0.8;
    }

    .progress-step.active .step-label {
      opacity: 1;
      font-weight: 500;
    }

    .progress-line {
      width: 60px;
      height: 2px;
      background: rgba(255, 255, 255, 0.3);
      margin: 0 1rem;
      transition: all 0.3s ease;
    }

    .progress-line.completed {
      background: #48bb78;
    }

    .user-form {
      padding: 2rem;
    }

    .form-step {
      display: none;
    }

    .form-step.active {
      display: block;
    }

    .form-step h2 {
      color: #333;
      margin-bottom: 2rem;
      font-size: 1.5rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-group label {
      color: #333;
      font-weight: 500;
      font-size: 0.9rem;
    }

    .form-control {
      padding: 0.75rem;
      border: 2px solid #e2e8f0;
      border-radius: 8px;
      font-size: 1rem;
      transition: all 0.3s ease;
      background: white;
    }

    .form-control:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .form-control.invalid {
      border-color: #e53e3e;
    }

    .form-control.invalid:focus {
      border-color: #e53e3e;
      box-shadow: 0 0 0 3px rgba(229, 62, 62, 0.1);
    }

    .error-messages {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .error-messages small {
      color: #e53e3e;
      font-size: 0.8rem;
    }

    .form-help {
      color: #666;
      font-size: 0.8rem;
    }

    .character-count {
      color: #666;
      font-size: 0.8rem;
      text-align: right;
    }

    .radio-group, .checkbox-group {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .radio-option, .checkbox-option {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      font-size: 0.9rem;
    }

    .radio-option input[type="radio"],
    .checkbox-option input[type="checkbox"] {
      display: none;
    }

    .radio-custom, .checkbox-custom {
      width: 20px;
      height: 20px;
      border: 2px solid #e2e8f0;
      border-radius: 50%;
      background: white;
      position: relative;
      transition: all 0.3s ease;
    }

    .checkbox-custom {
      border-radius: 4px;
    }

    .radio-option input[type="radio"]:checked + .radio-custom {
      border-color: #667eea;
      background: #667eea;
    }

    .radio-option input[type="radio"]:checked + .radio-custom::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: white;
    }

    .checkbox-option input[type="checkbox"]:checked + .checkbox-custom {
      border-color: #667eea;
      background: #667eea;
    }

    .checkbox-option input[type="checkbox"]:checked + .checkbox-custom::after {
      content: '✓';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: white;
      font-size: 0.8rem;
      font-weight: 700;
    }

    .form-navigation {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 3rem;
      padding-top: 2rem;
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

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-primary {
      background: #667eea;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background: #5a6fd8;
      transform: translateY(-2px);
    }

    .btn-secondary {
      background: #a0aec0;
      color: white;
    }

    .btn-secondary:hover:not(:disabled) {
      background: #718096;
      transform: translateY(-2px);
    }

    .btn-success {
      background: #48bb78;
      color: white;
    }

    .btn-success:hover:not(:disabled) {
      background: #38a169;
      transform: translateY(-2px);
    }

    .btn-info {
      background: #4299e1;
      color: white;
    }

    .btn-info:hover:not(:disabled) {
      background: #3182ce;
      transform: translateY(-2px);
    }

    .spinner {
      width: 16px;
      height: 16px;
      border: 2px solid transparent;
      border-top: 2px solid currentColor;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .debug-info {
      margin-top: 2rem;
      padding: 1.5rem;
      background: #f8f9fa;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
    }

    .debug-info h3 {
      color: #333;
      margin-bottom: 1rem;
    }

    .debug-section {
      margin-bottom: 1rem;
    }

    .debug-section h4 {
      color: #666;
      margin-bottom: 0.5rem;
      font-size: 1rem;
    }

    .debug-section pre {
      background: white;
      padding: 1rem;
      border-radius: 4px;
      border: 1px solid #e2e8f0;
      overflow-x: auto;
      font-size: 0.8rem;
    }

    .debug-toggle {
      margin-top: 1rem;
      width: 100%;
      justify-content: center;
    }

    @media (max-width: 768px) {
      .form-container {
        padding: 1rem;
      }
      
      .form-header h1 {
        font-size: 2rem;
      }
      
      .form-row {
        grid-template-columns: 1fr;
        gap: 1rem;
      }
      
      .form-progress {
        padding: 1rem;
      }
      
      .progress-line {
        width: 40px;
        margin: 0 0.5rem;
      }
      
      .user-form {
        padding: 1.5rem;
      }
      
      .form-navigation {
        flex-direction: column;
        gap: 1rem;
      }
      
      .btn {
        width: 100%;
        justify-content: center;
      }
    }
  `]
})
export class TemplateFormsComponent implements OnInit, OnDestroy {
  user: FormUser = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    website: '',
    company: '',
    position: '',
    salary: 0,
    skills: [],
    bio: '',
    gender: '',
    country: '',
    agreeToTerms: false,
    newsletter: false,
    contactPreference: '',
    experience: 0
  };

  skillsText: string = '';
  countries: string[] = [];
  currentStep: number = 1;
  isSubmitting: boolean = false;
  showDebugInfo: boolean = false;
  maxDate: string = '';
  minDate: string = '';

  private destroy$ = new Subject<void>();

  constructor(
    private userFormService: UserFormService,
    private notificationService: NotificationService
  ) {
    // Set date constraints (16 years old minimum)
    const today = new Date();
    const minAgeDate = new Date(today.getFullYear() - 16, today.getMonth(), today.getDate());
    const maxAgeDate = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate());
    
    this.maxDate = minAgeDate.toISOString().split('T')[0];
    this.minDate = maxAgeDate.toISOString().split('T')[0];
  }

  ngOnInit() {
    this.loadCountries();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadCountries() {
    this.userFormService.getCountries().pipe(
      takeUntil(this.destroy$)
    ).subscribe(countries => {
      this.countries = countries;
    });
  }

  nextStep(form: NgForm) {
    if (this.canProceedToNext(form)) {
      this.currentStep++;
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  canProceedToNext(form: NgForm): boolean {
    if (this.currentStep === 1) {
      const step1Fields = ['firstName', 'lastName', 'email', 'phone', 'dateOfBirth'];
      return step1Fields.every(field => {
        const control = form.controls[field];
        return control && control.valid;
      });
    }
    
    if (this.currentStep === 2) {
      const step2Fields = ['company', 'position', 'experience'];
      return step2Fields.every(field => {
        const control = form.controls[field];
        return control && control.valid;
      });
    }
    
    return true;
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      this.isSubmitting = true;
      
      // Convert skills text to array
      this.user.skills = this.skillsText
        .split(',')
        .map(skill => skill.trim())
        .filter(skill => skill.length > 0);

      this.userFormService.createUser(this.user).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: (createdUser) => {
          this.notificationService.success('User created successfully!');
          this.resetForm(form);
          this.isSubmitting = false;
          this.currentStep = 1;
        },
        error: (error) => {
          console.error('Error creating user:', error);
          this.notificationService.error('Failed to create user. Please try again.');
          this.isSubmitting = false;
        }
      });
    } else {
      this.notificationService.warning('Please fill in all required fields correctly.');
      this.markAllFieldsAsTouched(form);
    }
  }

  resetForm(form: NgForm) {
    form.resetForm();
    this.user = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      website: '',
      company: '',
      position: '',
      salary: 0,
      skills: [],
      bio: '',
      gender: '',
      country: '',
      agreeToTerms: false,
      newsletter: false,
      contactPreference: '',
      experience: 0
    };
    this.skillsText = '';
  }

  markAllFieldsAsTouched(form: NgForm) {
    Object.keys(form.controls).forEach(key => {
      form.controls[key].markAsTouched();
    });
  }

  getFormDebugInfo(form: NgForm): string {
    return JSON.stringify({
      valid: form.valid,
      touched: form.touched,
      dirty: form.dirty,
      submitted: form.submitted,
      errors: this.getFormErrors(form)
    }, null, 2);
  }

  getFormErrors(form: NgForm): any {
    const errors: any = {};
    Object.keys(form.controls).forEach(key => {
      const control = form.controls[key];
      if (control.errors) {
        errors[key] = control.errors;
      }
    });
    return errors;
  }
}
