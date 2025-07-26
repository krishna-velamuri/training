import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject, of } from 'rxjs';

import { NotificationsComponent } from './notifications.component';
import { NotificationService, Notification } from '../../services/notification.service';

/**
 * Unit tests for NotificationsComponent
 * 
 * This test suite demonstrates advanced Angular testing concepts:
 * 1. Mocking services with complex observables
 * 2. Testing component lifecycle hooks (OnInit, OnDestroy)
 * 3. Testing subscription management and memory leaks prevention
 * 4. Testing DOM updates based on service data
 * 5. Testing user interactions (click events)
 * 6. Testing trackBy functions for performance optimization
 * 7. Testing time formatting and utility functions
 */

describe('NotificationsComponent', () => {
  let component: NotificationsComponent;
  let fixture: ComponentFixture<NotificationsComponent>;
  let mockNotificationService: jasmine.SpyObj<NotificationService>;
  let notificationsSubject: Subject<Notification[]>;

  // Sample notification data for testing
  const sampleNotifications: Notification[] = [
    {
      id: 1,
      message: 'Success message',
      type: 'success',
      timestamp: new Date('2024-01-01T12:00:00Z')
    },
    {
      id: 2,
      message: 'Error message',
      type: 'error',
      timestamp: new Date('2024-01-01T12:01:00Z')
    },
    {
      id: 3,
      message: 'Warning message',
      type: 'warning',
      timestamp: new Date('2024-01-01T12:02:00Z')
    }
  ];

  /**
   * BeforeEach hook for test setup
   * This demonstrates how to mock services with observables
   */
  beforeEach(async () => {
    // Create a Subject to control notification emissions in tests
    notificationsSubject = new Subject<Notification[]>();

    // Create a spy object for NotificationService
    // This allows us to control and verify service method calls
    mockNotificationService = jasmine.createSpyObj('NotificationService', 
      ['removeNotification'], 
      {
        // Use a getter to return our controlled observable
        notifications$: notificationsSubject.asObservable()
      }
    );

    await TestBed.configureTestingModule({
      imports: [NotificationsComponent],
      providers: [
        // Provide our mock service instead of the real one
        { provide: NotificationService, useValue: mockNotificationService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificationsComponent);
    component = fixture.componentInstance;
  });

  /**
   * Basic component creation test
   */
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /**
   * Testing component initialization
   * Verifies that the component properly subscribes to notifications on init
   */
  it('should initialize with empty notifications array', () => {
    expect(component.notifications).toEqual([]);
  });

  /**
   * Testing service subscription in ngOnInit
   * This demonstrates testing observable subscriptions
   */
  it('should subscribe to notifications service on init', () => {
    // Trigger ngOnInit
    component.ngOnInit();
    
    // Emit notifications from our mock service
    notificationsSubject.next(sampleNotifications);
    
    // Verify component received the notifications
    expect(component.notifications).toEqual(sampleNotifications);
  });

  /**
   * Testing DOM rendering based on component data
   * This shows how component data affects template rendering
   */
  it('should render notifications in the template', () => {
    // Set up component with notifications
    component.ngOnInit();
    notificationsSubject.next(sampleNotifications);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const notificationElements = compiled.querySelectorAll('.notification');
    
    // Verify correct number of notifications rendered
    expect(notificationElements.length).toBe(3);
    
    // Verify notification messages are displayed
    const messages = compiled.querySelectorAll('.notification-message');
    expect(messages[0].textContent?.trim()).toBe('Success message');
    expect(messages[1].textContent?.trim()).toBe('Error message');
    expect(messages[2].textContent?.trim()).toBe('Warning message');
  });

  /**
   * Testing CSS class application based on notification type
   * This demonstrates testing conditional CSS classes
   */
  it('should apply correct CSS classes based on notification type', () => {
    component.ngOnInit();
    notificationsSubject.next(sampleNotifications);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const notificationElements = compiled.querySelectorAll('.notification');
    
    // Test success notification class
    expect(notificationElements[0]).toHaveClass('notification-success');
    
    // Test error notification class
    expect(notificationElements[1]).toHaveClass('notification-error');
    
    // Test warning notification class
    expect(notificationElements[2]).toHaveClass('notification-warning');
  });

  /**
   * Testing notification icons based on type
   * Verifies that correct icons are displayed for each notification type
   */
  it('should display correct icons for each notification type', () => {
    const testNotifications: Notification[] = [
      { id: 1, message: 'Success', type: 'success', timestamp: new Date() },
      { id: 2, message: 'Error', type: 'error', timestamp: new Date() },
      { id: 3, message: 'Warning', type: 'warning', timestamp: new Date() },
      { id: 4, message: 'Info', type: 'info', timestamp: new Date() }
    ];

    component.ngOnInit();
    notificationsSubject.next(testNotifications);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const icons = compiled.querySelectorAll('.notification-icon span');
    
    expect(icons[0].textContent).toBe('✅'); // Success icon
    expect(icons[1].textContent).toBe('❌'); // Error icon  
    expect(icons[2].textContent).toBe('⚠️'); // Warning icon
    expect(icons[3].textContent).toBe('ℹ️'); // Info icon
  });

  /**
   * Testing notification removal functionality
   * This demonstrates testing user interactions and service method calls
   */
  it('should remove notification when close button is clicked', () => {
    component.ngOnInit();
    notificationsSubject.next(sampleNotifications);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const closeButton = compiled.querySelector('.notification-close') as HTMLButtonElement;
    
    expect(closeButton).toBeTruthy();
    
    // Click the close button
    closeButton.click();
    
    // Verify that the service remove method was called with correct ID
    expect(mockNotificationService.removeNotification).toHaveBeenCalledWith(1);
  });

  /**
   * Testing the removeNotification method directly
   * This shows testing component methods independently
   */
  it('should call notification service remove method when removeNotification is called', () => {
    const notificationId = 123;
    
    component.removeNotification(notificationId);
    
    expect(mockNotificationService.removeNotification).toHaveBeenCalledWith(notificationId);
  });

  /**
   * Testing trackBy function for performance optimization
   * TrackBy functions help Angular optimize DOM updates in *ngFor loops
   */
  it('should track notifications by ID for performance optimization', () => {
    const notification = sampleNotifications[0];
    const index = 0;
    
    const result = component.trackByNotificationId(index, notification);
    
    expect(result).toBe(notification.id);
  });

  /**
   * Testing time formatting utility function
   * This demonstrates testing utility methods within components
   */
  it('should format notification timestamp correctly', () => {
    const testDate = new Date('2024-01-01T12:30:45Z');
    
    const formattedTime = component.formatTime(testDate);
    
    // Test that the time is formatted as expected
    // Note: This test might need adjustment based on timezone
    expect(formattedTime).toMatch(/\d{1,2}:\d{2}:\d{2}/);
  });

  /**
   * Testing component cleanup (ngOnDestroy)
   * This is crucial for preventing memory leaks from subscriptions
   */
  it('should unsubscribe from notifications on destroy', () => {
    // Spy on the destroy subject to verify it's called
    spyOn(component['destroy$'], 'next');
    spyOn(component['destroy$'], 'complete');
    
    component.ngOnInit();
    component.ngOnDestroy();
    
    // Verify cleanup methods were called
    expect(component['destroy$'].next).toHaveBeenCalled();
    expect(component['destroy$'].complete).toHaveBeenCalled();
  });

  /**
   * Testing multiple notification updates
   * This demonstrates testing how the component handles dynamic data changes
   */
  it('should update notifications when service emits new values', () => {
    component.ngOnInit();
    
    // First emission
    notificationsSubject.next([sampleNotifications[0]]);
    expect(component.notifications.length).toBe(1);
    
    // Second emission with more notifications
    notificationsSubject.next(sampleNotifications);
    expect(component.notifications.length).toBe(3);
    
    // Third emission with no notifications
    notificationsSubject.next([]);
    expect(component.notifications.length).toBe(0);
  });

  /**
   * Testing accessibility features
   * This demonstrates testing for accessibility attributes
   */
  it('should have proper accessibility attributes', () => {
    component.ngOnInit();
    notificationsSubject.next([sampleNotifications[0]]);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const closeButton = compiled.querySelector('.notification-close');
    
    expect(closeButton?.getAttribute('aria-label')).toBe('Close notification');
  });

  /**
   * Testing empty state
   * Verifies component behavior when there are no notifications
   */
  it('should handle empty notifications array', () => {
    component.ngOnInit();
    notificationsSubject.next([]);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const notificationElements = compiled.querySelectorAll('.notification');
    
    expect(notificationElements.length).toBe(0);
  });

  /**
   * Testing error handling
   * This demonstrates testing component behavior when service throws errors
   */
  it('should handle service errors gracefully', () => {
    component.ngOnInit();
    
    // Simulate service error
    notificationsSubject.error(new Error('Service error'));
    
    // Component should still be stable
    expect(component).toBeTruthy();
    expect(component.notifications).toEqual([]);
  });

  /**
   * Integration test - Testing complete notification lifecycle
   * This demonstrates testing the full flow from service to DOM
   */
  it('should handle complete notification lifecycle', () => {
    // Start with empty notifications
    component.ngOnInit();
    notificationsSubject.next([]);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.notification').length).toBe(0);
    
    // Add notifications
    notificationsSubject.next(sampleNotifications);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.notification').length).toBe(3);
    
    // Remove one notification
    const closeButton = fixture.nativeElement.querySelector('.notification-close');
    closeButton.click();
    expect(mockNotificationService.removeNotification).toHaveBeenCalledWith(1);
    
    // Simulate service updating after removal
    notificationsSubject.next(sampleNotifications.slice(1));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.notification').length).toBe(2);
  });
});
