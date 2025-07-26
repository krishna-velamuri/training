import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';

import { ReactiveFormsComponent } from './reactive-forms.component';
import { UserFormService, FormUser } from '../../services/user-form.service';
import { NotificationService } from '../../services/notification.service';

/**
 * REACTIVE FORMS TESTING CONCEPTS:
 * 
 * 1. FormBuilder Testing - Testing Angular reactive forms created with FormBuilder
 * 2. FormGroup/FormControl Testing - Testing form controls and their validation
 * 3. FormArray Testing - Testing dynamic form arrays (skills array)
 * 4. Cross-field Validation - Testing custom validators that compare multiple fields
 * 5. Async Validation - Testing asynchronous validators (username/email availability)
 * 6. Custom Validators - Testing custom validation logic
 * 7. Form State Testing - Testing touched, dirty, valid states
 * 8. Dynamic Form Controls - Testing addition/removal of form controls
 */

describe('ReactiveFormsComponent', () => {
  let component: ReactiveFormsComponent;
  let fixture: ComponentFixture<ReactiveFormsComponent>;
  let userFormService: jasmine.SpyObj<UserFormService>;
  let notificationService: jasmine.SpyObj<NotificationService>;

  const mockCountries = ['United States', 'Canada', 'United Kingdom'];
  const mockUser: FormUser = {
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    phone: '(555) 987-6543',
    dateOfBirth: '1985-05-15',
    website: 'https://janesmith.dev',
    company: 'Innovation Labs',
    position: 'Senior Developer',
    salary: 95000,
    skills: ['React', 'Node.js', 'MongoDB'],
    bio: 'Full-stack developer with 8 years experience',
    gender: 'female',
    country: 'Canada',
    agreeToTerms: true,
    newsletter: true,
    contactPreference: 'both',
    experience: 8
  };

  beforeEach(async () => {
    // Create spy objects for dependencies
    const userFormServiceSpy = jasmine.createSpyObj('UserFormService', 
      ['getCountries', 'createUser']);
    const notificationServiceSpy = jasmine.createSpyObj('NotificationService', 
      ['success', 'error', 'warning']);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsComponent,
        ReactiveFormsModule, // Required for reactive forms
        RouterTestingModule
      ],
      providers: [
        FormBuilder, // Required for reactive forms
        { provide: UserFormService, useValue: userFormServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy }
      ]
    }).compileComponents();

    userFormService = TestBed.inject(UserFormService) as jasmine.SpyObj<UserFormService>;
    notificationService = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;

    // Configure default spy return values
    userFormService.getCountries.and.returnValue(of(mockCountries));
    userFormService.createUser.and.returnValue(of(mockUser));
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReactiveFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /**
   * FORM INITIALIZATION TESTS
   * Testing reactive form setup and structure
   */
  describe('Form Initialization', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize reactive form with correct structure', () => {
      // Test that FormGroup is properly structured
      expect(component.userForm).toBeDefined();
      expect(component.userForm.get('username')).toBeDefined();
      expect(component.userForm.get('email')).toBeDefined();
      expect(component.userForm.get('personalInfo')).toBeDefined();
      expect(component.userForm.get('professionalInfo')).toBeDefined();
      expect(component.userForm.get('security')).toBeDefined();
      expect(component.userForm.get('preferences')).toBeDefined();
    });

    it('should initialize nested form groups correctly', () => {
      // Test nested FormGroup structure
      const personalInfo = component.userForm.get('personalInfo');
      expect(personalInfo?.get('firstName')).toBeDefined();
      expect(personalInfo?.get('lastName')).toBeDefined();
      expect(personalInfo?.get('dateOfBirth')).toBeDefined();
      expect(personalInfo?.get('phone')).toBeDefined();
    });

    it('should initialize skills FormArray with one control', () => {
      // Test FormArray initialization
      const skillsArray = component.skillsArray;
      expect(skillsArray).toBeDefined();
      expect(skillsArray.length).toBe(1);
      expect(skillsArray.at(0)).toBeDefined();
    });

    it('should have correct initial validation state', () => {
      // Test initial form validation state
      expect(component.userForm.valid).toBe(false);
      expect(component.userForm.pristine).toBe(true);
      expect(component.userForm.untouched).toBe(true);
    });
  });

  /**
   * FORM VALIDATION TESTS
   * Testing various validation scenarios
   */
  describe('Form Validation', () => {
    it('should validate required fields', () => {
      // Test required field validation
      const usernameControl = component.userForm.get('username');
      expect(usernameControl?.valid).toBe(false);
      expect(usernameControl?.errors?.['required']).toBeTruthy();
      
      // Set value and test validation passes
      usernameControl?.setValue('testuser');
      expect(usernameControl?.errors?.['required']).toBeFalsy();
    });

    it('should validate email format', () => {
      // Test email validation
      const emailControl = component.userForm.get('email');
      
      emailControl?.setValue('invalid-email');
      expect(emailControl?.errors?.['email']).toBeTruthy();
      
      emailControl?.setValue('valid@email.com');
      expect(emailControl?.errors?.['email']).toBeFalsy();
    });

    it('should validate minimum length requirements', () => {
      // Test minLength validation
      const firstNameControl = component.userForm.get('personalInfo.firstName');
      
      firstNameControl?.setValue('A');
      expect(firstNameControl?.errors?.['minlength']).toBeTruthy();
      
      firstNameControl?.setValue('Alice');
      expect(firstNameControl?.errors?.['minlength']).toBeFalsy();
    });

    it('should validate number ranges', () => {
      // Test min/max validation for numbers
      const experienceControl = component.userForm.get('professionalInfo.experience');
      
      experienceControl?.setValue(-1);
      expect(experienceControl?.errors?.['min']).toBeTruthy();
      
      experienceControl?.setValue(51);
      expect(experienceControl?.errors?.['max']).toBeTruthy();
      
      experienceControl?.setValue(5);
      expect(experienceControl?.errors?.['min']).toBeFalsy();
      expect(experienceControl?.errors?.['max']).toBeFalsy();
    });

    it('should validate custom password requirements', () => {
      // Test custom password validation
      const passwordControl = component.userForm.get('security.password');
      
      passwordControl?.setValue('weak');
      expect(passwordControl?.errors?.['strongPassword']).toBeTruthy();
      
      passwordControl?.setValue('StrongPass123!');
      expect(passwordControl?.errors?.['strongPassword']).toBeFalsy();
    });

    it('should validate password confirmation match', () => {
      // Test cross-field validation (password match)
      const passwordControl = component.userForm.get('security.password');
      const confirmPasswordControl = component.userForm.get('security.confirmPassword');
      const securityGroup = component.userForm.get('security');
      
      passwordControl?.setValue('StrongPass123!');
      confirmPasswordControl?.setValue('DifferentPass123!');
      
      expect(securityGroup?.errors?.['passwordMismatch']).toBeTruthy();
      
      confirmPasswordControl?.setValue('StrongPass123!');
      expect(securityGroup?.errors?.['passwordMismatch']).toBeFalsy();
    });
  });

  /**
   * DYNAMIC FORM CONTROLS TESTS
   * Testing FormArray manipulation (skills)
   */
  describe('Dynamic Form Controls', () => {
    it('should add new skill control', () => {
      // Test adding controls to FormArray
      const initialLength = component.skillsArray.length;
      
      component.addSkill();
      
      expect(component.skillsArray.length).toBe(initialLength + 1);
      expect(component.skillsArray.at(initialLength)).toBeDefined();
    });

    it('should remove skill control', () => {
      // Test removing controls from FormArray
      component.addSkill(); // Add a second skill
      const initialLength = component.skillsArray.length;
      
      component.removeSkill(0);
      
      expect(component.skillsArray.length).toBe(initialLength - 1);
    });

    it('should not remove skill if only one remains', () => {
      // Test boundary condition - minimum array length
      expect(component.skillsArray.length).toBe(1);
      
      component.removeSkill(0);
      
      expect(component.skillsArray.length).toBe(1);
    });

    it('should validate skills array minimum length', () => {
      // Test custom array validation
      const skillsArray = component.skillsArray;
      
      // Array should be invalid with only one empty skill
      expect(skillsArray.errors?.['arrayMinLength']).toBeTruthy();
      
      // Add more skills to meet minimum requirement
      component.addSkill();
      component.addSkill();
      skillsArray.at(0).setValue('JavaScript');
      skillsArray.at(1).setValue('Angular');
      skillsArray.at(2).setValue('TypeScript');
      
      expect(skillsArray.errors?.['arrayMinLength']).toBeFalsy();
    });
  });

  /**
   * TAB NAVIGATION TESTS
   * Testing tabbed form interface
   */
  describe('Tab Navigation', () => {
    it('should switch between tabs', () => {
      // Test tab switching functionality
      expect(component.activeTab).toBe(0);
      
      component.activeTab = 1;
      fixture.detectChanges();
      
      const activeTabs = fixture.debugElement.queryAll(By.css('.form-tab.active'));
      expect(activeTabs.length).toBe(1);
    });

    it('should detect tab errors correctly', () => {
      // Test tab error detection
      expect(component.hasTabErrors(0)).toBe(true); // Should have errors initially
      
      // Fill required fields for tab 0
      component.userForm.patchValue({
        username: 'testuser',
        email: 'test@example.com',
        personalInfo: {
          firstName: 'John',
          lastName: 'Doe',
          dateOfBirth: '1990-01-01',
          phone: '5551234567'
        }
      });
      
      expect(component.hasTabErrors(0)).toBe(false);
    });

    it('should detect tab validity correctly', () => {
      // Test tab validity detection
      expect(component.isTabValid(0)).toBe(false);
      
      // Make tab valid by filling required fields
      component.userForm.patchValue({
        username: 'testuser',
        email: 'test@example.com',
        personalInfo: {
          firstName: 'John',
          lastName: 'Doe',
          dateOfBirth: '1990-01-01',
          phone: '5551234567'
        }
      });
      
      expect(component.isTabValid(0)).toBe(true);
    });
  });

  /**
   * FORM SUBMISSION TESTS
   * Testing form submission and data transformation
   */
  describe('Form Submission', () => {
    beforeEach(() => {
      // Set up a valid form for submission tests
      component.userForm.patchValue({
        username: 'testuser',
        email: 'test@example.com',
        personalInfo: {
          firstName: 'John',
          lastName: 'Doe',
          dateOfBirth: '1990-01-01',
          phone: '5551234567'
        },
        professionalInfo: {
          company: 'Test Corp',
          position: 'Developer',
          experience: 5,
          salary: 75000,
          website: 'https://test.com'
        },
        security: {
          password: 'StrongPass123!',
          confirmPassword: 'StrongPass123!'
        },
        preferences: {
          country: 'United States',
          emailNotifications: true,
          smsNotifications: false,
          agreeToTerms: true
        }
      });
      
      // Set skills array
      component.skillsArray.clear();
      component.addSkill();
      component.addSkill();
      component.addSkill();
      component.skillsArray.at(0).setValue('JavaScript');
      component.skillsArray.at(1).setValue('Angular');
      component.skillsArray.at(2).setValue('TypeScript');
    });

    it('should submit valid form', fakeAsync(() => {
      // Test successful form submission
      component.onSubmit();
      tick();
      
      expect(userFormService.createUser).toHaveBeenCalled();
      expect(notificationService.success).toHaveBeenCalledWith('User created successfully!');
    }));

    it('should transform form data correctly for submission', fakeAsync(() => {
      // Test data transformation during submission
      component.onSubmit();
      tick();
      
      const submittedData = userFormService.createUser.calls.mostRecent().args[0];
      expect(submittedData.firstName).toBe('John');
      expect(submittedData.skills).toEqual(['JavaScript', 'Angular', 'TypeScript']);
    }));

    it('should handle submission errors', fakeAsync(() => {
      // Test error handling
      userFormService.createUser.and.returnValue(throwError(() => new Error('API Error')));
      
      component.onSubmit();
      tick();
      
      expect(notificationService.error).toHaveBeenCalledWith('Failed to create user. Please try again.');
    }));

    it('should not submit invalid form', () => {
      // Test form validation prevents submission
      component.userForm.get('username')?.setValue(''); // Make form invalid
      
      component.onSubmit();
      
      expect(userFormService.createUser).not.toHaveBeenCalled();
      expect(notificationService.warning).toHaveBeenCalledWith('Please fill in all required fields correctly.');
    });
  });

  /**
   * PASSWORD VALIDATION VISUAL FEEDBACK TESTS
   * Testing password strength indicator
   */
  describe('Password Validation Feedback', () => {
    it('should update password validation indicators', () => {
      // Test password strength visual feedback
      const passwordControl = component.userForm.get('security.password');
      
      passwordControl?.setValue('weak');
      expect(component.passwordValidation.hasNumber).toBe(false);
      expect(component.passwordValidation.hasUpper).toBe(false);
      expect(component.passwordValidation.hasLower).toBe(true);
      expect(component.passwordValidation.hasSpecial).toBe(false);
      
      passwordControl?.setValue('StrongPass123!');
      expect(component.passwordValidation.hasNumber).toBe(true);
      expect(component.passwordValidation.hasUpper).toBe(true);
      expect(component.passwordValidation.hasLower).toBe(true);
      expect(component.passwordValidation.hasSpecial).toBe(true);
    });
  });

  /**
   * UTILITY METHODS TESTS
   * Testing helper methods
   */
  describe('Utility Methods', () => {
    it('should detect field validation state correctly', () => {
      // Test field validation helper methods
      const usernameControl = component.userForm.get('username');
      expect(component.isFieldInvalid('username')).toBe(false); // Not touched yet
      
      usernameControl?.markAsTouched();
      expect(component.isFieldInvalid('username')).toBe(true); // Invalid and touched
      
      usernameControl?.setValue('validuser');
      expect(component.isFieldInvalid('username')).toBe(false); // Valid
    });

    it('should detect nested field validation state correctly', () => {
      // Test nested field validation helper
      const firstNameControl = component.userForm.get('personalInfo.firstName');
      expect(component.isNestedFieldInvalid('personalInfo', 'firstName')).toBe(false);
      
      firstNameControl?.markAsTouched();
      expect(component.isNestedFieldInvalid('personalInfo', 'firstName')).toBe(true);
    });

    it('should generate salary range message correctly', () => {
      // Test salary range error message generation
      const salaryControl = component.userForm.get('professionalInfo.salary');
      salaryControl?.setValue(1000000); // Too high
      
      const message = component.getSalaryRangeMessage();
      expect(message).toContain('Salary must be between');
      expect(message).toContain('20000');
      expect(message).toContain('500000');
    });

    it('should reset form correctly', () => {
      // Test form reset functionality
      component.userForm.patchValue({ username: 'testuser' });
      component.activeTab = 2;
      
      component.resetForm();
      
      expect(component.userForm.get('username')?.value).toBe('');
      expect(component.activeTab).toBe(0);
    });

    it('should mark all fields as touched', () => {
      // Test mark all touched functionality
      component.markAllFieldsAsTouched();
      
      expect(component.userForm.touched).toBe(true);
      expect(component.userForm.get('username')?.touched).toBe(true);
      expect(component.userForm.get('personalInfo.firstName')?.touched).toBe(true);
    });
  });

  /**
   * DEBUG FUNCTIONALITY TESTS
   * Testing debug information features
   */
  describe('Debug Functionality', () => {
    it('should generate form status information', () => {
      // Test debug information generation
      const status = component.getFormStatus();
      
      expect(status.valid).toBe(false);
      expect(status.pristine).toBe(true);
      expect(status.touched).toBe(false);
    });

    it('should collect form errors correctly', () => {
      // Test error collection for debugging
      component.userForm.get('username')?.markAsTouched();
      const errors = component.getFormErrors();
      
      expect(errors.username).toBeDefined();
      expect(errors.username.required).toBeTruthy();
    });

    it('should toggle debug information display', () => {
      // Test debug toggle functionality
      expect(component.showDebugInfo).toBe(false);
      
      // Simulate clicking debug toggle
      const debugToggle = fixture.debugElement.query(By.css('.debug-toggle'));
      debugToggle.nativeElement.click();
      fixture.detectChanges();
      
      expect(component.showDebugInfo).toBe(true);
    });
  });

  /**
   * COMPONENT LIFECYCLE TESTS
   */
  describe('Component Lifecycle', () => {
    it('should initialize properly on ngOnInit', () => {
      // Test component initialization
      expect(component.userForm).toBeDefined();
      expect(userFormService.getCountries).toHaveBeenCalled();
      expect(component.countries).toEqual(mockCountries);
    });

    it('should clean up resources on destroy', () => {
      // Test cleanup
      spyOn(component['destroy$'], 'next');
      spyOn(component['destroy$'], 'complete');
      
      component.ngOnDestroy();
      
      expect(component['destroy$'].next).toHaveBeenCalled();
      expect(component['destroy$'].complete).toHaveBeenCalled();
    });
  });

  /**
   * INTEGRATION TESTS
   * Testing component behavior in realistic scenarios
   */
  describe('Integration Tests', () => {
    it('should complete full form workflow', fakeAsync(() => {
      // Test complete user workflow from empty form to submission
      
      // Step 1: Fill basic information
      component.userForm.patchValue({
        username: 'integrationtest',
        email: 'integration@test.com'
      });
      
      // Step 2: Fill personal information
      component.userForm.patchValue({
        personalInfo: {
          firstName: 'Integration',
          lastName: 'Test',
          dateOfBirth: '1990-01-01',
          phone: '5551234567'
        }
      });
      
      // Step 3: Navigate to professional tab
      component.activeTab = 1;
      fixture.detectChanges();
      
      // Step 4: Fill professional information
      component.userForm.patchValue({
        professionalInfo: {
          company: 'Test Company',
          position: 'QA Engineer',
          experience: 3,
          salary: 65000
        }
      });
      
      // Step 5: Add skills
      component.addSkill();
      component.addSkill();
      component.skillsArray.at(0).setValue('Testing');
      component.skillsArray.at(1).setValue('Automation');
      component.skillsArray.at(2).setValue('Quality Assurance');
      
      // Step 6: Navigate to security tab
      component.activeTab = 2;
      fixture.detectChanges();
      
      // Step 7: Fill security and preferences
      component.userForm.patchValue({
        security: {
          password: 'SecurePass123!',
          confirmPassword: 'SecurePass123!'
        },
        preferences: {
          country: 'Canada',
          emailNotifications: true,
          agreeToTerms: true
        }
      });
      
      // Step 8: Submit form
      expect(component.userForm.valid).toBe(true);
      component.onSubmit();
      tick();
      
      // Verify submission
      expect(userFormService.createUser).toHaveBeenCalled();
      expect(notificationService.success).toHaveBeenCalled();
    }));
  });
});
