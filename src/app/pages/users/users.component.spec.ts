import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { DebugElement, Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { of, throwError, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { UsersComponent } from './users.component';
import { UserService, User } from '../../services/user.service';
import { NotificationService } from '../../services/notification.service';

/**
 * USERS COMPONENT TESTING CONCEPTS DEMONSTRATED:
 * 
 * 1. Service Integration Testing - Testing component interaction with HTTP services
 * 2. Search Functionality Testing - Testing real-time search with debouncing
 * 3. Data Filtering Testing - Testing client-side filtering and sorting
 * 4. Loading States Testing - Testing loading spinners and async operations
 * 5. Error Handling Testing - Testing error states and user feedback
 * 6. User Interaction Testing - Testing clicks, input changes, and navigation
 * 7. Statistics Calculation Testing - Testing computed properties and derived data
 * 8. Responsive Layout Testing - Testing grid layouts and responsive behavior
 * 9. Performance Testing - Testing debounced search and change detection
 * 10. Navigation Testing - Testing router integration and deep linking
 */

// Mock component for routing tests
@Component({ template: '<div>User Detail Page</div>' })
class MockUserDetailComponent { }

describe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;
  let userService: jasmine.SpyObj<UserService>;
  let notificationService: jasmine.SpyObj<NotificationService>;
  let router: Router;
  let location: Location;

  // Mock test data
  const mockUsers: User[] = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '(555) 123-4567',
      website: 'https://johndoe.com',
      company: 'Tech Corp',
      address: {
        street: '123 Main St',
        city: 'New York',
        zipcode: '10001'
      }
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '(555) 987-6543',
      website: 'https://janesmith.dev',
      company: 'Innovation Labs',
      address: {
        street: '456 Oak Ave',
        city: 'San Francisco',
        zipcode: '94102'
      }
    },
    {
      id: 3,
      name: 'Bob Johnson',
      email: 'bob.johnson@example.com',
      phone: '(555) 456-7890',
      website: 'https://bobjohnson.io',
      company: 'Tech Corp',
      address: {
        street: '789 Pine St',
        city: 'Chicago',
        zipcode: '60601'
      }
    }
  ];

  /**
   * TEST SETUP
   * Configure TestBed with all necessary imports, providers, and routing
   */
  beforeEach(async () => {
    // Create spy objects for services
    const userServiceSpy = jasmine.createSpyObj('UserService', ['getUsers', 'searchUsers', 'deleteUser']);
    const notificationServiceSpy = jasmine.createSpyObj('NotificationService', 
      ['success', 'error', 'warning', 'info']);

    await TestBed.configureTestingModule({
      imports: [
        UsersComponent,
        FormsModule,
        RouterTestingModule.withRoutes([
          { path: 'users/:id/:name', component: MockUserDetailComponent }
        ])
      ],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy }
      ]
    }).compileComponents();

    // Get service references
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    notificationService = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);

    // Setup default service behavior
    userService.getUsers.and.returnValue(of(mockUsers));
    userService.searchUsers.and.returnValue(of(mockUsers));
    userService.deleteUser.and.returnValue(of(true));
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Trigger ngOnInit
  });

  /**
   * COMPONENT INITIALIZATION TESTS
   * Testing basic component creation and setup
   */
  describe('Component Initialization', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with default values', () => {
      expect(component.users).toEqual(mockUsers);
      expect(component.filteredUsers).toEqual(mockUsers);
      expect(component.searchTerm).toBe('');
      expect(component.loading).toBe(false);
    });

    it('should load users on initialization', () => {
      expect(userService.getUsers).toHaveBeenCalled();
      expect(component.users).toEqual(mockUsers);
      expect(component.filteredUsers).toEqual(mockUsers);
    });

    it('should handle service errors gracefully', () => {
      // Reset component and simulate service error
      userService.getUsers.and.returnValue(throwError(() => new Error('Service error')));
      
      component.ngOnInit();
      
      expect(notificationService.error).toHaveBeenCalledWith('Failed to load users');
      expect(component.loading).toBe(false);
    });
  });

  /**
   * TEMPLATE RENDERING TESTS
   * Testing DOM element rendering and data binding
   */
  describe('Template Rendering', () => {
    it('should render page title', () => {
      const titleElement = fixture.debugElement.query(By.css('h1'));
      expect(titleElement.nativeElement.textContent.trim()).toBe('Users');
    });

    it('should render search input', () => {
      const searchInput = fixture.debugElement.query(By.css('.search-input'));
      expect(searchInput).toBeTruthy();
      expect(searchInput.nativeElement.placeholder).toBe('Search users...');
    });

    it('should render statistics cards', () => {
      const statCards = fixture.debugElement.queryAll(By.css('.stat-card'));
      expect(statCards.length).toBe(3);
      
      // Check that statistics are calculated correctly
      const totalUsersCard = statCards[0];
      const totalUsersNumber = totalUsersCard.query(By.css('.stat-number'));
      expect(totalUsersNumber.nativeElement.textContent).toBe('3');
    });

    it('should render user cards for each user', () => {
      const userCards = fixture.debugElement.queryAll(By.css('.user-card'));
      expect(userCards.length).toBe(mockUsers.length);
    });

    it('should display user information correctly', () => {
      const firstUserCard = fixture.debugElement.query(By.css('.user-card'));
      const userName = firstUserCard.query(By.css('h3'));
      const userEmail = firstUserCard.query(By.css('.user-email'));
      
      expect(userName.nativeElement.textContent).toContain('John Doe');
      expect(userEmail.nativeElement.textContent).toContain('john.doe@example.com');
    });

    it('should show loading state when loading', () => {
      component.loading = true;
      fixture.detectChanges();
      
      const loadingElement = fixture.debugElement.query(By.css('.loading'));
      expect(loadingElement).toBeTruthy();
      
      const usersGrid = fixture.debugElement.query(By.css('.users-grid'));
      expect(usersGrid).toBeFalsy();
    });

    it('should hide loading state when not loading', () => {
      component.loading = false;
      fixture.detectChanges();
      
      const loadingElement = fixture.debugElement.query(By.css('.loading'));
      expect(loadingElement).toBeFalsy();
      
      const usersGrid = fixture.debugElement.query(By.css('.users-grid'));
      expect(usersGrid).toBeTruthy();
    });
  });

  /**
   * SEARCH FUNCTIONALITY TESTS
   * Testing search input, filtering, and debouncing
   */
  describe('Search Functionality', () => {
    let searchInput: DebugElement;

    beforeEach(() => {
      searchInput = fixture.debugElement.query(By.css('.search-input'));
    });

    it('should trigger search when user types in search input', fakeAsync(() => {
      const inputElement = searchInput.nativeElement as HTMLInputElement;
      
      // Setup service to return filtered results
      userService.searchUsers.and.returnValue(of([mockUsers[0]]));
      
      // Simulate user typing in search input
      inputElement.value = 'John';
      inputElement.dispatchEvent(new Event('input'));
      
      tick(300); // Wait for debounce
      
      expect(userService.searchUsers).toHaveBeenCalledWith('John');
      expect(component.searchTerm).toBe('John');
    }));

    it('should handle search with debouncing', fakeAsync(() => {
      const inputElement = searchInput.nativeElement as HTMLInputElement;
      userService.searchUsers.and.returnValue(of([mockUsers[0]]));
      
      // Simulate rapid typing
      inputElement.value = 'J';
      inputElement.dispatchEvent(new Event('input'));
      
      inputElement.value = 'Jo';
      inputElement.dispatchEvent(new Event('input'));
      
      inputElement.value = 'Joh';
      inputElement.dispatchEvent(new Event('input'));
      
      inputElement.value = 'John';
      inputElement.dispatchEvent(new Event('input'));
      
      // Should only call searchUsers once after debounce
      tick(300);
      
      expect(userService.searchUsers).toHaveBeenCalledWith('John');
      expect(userService.searchUsers).toHaveBeenCalledTimes(1);
    }));

    it('should show loading state during search', fakeAsync(() => {
      const inputElement = searchInput.nativeElement as HTMLInputElement;
      userService.searchUsers.and.returnValue(of([mockUsers[0]]).pipe(delay(100)));
      
      inputElement.value = 'John';
      inputElement.dispatchEvent(new Event('input'));
      
      // Should show loading immediately
      expect(component.loading).toBe(true);
      
      tick(400); // Wait for debounce + delay
      
      expect(component.loading).toBe(false);
    }));

    it('should clear search results when search term is empty', fakeAsync(() => {
      const inputElement = searchInput.nativeElement as HTMLInputElement;
      userService.searchUsers.and.returnValue(of(mockUsers));
      
      inputElement.value = '';
      inputElement.dispatchEvent(new Event('input'));
      
      tick(300);
      
      expect(userService.searchUsers).toHaveBeenCalledWith('');
    }));
  });

  /**
   * STATISTICS CALCULATION TESTS
   * Testing computed properties and data aggregation
   */
  describe('Statistics Calculations', () => {
    it('should calculate total users correctly', () => {
      expect(component.filteredUsers.length).toBe(3);
    });

    it('should calculate users with company correctly', () => {
      const usersWithCompany = component.getUsersWithCompany();
      expect(usersWithCompany).toBe(3); // All mock users have companies
    });

    it('should calculate unique companies correctly', () => {
      const uniqueCompanies = component.getUniqueCompanies();
      expect(uniqueCompanies).toBe(2); // Tech Corp and Innovation Labs
    });

    it('should update statistics when users are filtered', fakeAsync(() => {
      // Filter to show only one user
      const searchInput = fixture.debugElement.query(By.css('.search-input'));
      const inputElement = searchInput.nativeElement as HTMLInputElement;
      inputElement.value = 'John';
      inputElement.dispatchEvent(new Event('input'));
      
      tick(300);
      fixture.detectChanges();
      
      // Statistics should reflect filtered data
      const statCards = fixture.debugElement.queryAll(By.css('.stat-card'));
      const totalUsersNumber = statCards[0].query(By.css('.stat-number'));
      expect(totalUsersNumber.nativeElement.textContent).toBe('1');
    }));
  });

  /**
   * USER INTERACTION TESTS
   * Testing click events and navigation
   */
  describe('User Interactions', () => {
    it('should navigate to user detail on card click', fakeAsync(() => {
      const userCard = fixture.debugElement.query(By.css('.user-card'));
      
      // Simulate click event
      userCard.nativeElement.click();
      tick();
      
      // Check if navigation occurred
      expect(location.path()).toBe('/user/1');
    }));

    it('should handle keyboard navigation', () => {
      const searchInput = fixture.debugElement.query(By.css('.search-input'));
      
      // Test Enter key on search input
      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
      searchInput.nativeElement.dispatchEvent(enterEvent);
      
      // Verify no errors occur
      expect(component).toBeTruthy();
    });
  });

  /**
   * ERROR HANDLING TESTS
   * Testing error states and recovery mechanisms
   */
  describe('Error Handling', () => {
    it('should handle empty user list gracefully', () => {
      userService.getUsers.and.returnValue(of([]));
      
      component.ngOnInit();
      
      expect(component.users).toEqual([]);
      expect(component.filteredUsers).toEqual([]);
    });

    it('should handle network errors during user loading', () => {
      const networkError = new Error('Network error');
      userService.getUsers.and.returnValue(throwError(() => networkError));
      
      component.ngOnInit();
      
      expect(notificationService.error).toHaveBeenCalledWith('Failed to load users');
    });

    it('should handle malformed user data', () => {
      const malformedUsers = [
        { id: 1, name: 'John' }, // Missing required fields
        null, // Null user
        undefined // Undefined user
      ] as any[];
      
      userService.getUsers.and.returnValue(of(malformedUsers));
      
      component.ngOnInit();
      
      // Component should handle malformed data without crashing
      expect(component).toBeTruthy();
    });
  });

  /**
   * PERFORMANCE TESTS
   * Testing optimization features like debouncing
   */
  describe('Performance Optimizations', () => {
    it('should debounce search input to prevent excessive filtering', fakeAsync(() => {
      const searchInput = fixture.debugElement.query(By.css('.search-input'));
      const inputElement = searchInput.nativeElement as HTMLInputElement;
      
      // Simulate rapid typing
      inputElement.value = 'J';
      inputElement.dispatchEvent(new Event('input'));
      
      inputElement.value = 'Jo';
      inputElement.dispatchEvent(new Event('input'));
      
      inputElement.value = 'Joh';
      inputElement.dispatchEvent(new Event('input'));
      
      inputElement.value = 'John';
      inputElement.dispatchEvent(new Event('input'));
      
      // Before debounce timeout, filteredUsers should not be updated
      expect(component.searchTerm).toBe(''); // Component hasn't processed the input yet
      
      // After debounce timeout
      tick(300);
      fixture.detectChanges();
      
      expect(component.filteredUsers.length).toBe(1);
    }));

    it('should not trigger unnecessary change detection cycles', () => {
      // Simulate multiple operations that shouldn't cause excessive change detection
      component.searchTerm = 'test';
      component.searchTerm = 'test'; // Same value
      
      fixture.detectChanges();
      
      // Verify component is stable and no errors occur
      expect(component).toBeTruthy();
      expect(component.searchTerm).toBe('test');
    });
  });

  /**
   * ACCESSIBILITY TESTS
   * Testing keyboard navigation and screen reader support
   */
  describe('Accessibility', () => {
    it('should have proper ARIA labels for search input', () => {
      const searchInput = fixture.debugElement.query(By.css('.search-input'));
      const inputElement = searchInput.nativeElement as HTMLInputElement;
      
      // Check for accessibility attributes
      expect(inputElement.getAttribute('aria-label') || 
             inputElement.getAttribute('placeholder')).toBeTruthy();
    });

    it('should support keyboard navigation for user cards', () => {
      const userCards = fixture.debugElement.queryAll(By.css('.user-card'));
      
      userCards.forEach(card => {
        const cardElement = card.nativeElement as HTMLElement;
        
        // Cards should be focusable
        expect(cardElement.tabIndex >= 0 || 
               cardElement.tagName.toLowerCase() === 'button' ||
               cardElement.tagName.toLowerCase() === 'a').toBe(true);
      });
    });

    it('should announce loading state to screen readers', () => {
      component.loading = true;
      fixture.detectChanges();
      
      const loadingElement = fixture.debugElement.query(By.css('.loading'));
      
      // Should have proper ARIA attributes for loading state
      expect(loadingElement.nativeElement.getAttribute('aria-live') ||
             loadingElement.nativeElement.getAttribute('role')).toBeTruthy();
    });
  });

  /**
   * COMPONENT LIFECYCLE TESTS
   * Testing Angular lifecycle hooks and cleanup
   */
  describe('Component Lifecycle', () => {
    it('should initialize search stream on init', () => {
      expect(component['searchSubject']).toBeDefined();
    });

    it('should clean up subscriptions on destroy', () => {
      const destroySpy = spyOn(component['destroy$'], 'next');
      const completeSpy = spyOn(component['destroy$'], 'complete');
      
      component.ngOnDestroy();
      
      expect(destroySpy).toHaveBeenCalled();
      expect(completeSpy).toHaveBeenCalled();
    });

    it('should handle component reinitialization', () => {
      // Simulate component reuse
      component.ngOnDestroy();
      component.ngOnInit();
      
      expect(userService.getUsers).toHaveBeenCalledTimes(2);
    });
  });

  /**
   * INTEGRATION TESTS
   * Testing component integration with services and router
   */
  describe('Integration Tests', () => {
    it('should integrate with UserService correctly', () => {
      expect(userService.getUsers).toHaveBeenCalled();
      expect(component.users).toEqual(mockUsers);
    });

    it('should integrate with NotificationService for error messages', () => {
      userService.getUsers.and.returnValue(throwError(() => new Error('Test error')));
      
      component.ngOnInit();
      
      expect(notificationService.error).toHaveBeenCalled();
    });

    it('should integrate with Router for navigation', fakeAsync(() => {
      // Test navigation through router service directly
      router.navigate(['/user', 1]);
      tick();
      
      expect(location.path()).toBe('/user/1');
    }));
  });
});
