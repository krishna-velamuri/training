import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators, AbstractControl } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { UserFormService, FormUser } from '../../services/user-form.service';
import { NotificationService } from '../../services/notification.service';
import { CustomValidators } from '../../validators/custom-validators';

@Component({
  selector: 'app-reactive-forms',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="form-container">
      <div class="form-header">
        <h1>Reactive Forms</h1>
        <p>Advanced Angular reactive forms with comprehensive validation and dynamic controls</p>
        <div class="breadcrumb">
          <a routerLink="/" class="breadcrumb-link">Home</a>
          <span class="breadcrumb-separator">/</span>
          <span class="breadcrumb-current">Reactive Forms</span>
        </div>
      </div>

      <div class="form-content">
        <!-- Form Tabs -->
        <div class="form-tabs">
          <button
            type="button"
            *ngFor="let tab of formTabs; let i = index"
            (click)="activeTab = i"
            class="tab-button"
            [class.active]="activeTab === i"
          >
            {{tab.label}}
            <span class="tab-badge" [class.error]="hasTabErrors(i)" [class.success]="isTabValid(i)">
              {{hasTabErrors(i) ? '!' : isTabValid(i) ? '✓' : ''}}
            </span>
          </button>
        </div>

        <!-- Main Form -->
        <form [formGroup]="userForm" (ngSubmit)="onSubmit()" class="reactive-form" novalidate>
          
          <!-- Tab 1: Basic Information -->
          <div class="form-tab" [class.active]="activeTab === 0">
            <h2>Basic Information</h2>
            
            <div class="form-row">
              <div class="form-group">
                <label for="username">Username *</label>
                <input
                  type="text"
                  id="username"
                  formControlName="username"
                  class="form-control"
                  [class.invalid]="isFieldInvalid('username')"
                  [class.pending]="userForm.get('username')?.pending"
                  placeholder="Enter username"
                />
                <div class="field-status">
                  <span *ngIf="userForm.get('username')?.pending" class="status-pending">
                    Checking availability...
                  </span>
                  <span *ngIf="userForm.get('username')?.valid && userForm.get('username')?.value" class="status-success">
                    Username available ✓
                  </span>
                </div>
                <div class="error-messages" *ngIf="isFieldInvalid('username')">
                  <small *ngIf="userForm.get('username')?.errors?.['required']">Username is required</small>
                  <small *ngIf="userForm.get('username')?.errors?.['minlength']">Username must be at least 3 characters</small>
                  <small *ngIf="userForm.get('username')?.errors?.['maxlength']">Username cannot exceed 20 characters</small>
                  <small *ngIf="userForm.get('username')?.errors?.['pattern']">Username can only contain letters, numbers, and underscores</small>
                  <small *ngIf="userForm.get('username')?.errors?.['usernameTaken']">Username is already taken</small>
                </div>
              </div>

              <div class="form-group">
                <label for="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  formControlName="email"
                  class="form-control"
                  [class.invalid]="isFieldInvalid('email')"
                  [class.pending]="userForm.get('email')?.pending"
                  placeholder="Enter email address"
                />
                <div class="field-status">
                  <span *ngIf="userForm.get('email')?.pending" class="status-pending">
                    Validating email...
                  </span>
                  <span *ngIf="userForm.get('email')?.valid && userForm.get('email')?.value" class="status-success">
                    Email valid ✓
                  </span>
                </div>
                <div class="error-messages" *ngIf="isFieldInvalid('email')">
                  <small *ngIf="userForm.get('email')?.errors?.['required']">Email is required</small>
                  <small *ngIf="userForm.get('email')?.errors?.['email']">Please enter a valid email address</small>
                  <small *ngIf="userForm.get('email')?.errors?.['emailTaken']">Email is already registered</small>
                </div>
              </div>
            </div>

            <div formGroupName="personalInfo" class="form-section">
              <h3>Personal Details</h3>
              
              <div class="form-row">
                <div class="form-group">
                  <label for="firstName">First Name *</label>
                  <input
                    type="text"
                    id="firstName"
                    formControlName="firstName"
                    class="form-control"
                    [class.invalid]="isNestedFieldInvalid('personalInfo', 'firstName')"
                    placeholder="Enter first name"
                  />
                  <div class="error-messages" *ngIf="isNestedFieldInvalid('personalInfo', 'firstName')">
                    <small *ngIf="userForm.get('personalInfo.firstName')?.errors?.['required']">First name is required</small>
                    <small *ngIf="userForm.get('personalInfo.firstName')?.errors?.['whitespace']">First name cannot be empty or whitespace</small>
                    <small *ngIf="userForm.get('personalInfo.firstName')?.errors?.['minlength']">First name must be at least 2 characters</small>
                  </div>
                </div>

                <div class="form-group">
                  <label for="lastName">Last Name *</label>
                  <input
                    type="text"
                    id="lastName"
                    formControlName="lastName"
                    class="form-control"
                    [class.invalid]="isNestedFieldInvalid('personalInfo', 'lastName')"
                    placeholder="Enter last name"
                  />
                  <div class="error-messages" *ngIf="isNestedFieldInvalid('personalInfo', 'lastName')">
                    <small *ngIf="userForm.get('personalInfo.lastName')?.errors?.['required']">Last name is required</small>
                    <small *ngIf="userForm.get('personalInfo.lastName')?.errors?.['whitespace']">Last name cannot be empty or whitespace</small>
                    <small *ngIf="userForm.get('personalInfo.lastName')?.errors?.['minlength']">Last name must be at least 2 characters</small>
                  </div>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="dateOfBirth">Date of Birth *</label>
                  <input
                    type="date"
                    id="dateOfBirth"
                    formControlName="dateOfBirth"
                    class="form-control"
                    [class.invalid]="isNestedFieldInvalid('personalInfo', 'dateOfBirth')"
                    [max]="maxDate"
                  />
                  <div class="error-messages" *ngIf="isNestedFieldInvalid('personalInfo', 'dateOfBirth')">
                    <small *ngIf="userForm.get('personalInfo.dateOfBirth')?.errors?.['required']">Date of birth is required</small>
                    <small *ngIf="userForm.get('personalInfo.dateOfBirth')?.errors?.['minimumAge']">
                      You must be at least {{userForm.get('personalInfo.dateOfBirth')?.errors?.['minimumAge']?.requiredAge}} years old
                    </small>
                  </div>
                </div>

                <div class="form-group">
                  <label for="phone">Phone Number *</label>
                  <input
                    type="tel"
                    id="phone"
                    formControlName="phone"
                    class="form-control"
                    [class.invalid]="isNestedFieldInvalid('personalInfo', 'phone')"
                    placeholder="(555) 123-4567"
                  />
                  <div class="error-messages" *ngIf="isNestedFieldInvalid('personalInfo', 'phone')">
                    <small *ngIf="userForm.get('personalInfo.phone')?.errors?.['required']">Phone number is required</small>
                    <small *ngIf="userForm.get('personalInfo.phone')?.errors?.['phoneNumber']">Please enter a valid phone number</small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Tab 2: Professional Information -->
          <div class="form-tab" [class.active]="activeTab === 1">
            <h2>Professional Information</h2>
            
            <div formGroupName="professionalInfo" class="form-section">
              <div class="form-row">
                <div class="form-group">
                  <label for="company">Company *</label>
                  <input
                    type="text"
                    id="company"
                    formControlName="company"
                    class="form-control"
                    [class.invalid]="isNestedFieldInvalid('professionalInfo', 'company')"
                    placeholder="Enter company name"
                  />
                  <div class="error-messages" *ngIf="isNestedFieldInvalid('professionalInfo', 'company')">
                    <small *ngIf="userForm.get('professionalInfo.company')?.errors?.['required']">Company is required</small>
                    <small *ngIf="userForm.get('professionalInfo.company')?.errors?.['minlength']">Company name must be at least 2 characters</small>
                  </div>
                </div>

                <div class="form-group">
                  <label for="position">Position *</label>
                  <input
                    type="text"
                    id="position"
                    formControlName="position"
                    class="form-control"
                    [class.invalid]="isNestedFieldInvalid('professionalInfo', 'position')"
                    placeholder="Enter job position"
                  />
                  <div class="error-messages" *ngIf="isNestedFieldInvalid('professionalInfo', 'position')">
                    <small *ngIf="userForm.get('professionalInfo.position')?.errors?.['required']">Position is required</small>
                    <small *ngIf="userForm.get('professionalInfo.position')?.errors?.['minlength']">Position must be at least 2 characters</small>
                  </div>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="experience">Years of Experience *</label>
                  <input
                    type="number"
                    id="experience"
                    formControlName="experience"
                    class="form-control"
                    [class.invalid]="isNestedFieldInvalid('professionalInfo', 'experience')"
                    placeholder="0"
                    min="0"
                    max="50"
                  />
                  <div class="error-messages" *ngIf="isNestedFieldInvalid('professionalInfo', 'experience')">
                    <small *ngIf="userForm.get('professionalInfo.experience')?.errors?.['required']">Experience is required</small>
                    <small *ngIf="userForm.get('professionalInfo.experience')?.errors?.['min']">Experience cannot be negative</small>
                    <small *ngIf="userForm.get('professionalInfo.experience')?.errors?.['max']">Experience cannot exceed 50 years</small>
                  </div>
                </div>

                <div class="form-group">
                  <label for="salary">Annual Salary (USD)</label>
                  <input
                    type="number"
                    id="salary"
                    formControlName="salary"
                    class="form-control"
                    [class.invalid]="isNestedFieldInvalid('professionalInfo', 'salary')"
                    placeholder="50000"
                  />
                  <div class="error-messages" *ngIf="isNestedFieldInvalid('professionalInfo', 'salary')">
                    <small *ngIf="userForm.get('professionalInfo.salary')?.errors?.['salaryRange']">
                      {{getSalaryRangeMessage()}}
                    </small>
                  </div>
                </div>
              </div>

              <!-- Dynamic Skills Array -->
              <div class="form-group">
                <label>Skills * (at least 3)</label>
                <div formArrayName="skills" class="skills-container">
                  <div *ngFor="let skill of skillsArray.controls; let i = index" class="skill-item">
                    <input
                      type="text"
                      [formControlName]="i"
                      class="form-control skill-input"
                      [class.invalid]="skill.invalid && skill.touched"
                      placeholder="Enter skill"
                    />
                    <button
                      type="button"
                      (click)="removeSkill(i)"
                      class="btn btn-danger btn-sm"
                      [disabled]="skillsArray.length <= 1"
                    >
                      Remove
                    </button>
                  </div>
                  <button
                    type="button"
                    (click)="addSkill()"
                    class="btn btn-secondary btn-sm"
                  >
                    Add Skill
                  </button>
                </div>
                <div class="error-messages" *ngIf="skillsArray.invalid && skillsArray.touched">
                  <small *ngIf="skillsArray.errors?.['arrayMinLength']">
                    Please add at least {{skillsArray.errors?.['arrayMinLength']?.requiredLength}} skills
                  </small>
                </div>
              </div>

              <div class="form-group">
                <label for="website">Website URL</label>
                <input
                  type="url"
                  id="website"
                  formControlName="website"
                  class="form-control"
                  [class.invalid]="isNestedFieldInvalid('professionalInfo', 'website')"
                  placeholder="https://example.com"
                />
                <div class="error-messages" *ngIf="isNestedFieldInvalid('professionalInfo', 'website')">
                  <small *ngIf="userForm.get('professionalInfo.website')?.errors?.['invalidUrl']">Please enter a valid URL</small>
                </div>
              </div>
            </div>
          </div>

          <!-- Tab 3: Security & Preferences -->
          <div class="form-tab" [class.active]="activeTab === 2">
            <h2>Security & Preferences</h2>
            
            <div formGroupName="security" class="form-section">
              <h3>Password</h3>
              
              <div class="form-row">
                <div class="form-group">
                  <label for="password">Password *</label>
                  <input
                    type="password"
                    id="password"
                    formControlName="password"
                    class="form-control"
                    [class.invalid]="isNestedFieldInvalid('security', 'password')"
                    placeholder="Enter password"
                  />
                  <div class="password-strength" *ngIf="userForm.get('security.password')?.value">
                    <div class="strength-item" [class.valid]="passwordValidation.hasNumber">
                      Contains number {{passwordValidation.hasNumber ? '✓' : '✗'}}
                    </div>
                    <div class="strength-item" [class.valid]="passwordValidation.hasUpper">
                      Contains uppercase {{passwordValidation.hasUpper ? '✓' : '✗'}}
                    </div>
                    <div class="strength-item" [class.valid]="passwordValidation.hasLower">
                      Contains lowercase {{passwordValidation.hasLower ? '✓' : '✗'}}
                    </div>
                    <div class="strength-item" [class.valid]="passwordValidation.hasSpecial">
                      Contains special character {{passwordValidation.hasSpecial ? '✓' : '✗'}}
                    </div>
                    <div class="strength-item" [class.valid]="passwordValidation.isLengthValid">
                      At least 8 characters {{passwordValidation.isLengthValid ? '✓' : '✗'}}
                    </div>
                  </div>
                  <div class="error-messages" *ngIf="isNestedFieldInvalid('security', 'password')">
                    <small *ngIf="userForm.get('security.password')?.errors?.['required']">Password is required</small>
                    <small *ngIf="userForm.get('security.password')?.errors?.['strongPassword']">
                      Password must meet all security requirements above
                    </small>
                  </div>
                </div>

                <div class="form-group">
                  <label for="confirmPassword">Confirm Password *</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    formControlName="confirmPassword"
                    class="form-control"
                    [class.invalid]="isNestedFieldInvalid('security', 'confirmPassword')"
                    placeholder="Confirm password"
                  />
                  <div class="error-messages" *ngIf="isNestedFieldInvalid('security', 'confirmPassword')">
                    <small *ngIf="userForm.get('security.confirmPassword')?.errors?.['required']">Please confirm your password</small>
                  </div>
                  <div class="error-messages" *ngIf="userForm.get('security')?.errors?.['passwordMismatch'] && userForm.get('security.confirmPassword')?.touched">
                    <small>Passwords do not match</small>
                  </div>
                </div>
              </div>
            </div>

            <div formGroupName="preferences" class="form-section">
              <h3>Preferences</h3>
              
              <div class="form-group">
                <label for="country">Country *</label>
                <select
                  id="country"
                  formControlName="country"
                  class="form-control"
                  [class.invalid]="isNestedFieldInvalid('preferences', 'country')"
                >
                  <option value="">Select a country</option>
                  <option *ngFor="let country of countries" [value]="country">
                    {{country}}
                  </option>
                </select>
                <div class="error-messages" *ngIf="isNestedFieldInvalid('preferences', 'country')">
                  <small *ngIf="userForm.get('preferences.country')?.errors?.['required']">Country is required</small>
                </div>
              </div>

              <div class="form-group">
                <label>Notifications</label>
                <div class="checkbox-group">
                  <label class="checkbox-option">
                    <input
                      type="checkbox"
                      formControlName="emailNotifications"
                    />
                    <span class="checkbox-custom"></span>
                    Email notifications
                  </label>
                  <label class="checkbox-option">
                    <input
                      type="checkbox"
                      formControlName="smsNotifications"
                    />
                    <span class="checkbox-custom"></span>
                    SMS notifications
                  </label>
                </div>
              </div>

              <div class="form-group">
                <div class="checkbox-group">
                  <label class="checkbox-option">
                    <input
                      type="checkbox"
                      formControlName="agreeToTerms"
                    />
                    <span class="checkbox-custom"></span>
                    I agree to the <a href="#" target="_blank">Terms and Conditions</a> *
                  </label>
                </div>
                <div class="error-messages" *ngIf="isNestedFieldInvalid('preferences', 'agreeToTerms')">
                  <small *ngIf="userForm.get('preferences.agreeToTerms')?.errors?.['required']">You must agree to the terms and conditions</small>
                </div>
              </div>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="form-actions">
            <div class="action-buttons">
              <button
                type="button"
                *ngIf="activeTab > 0"
                (click)="previousTab()"
                class="btn btn-secondary"
              >
                Previous
              </button>
              
              <button
                type="button"
                *ngIf="activeTab < formTabs.length - 1"
                (click)="nextTab()"
                class="btn btn-primary"
              >
                Next
              </button>
              
              <button
                type="submit"
                *ngIf="activeTab === formTabs.length - 1"
                class="btn btn-success"
                [disabled]="userForm.invalid || isSubmitting"
              >
                <span *ngIf="isSubmitting" class="spinner"></span>
                {{isSubmitting ? 'Creating Account...' : 'Create Account'}}
              </button>
            </div>

            <button
              type="button"
              (click)="resetForm()"
              class="btn btn-warning"
            >
              Reset Form
            </button>
          </div>
        </form>

        <!-- Form Debug Information -->
        <div class="debug-section" *ngIf="showDebugInfo">
          <h3>Form Debug Information</h3>
          
          <div class="debug-tabs">
            <button
              type="button"
              *ngFor="let debugTab of debugTabs; let i = index"
              (click)="activeDebugTab = i"
              class="debug-tab-button"
              [class.active]="activeDebugTab === i"
            >
              {{debugTab}}
            </button>
          </div>

          <div class="debug-content">
            <div *ngIf="activeDebugTab === 0" class="debug-panel">
              <h4>Form Status</h4>
              <pre>{{getFormStatus() | json}}</pre>
            </div>
            
            <div *ngIf="activeDebugTab === 1" class="debug-panel">
              <h4>Form Values</h4>
              <pre>{{userForm.value | json}}</pre>
            </div>
            
            <div *ngIf="activeDebugTab === 2" class="debug-panel">
              <h4>Form Errors</h4>
              <pre>{{getFormErrors() | json}}</pre>
            </div>
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
      max-width: 900px;
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

    .form-tabs {
      display: flex;
      background: #f8f9fa;
      border-bottom: 1px solid #e2e8f0;
    }

    .tab-button {
      flex: 1;
      padding: 1rem 1.5rem;
      border: none;
      background: transparent;
      cursor: pointer;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      transition: all 0.3s ease;
      font-weight: 500;
      color: #666;
    }

    .tab-button.active {
      background: white;
      color: #667eea;
      border-bottom: 3px solid #667eea;
    }

    .tab-button:hover:not(.active) {
      background: rgba(102, 126, 234, 0.05);
    }

    .tab-badge {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #e2e8f0;
      color: #666;
      font-size: 0.8rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
    }

    .tab-badge.error {
      background: #e53e3e;
      color: white;
    }

    .tab-badge.success {
      background: #48bb78;
      color: white;
    }

    .reactive-form {
      padding: 2rem;
    }

    .form-tab {
      display: none;
    }

    .form-tab.active {
      display: block;
    }

    .form-tab h2 {
      color: #333;
      margin-bottom: 2rem;
      font-size: 1.5rem;
    }

    .form-section {
      margin-bottom: 2rem;
      padding: 1.5rem;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      background: #f8f9fa;
    }

    .form-section h3 {
      color: #333;
      margin-bottom: 1rem;
      font-size: 1.25rem;
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

    .form-control.pending {
      border-color: #ed8936;
    }

    .field-status {
      font-size: 0.8rem;
      min-height: 1.2rem;
    }

    .status-pending {
      color: #ed8936;
    }

    .status-success {
      color: #48bb78;
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

    .password-strength {
      background: #f8f9fa;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 0.75rem;
      margin-top: 0.5rem;
    }

    .strength-item {
      font-size: 0.8rem;
      color: #e53e3e;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.25rem;
    }

    .strength-item.valid {
      color: #48bb78;
    }

    .skills-container {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .skill-item {
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }

    .skill-input {
      flex: 1;
    }

    .checkbox-group {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .checkbox-option {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      font-size: 0.9rem;
    }

    .checkbox-option input[type="checkbox"] {
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

    .form-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 3rem;
      padding-top: 2rem;
      border-top: 1px solid #e2e8f0;
    }

    .action-buttons {
      display: flex;
      gap: 1rem;
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

    .btn-sm {
      padding: 0.5rem 1rem;
      font-size: 0.9rem;
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

    .btn-warning {
      background: #ed8936;
      color: white;
    }

    .btn-warning:hover:not(:disabled) {
      background: #dd7324;
      transform: translateY(-2px);
    }

    .btn-danger {
      background: #e53e3e;
      color: white;
    }

    .btn-danger:hover:not(:disabled) {
      background: #c53030;
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

    .debug-section {
      margin-top: 2rem;
      border-top: 1px solid #e2e8f0;
      padding-top: 2rem;
    }

    .debug-section h3 {
      color: #333;
      margin-bottom: 1rem;
    }

    .debug-tabs {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .debug-tab-button {
      padding: 0.5rem 1rem;
      border: 1px solid #e2e8f0;
      background: white;
      cursor: pointer;
      border-radius: 6px;
      font-size: 0.9rem;
      transition: all 0.3s ease;
    }

    .debug-tab-button.active {
      background: #667eea;
      color: white;
      border-color: #667eea;
    }

    .debug-content {
      background: #f8f9fa;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      overflow: hidden;
    }

    .debug-panel {
      padding: 1rem;
    }

    .debug-panel h4 {
      color: #333;
      margin-bottom: 0.5rem;
      font-size: 1rem;
    }

    .debug-panel pre {
      background: white;
      padding: 1rem;
      border-radius: 4px;
      border: 1px solid #e2e8f0;
      overflow-x: auto;
      font-size: 0.8rem;
      white-space: pre-wrap;
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
      
      .reactive-form {
        padding: 1.5rem;
      }
      
      .form-actions {
        flex-direction: column;
        gap: 1rem;
        align-items: stretch;
      }
      
      .action-buttons {
        width: 100%;
        justify-content: space-between;
      }
      
      .skill-item {
        flex-direction: column;
        align-items: stretch;
      }
      
      .debug-tabs {
        flex-wrap: wrap;
      }
    }
  `]
})
export class ReactiveFormsComponent implements OnInit, OnDestroy {
  userForm!: FormGroup;
  countries: string[] = [];
  activeTab: number = 0;
  isSubmitting: boolean = false;
  showDebugInfo: boolean = false;
  activeDebugTab: number = 0;
  maxDate: string = '';

  formTabs = [
    { label: 'Basic Info', valid: false },
    { label: 'Professional', valid: false },
    { label: 'Security', valid: false }
  ];

  debugTabs = ['Status', 'Values', 'Errors'];

  passwordValidation = {
    hasNumber: false,
    hasUpper: false,
    hasLower: false,
    hasSpecial: false,
    isLengthValid: false
  };

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private userFormService: UserFormService,
    private notificationService: NotificationService
  ) {
    // Set max date for age validation
    const today = new Date();
    const minAgeDate = new Date(today.getFullYear() - 16, today.getMonth(), today.getDate());
    this.maxDate = minAgeDate.toISOString().split('T')[0];
  }

  ngOnInit() {
    this.initializeForm();
    this.loadCountries();
    this.setupPasswordValidation();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initializeForm() {
    this.userForm = this.fb.group({
      username: ['', {
        validators: [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
          Validators.pattern(/^[a-zA-Z0-9_]+$/)
        ],
        asyncValidators: [CustomValidators.asyncUsernameValidator()]
      }],
      email: ['', {
        validators: [Validators.required, Validators.email],
        asyncValidators: [CustomValidators.asyncEmailValidator()]
      }],
      personalInfo: this.fb.group({
        firstName: ['', [Validators.required, CustomValidators.noWhitespace, Validators.minLength(2)]],
        lastName: ['', [Validators.required, CustomValidators.noWhitespace, Validators.minLength(2)]],
        dateOfBirth: ['', [Validators.required, CustomValidators.minimumAge(16)]],
        phone: ['', [Validators.required, CustomValidators.phoneNumber]]
      }),
      professionalInfo: this.fb.group({
        company: ['', [Validators.required, Validators.minLength(2)]],
        position: ['', [Validators.required, Validators.minLength(2)]],
        experience: [0, [Validators.required, Validators.min(0), Validators.max(50)]],
        salary: [0, [CustomValidators.salaryRange(20000, 500000)]],
        skills: this.fb.array([
          this.fb.control('', [Validators.required, Validators.minLength(2)])
        ], [CustomValidators.arrayMinLength(3)]),
        website: ['', [CustomValidators.urlValidator]]
      }),
      security: this.fb.group({
        password: ['', [Validators.required, CustomValidators.strongPassword]],
        confirmPassword: ['', [Validators.required]]
      }, { validators: [CustomValidators.passwordMatch('password', 'confirmPassword')] }),
      preferences: this.fb.group({
        country: ['', [Validators.required]],
        emailNotifications: [true],
        smsNotifications: [false],
        agreeToTerms: [false, [Validators.requiredTrue]]
      })
    });
  }

  get skillsArray(): FormArray {
    return this.userForm.get('professionalInfo.skills') as FormArray;
  }

  addSkill() {
    this.skillsArray.push(this.fb.control('', [Validators.required, Validators.minLength(2)]));
  }

  removeSkill(index: number) {
    if (this.skillsArray.length > 1) {
      this.skillsArray.removeAt(index);
    }
  }

  setupPasswordValidation() {
    this.userForm.get('security.password')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(password => {
        if (password) {
          this.passwordValidation = {
            hasNumber: /[0-9]/.test(password),
            hasUpper: /[A-Z]/.test(password),
            hasLower: /[a-z]/.test(password),
            hasSpecial: /[#?!@$%^&*-]/.test(password),
            isLengthValid: password.length >= 8
          };
        } else {
          this.passwordValidation = {
            hasNumber: false,
            hasUpper: false,
            hasLower: false,
            hasSpecial: false,
            isLengthValid: false
          };
        }
      });
  }

  loadCountries() {
    this.userFormService.getCountries()
      .pipe(takeUntil(this.destroy$))
      .subscribe(countries => {
        this.countries = countries;
      });
  }

  nextTab() {
    if (this.activeTab < this.formTabs.length - 1) {
      this.activeTab++;
    }
  }

  previousTab() {
    if (this.activeTab > 0) {
      this.activeTab--;
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.userForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  isNestedFieldInvalid(groupName: string, fieldName: string): boolean {
    const field = this.userForm.get(`${groupName}.${fieldName}`);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  hasTabErrors(tabIndex: number): boolean {
    switch (tabIndex) {
      case 0:
        return this.userForm.get('username')?.invalid || this.userForm.get('email')?.invalid || this.userForm.get('personalInfo')?.invalid || false;
      case 1:
        return this.userForm.get('professionalInfo')?.invalid || false;
      case 2:
        return this.userForm.get('security')?.invalid || this.userForm.get('preferences')?.invalid || false;
      default:
        return false;
    }
  }

  isTabValid(tabIndex: number): boolean {
    switch (tabIndex) {
      case 0:
        return this.userForm.get('username')?.valid && this.userForm.get('email')?.valid && this.userForm.get('personalInfo')?.valid || false;
      case 1:
        return this.userForm.get('professionalInfo')?.valid || false;
      case 2:
        return this.userForm.get('security')?.valid && this.userForm.get('preferences')?.valid || false;
      default:
        return false;
    }
  }

  onSubmit() {
    if (this.userForm.valid) {
      this.isSubmitting = true;
      
      const formValue = this.userForm.value;
      const user: FormUser = {
        firstName: formValue.personalInfo.firstName,
        lastName: formValue.personalInfo.lastName,
        email: formValue.email,
        phone: formValue.personalInfo.phone,
        dateOfBirth: formValue.personalInfo.dateOfBirth,
        website: formValue.professionalInfo.website,
        company: formValue.professionalInfo.company,
        position: formValue.professionalInfo.position,
        salary: formValue.professionalInfo.salary,
        skills: formValue.professionalInfo.skills.filter((skill: string) => skill.trim()),
        bio: '',
        gender: '',
        country: formValue.preferences.country,
        agreeToTerms: formValue.preferences.agreeToTerms,
        newsletter: formValue.preferences.emailNotifications,
        contactPreference: 'email',
        experience: formValue.professionalInfo.experience
      };

      this.userFormService.createUser(user)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (createdUser) => {
            this.notificationService.success('Account created successfully!');
            this.resetForm();
            this.isSubmitting = false;
            this.activeTab = 0;
          },
          error: (error) => {
            console.error('Error creating user:', error);
            this.notificationService.error('Failed to create account. Please try again.');
            this.isSubmitting = false;
          }
        });
    } else {
      this.notificationService.warning('Please fill in all required fields correctly.');
      this.markAllFieldsAsTouched();
    }
  }

  resetForm() {
    this.userForm.reset();
    this.initializeForm();
    this.activeTab = 0;
  }

  markAllFieldsAsTouched() {
    this.userForm.markAllAsTouched();
  }

  getFormStatus() {
    return {
      valid: this.userForm.valid,
      invalid: this.userForm.invalid,
      pending: this.userForm.pending,
      disabled: this.userForm.disabled,
      touched: this.userForm.touched,
      untouched: this.userForm.untouched,
      dirty: this.userForm.dirty,
      pristine: this.userForm.pristine
    };
  }

  getFormErrors() {
    const errors: any = {};
    
    const collectErrors = (control: AbstractControl, path: string = ''): void => {
      if (control.errors) {
        errors[path] = control.errors;
      }
      
      if (control instanceof FormGroup) {
        Object.keys(control.controls).forEach(key => {
          collectErrors(control.controls[key], path ? `${path}.${key}` : key);
        });
      } else if (control instanceof FormArray) {
        control.controls.forEach((ctrl, index) => {
          collectErrors(ctrl, `${path}[${index}]`);
        });
      }
    };
    
    collectErrors(this.userForm);
    return errors;
  }

  getSalaryRangeMessage(): string {
    const salaryControl = this.userForm.get('professionalInfo.salary');
    const error = salaryControl?.errors?.['salaryRange'];
    if (error) {
      return `Salary must be between $${error.min} and $${error.max}`;
    }
    return '';
  }
}
