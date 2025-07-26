import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';

import { TemplateFormsComponent } from './template-forms.component';
import { UserFormService, FormUser } from '../../services/user-form.service';
import { NotificationService } from '../../services/notification.service';

/**
 * ANGULAR TESTING CONCEPTS DEMONSTRATED:
 * 
 * 1. TestBed - Angular's testing utility for configuring and creating testing modules
 * 2. ComponentFixture - Wrapper around component instance and its DOM element
 * 3. Mock Services - Creating fake implementations of dependencies for isolated testing
 * 4. Spy Objects - Jasmine spies to monitor method calls and control return values
 * 5. DOM Testing - Testing template rendering and user interactions
 * 6. Form Testing - Testing template-driven forms, validation, and user input
 * 7. Async Testing - Testing asynchronous operations like HTTP calls
 * 8. fakeAsync/tick - Testing time-dependent code in a synchronous manner
 */

describe('TemplateFormsComponent', () => {
  let component: TemplateFormsComponent;
  let fixture: ComponentFixture<TemplateFormsComponent>;
  let userFormService: jasmine.SpyObj<UserFormService>;
  let notificationService: jasmine.SpyObj<NotificationService>;

  // Mock data for testing
  const mockCountries = ['United States', 'Canada', 'United Kingdom', 'Germany'];
  const mockUser: FormUser = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '(555) 123-4567',
    dateOfBirth: '1990-01-01',
    website: 'https://johndoe.com',
    company: 'Tech Corp',
    position: 'Software Engineer',
    salary: 75000,
    skills: ['JavaScript', 'Angular', 'TypeScript'],
    bio: 'Experienced software engineer',
    gender: 'male',
    country: 'United States',
    agreeToTerms: true,
    newsletter: false,
    contactPreference: 'email',
    experience: 5
  };

  /**
   * beforeEach runs before each test case
   * Here we configure the testing module with necessary imports and providers
   */
  beforeEach(async () => {
    // Create spy objects for services - these are mock implementations
    // that allow us to control their behavior and verify method calls
    const userFormServiceSpy = jasmine.createSpyObj('UserFormService', 
      ['getCountries', 'createUser']);
    const notificationServiceSpy = jasmine.createSpyObj('NotificationService', 
      ['success', 'error', 'warning']);

    await TestBed.configureTestingModule({
      // Import the component being tested (standalone component)
      imports: [
        TemplateFormsComponent,
        FormsModule, // Required for template-driven forms
        RouterTestingModule // Provides mock router for RouterLink directives
      ],
      // Provide mock services instead of real ones for isolated testing
      providers: [
        { provide: UserFormService, useValue: userFormServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy }
      ]
    }).compileComponents();

    // Get references to the spy objects for use in tests
    userFormService = TestBed.inject(UserFormService) as jasmine.SpyObj<UserFormService>;
    notificationService = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;

    // Configure default spy behavior
    userFormService.getCountries.and.returnValue(of(mockCountries));
    userFormService.createUser.and.returnValue(of(mockUser));
  });

  /**
   * Before each test, create a fresh component instance
   */
  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Trigger change detection to run ngOnInit
  });

  /**
   * BASIC COMPONENT TESTS
   * Testing component creation and initialization
   */
  describe('Component Initialization', () => {
    it('should create the component', () => {
      // Basic test to ensure component can be instantiated
      expect(component).toBeTruthy();
    });

    it('should initialize with default values', () => {
      // Test that component properties are properly initialized
      expect(component.currentStep).toBe(1);
      expect(component.isSubmitting).toBe(false);
      expect(component.showDebugInfo).toBe(false);
      expect(component.user.firstName).toBe('');
      expect(component.skillsText).toBe('');
    });

    it('should load countries on initialization', () => {
      // Verify that the service method was called during ngOnInit
      expect(userFormService.getCountries).toHaveBeenCalled();
      expect(component.countries).toEqual(mockCountries);
    });

    it('should set correct date constraints', () => {
      // Test date validation logic for minimum age requirement
      const today = new Date();
      const expectedMaxDate = new Date(today.getFullYear() - 16, today.getMonth(), today.getDate())
        .toISOString().split('T')[0];
      
      expect(component.maxDate).toBe(expectedMaxDate);
      expect(component.minDate).toBeDefined();
    });
  });

  /**
   * TEMPLATE RENDERING TESTS
   * Testing that the template renders correctly with the component data
   */
  describe('Template Rendering', () => {
    it('should render the correct title', () => {
      // Test DOM element content
      const titleElement = fixture.debugElement.query(By.css('h1'));
      expect(titleElement.nativeElement.textContent).toContain('Template-Driven Forms');
    });

    it('should render form progress indicator', () => {
      // Test that progress steps are rendered
      const progressSteps = fixture.debugElement.queryAll(By.css('.progress-step'));
      expect(progressSteps.length).toBe(3);
    });

    it('should show only the active step', () => {
      // Test conditional rendering based on currentStep
      const activeSteps = fixture.debugElement.queryAll(By.css('.form-step.active'));
      expect(activeSteps.length).toBe(1);
      
      const activeStepTitle = activeSteps[0].query(By.css('h2'));
      expect(activeStepTitle.nativeElement.textContent).toContain('Personal Information');
    });

    it('should render all form fields for step 1', () => {
      // Test that all expected form inputs are present
      const inputs = fixture.debugElement.queryAll(By.css('input'));
      const selects = fixture.debugElement.queryAll(By.css('select'));
      
      // Should have inputs for: firstName, lastName, email, phone, dateOfBirth, website
      expect(inputs.length).toBeGreaterThanOrEqual(6);
      // Should have select for gender
      expect(selects.length).toBeGreaterThanOrEqual(1);
    });
  });

  /**
   * FORM INTERACTION TESTS
   * Testing user interactions with form elements
   */
  describe('Form Interactions', () => {
    it('should update model when user types in input fields', fakeAsync(() => {
      // Test two-way data binding with ngModel
      const firstNameInput = fixture.debugElement.query(By.css('#firstName'));
      const inputElement = firstNameInput.nativeElement as HTMLInputElement;

      // Simulate user typing
      inputElement.value = 'John';
      inputElement.dispatchEvent(new Event('input'));
      
      // Trigger change detection and wait for async operations
      tick();
      fixture.detectChanges();

      expect(component.user.firstName).toBe('John');
    }));

    it('should show validation errors when field is invalid and touched', fakeAsync(() => {
      // Test validation message display
      const firstNameInput = fixture.debugElement.query(By.css('#firstName'));
      const inputElement = firstNameInput.nativeElement as HTMLInputElement;

      // Make field invalid by leaving it empty and touching it
      inputElement.dispatchEvent(new Event('blur'));
      tick();
      fixture.detectChanges();

      // Check that error message is displayed
      const errorMessages = fixture.debugElement.queryAll(By.css('.error-messages small'));
      const hasRequiredError = errorMessages.some(el => 
        el.nativeElement.textContent.includes('First name is required'));
      expect(hasRequiredError).toBe(true);
    }));

    it('should validate email format', fakeAsync(() => {
      // Test email validation
      const emailInput = fixture.debugElement.query(By.css('#email'));
      const inputElement = emailInput.nativeElement as HTMLInputElement;

      // Enter invalid email
      inputElement.value = 'invalid-email';
      inputElement.dispatchEvent(new Event('input'));
      inputElement.dispatchEvent(new Event('blur'));
      
      tick();
      fixture.detectChanges();

      const errorMessages = fixture.debugElement.queryAll(By.css('.error-messages small'));
      const hasEmailError = errorMessages.some(el => 
        el.nativeElement.textContent.includes('valid email address'));
      expect(hasEmailError).toBe(true);
    }));
  });

  /**
   * STEP NAVIGATION TESTS
   * Testing the multi-step form navigation logic
   */
  describe('Step Navigation', () => {
    it('should not proceed to next step with invalid form', () => {
      // Test form validation prevents navigation
      const initialStep = component.currentStep;
      
      // Try to go to next step with empty form
      const mockForm = { 
        controls: {
          firstName: { valid: false },
          lastName: { valid: false },
          email: { valid: false },
          phone: { valid: false },
          dateOfBirth: { valid: false }
        }
      } as any;

      component.nextStep(mockForm);
      
      expect(component.currentStep).toBe(initialStep);
    });

    it('should proceed to next step with valid form', () => {
      // Test successful navigation with valid form
      const mockForm = { 
        controls: {
          firstName: { valid: true },
          lastName: { valid: true },
          email: { valid: true },
          phone: { valid: true },
          dateOfBirth: { valid: true }
        }
      } as any;

      component.nextStep(mockForm);
      
      expect(component.currentStep).toBe(2);
    });

    it('should go back to previous step', () => {
      // Test backwards navigation
      component.currentStep = 2;
      component.previousStep();
      expect(component.currentStep).toBe(1);
    });

    it('should not go below step 1', () => {
      // Test boundary condition
      component.currentStep = 1;
      component.previousStep();
      expect(component.currentStep).toBe(1);
    });
  });

  /**
   * FORM SUBMISSION TESTS
   * Testing form submission logic and error handling
   */
  describe('Form Submission', () => {
    let mockForm: NgForm;

    beforeEach(() => {
      // Create a mock NgForm object
      mockForm = {
        valid: true,
        controls: {},
        resetForm: jasmine.createSpy('resetForm'),
        markAsTouched: jasmine.createSpy('markAsTouched')
      } as any;
    });

    it('should submit form when valid', fakeAsync(() => {
      // Test successful form submission
      component.skillsText = 'JavaScript, Angular, TypeScript';
      
      component.onSubmit(mockForm);
      tick(); // Wait for async operations
      
      expect(userFormService.createUser).toHaveBeenCalled();
      expect(notificationService.success).toHaveBeenCalledWith('User created successfully!');
    }));

    it('should handle submission errors', fakeAsync(() => {
      // Test error handling during submission
      userFormService.createUser.and.returnValue(throwError(() => new Error('API Error')));
      
      component.onSubmit(mockForm);
      tick();
      
      expect(notificationService.error).toHaveBeenCalledWith('Failed to create user. Please try again.');
      expect(component.isSubmitting).toBe(false);
    }));

    it('should not submit invalid form', () => {
      // Test validation prevents submission
      const invalidMockForm = {
        valid: false,
        controls: {},
        resetForm: jasmine.createSpy('resetForm'),
        markAsTouched: jasmine.createSpy('markAsTouched')
      } as any;
      
      component.onSubmit(invalidMockForm);
      
      expect(userFormService.createUser).not.toHaveBeenCalled();
      expect(notificationService.warning).toHaveBeenCalledWith('Please fill in all required fields correctly.');
    });

    it('should convert skills text to array', fakeAsync(() => {
      // Test data transformation during submission
      component.skillsText = 'JavaScript, Angular, TypeScript';
      
      component.onSubmit(mockForm);
      tick();
      
      expect(component.user.skills).toEqual(['JavaScript', 'Angular', 'TypeScript']);
    }));

    it('should reset form after successful submission', fakeAsync(() => {
      // Test form reset functionality
      component.user.firstName = 'John';
      component.skillsText = 'JavaScript';
      
      component.onSubmit(mockForm);
      tick();
      
      expect(component.user.firstName).toBe('');
      expect(component.skillsText).toBe('');
      expect(component.currentStep).toBe(1);
    }));
  });

  /**
   * UTILITY METHOD TESTS
   * Testing helper methods and edge cases
   */
  describe('Utility Methods', () => {
    it('should determine if can proceed to next step correctly', () => {
      // Test the canProceedToNext logic
      const validForm = { 
        controls: {
          firstName: { valid: true },
          lastName: { valid: true },
          email: { valid: true },
          phone: { valid: true },
          dateOfBirth: { valid: true }
        }
      } as any;

      expect(component.canProceedToNext(validForm)).toBe(true);
    });

    it('should generate form debug info', () => {
      // Test debug information generation
      const mockForm = {
        valid: true,
        touched: false,
        dirty: false,
        submitted: false,
        controls: {}
      } as any;

      const debugInfo = component.getFormDebugInfo(mockForm);
      expect(debugInfo).toContain('valid');
      expect(debugInfo).toContain('true');
    });

    it('should mark all fields as touched', () => {
      // Test form validation helper
      const mockControl = jasmine.createSpyObj('FormControl', ['markAsTouched']);
      const mockForm = {
        controls: {
          firstName: mockControl,
          lastName: mockControl
        }
      } as any;

      component.markAllFieldsAsTouched(mockForm);
      
      expect(mockControl.markAsTouched).toHaveBeenCalledTimes(2);
    });
  });

  /**
   * COMPONENT LIFECYCLE TESTS
   * Testing Angular lifecycle hooks
   */
  describe('Component Lifecycle', () => {
    it('should clean up subscriptions on destroy', () => {
      // Test memory leak prevention
      spyOn(component['destroy$'], 'next');
      spyOn(component['destroy$'], 'complete');
      
      component.ngOnDestroy();
      
      expect(component['destroy$'].next).toHaveBeenCalled();
      expect(component['destroy$'].complete).toHaveBeenCalled();
    });
  });

  /**
   * ACCESSIBILITY TESTS
   * Testing form accessibility features
   */
  describe('Accessibility', () => {
    it('should have proper labels for form inputs', () => {
      // Test that form inputs have associated labels
      const inputs = fixture.debugElement.queryAll(By.css('input[id]'));
      
      inputs.forEach(input => {
        const inputId = input.nativeElement.id;
        const label = fixture.debugElement.query(By.css(`label[for="${inputId}"]`));
        expect(label).toBeTruthy(`Label not found for input with id: ${inputId}`);
      });
    });

    it('should have required field indicators', () => {
      // Test that required fields are properly marked
      const requiredLabels = fixture.debugElement.queryAll(By.css('label'));
      const hasRequiredIndicators = requiredLabels.some(label => 
        label.nativeElement.textContent.includes('*'));
      
      expect(hasRequiredIndicators).toBe(true);
    });
  });
});
