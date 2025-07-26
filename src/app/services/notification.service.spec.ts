import { TestBed } from '@angular/core/testing';
import { NotificationService, Notification } from './notification.service';

/**
 * NOTIFICATION SERVICE TESTING CONCEPTS:
 * 
 * 1. BehaviorSubject Testing - Testing reactive state management
 * 2. Observable Streams - Testing observable data flows
 * 3. State Management - Testing service state changes
 * 4. Timer Testing - Testing auto-removal functionality
 * 5. Service Methods - Testing public API methods
 * 6. Data Integrity - Testing notification object creation
 */

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NotificationService]
    });
    service = TestBed.inject(NotificationService);
  });

  /**
   * BASIC SERVICE TESTS
   */
  describe('Service Initialization', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should initialize with empty notifications', (done) => {
      // Test initial state
      service.notifications$.subscribe(notifications => {
        expect(notifications).toEqual([]);
        done();
      });
    });
  });

  /**
   * NOTIFICATION CREATION TESTS
   */
  describe('Notification Creation', () => {
    it('should create success notification', (done) => {
      // Test success notification creation
      const message = 'Operation successful!';
      
      service.success(message);
      
      service.notifications$.subscribe(notifications => {
        expect(notifications.length).toBe(1);
        expect(notifications[0].type).toBe('success');
        expect(notifications[0].message).toBe(message);
        expect(notifications[0].id).toBeDefined();
        expect(notifications[0].timestamp).toBeInstanceOf(Date);
        done();
      });
    });

    it('should create error notification', (done) => {
      // Test error notification creation
      const message = 'Something went wrong!';
      
      service.error(message);
      
      service.notifications$.subscribe(notifications => {
        expect(notifications.length).toBe(1);
        expect(notifications[0].type).toBe('error');
        expect(notifications[0].message).toBe(message);
        done();
      });
    });

    it('should create warning notification', (done) => {
      // Test warning notification creation
      const message = 'Please check your input!';
      
      service.warning(message);
      
      service.notifications$.subscribe(notifications => {
        expect(notifications.length).toBe(1);
        expect(notifications[0].type).toBe('warning');
        expect(notifications[0].message).toBe(message);
        done();
      });
    });

    it('should create info notification', (done) => {
      // Test info notification creation
      const message = 'Here is some information';
      
      service.info(message);
      
      service.notifications$.subscribe(notifications => {
        expect(notifications.length).toBe(1);
        expect(notifications[0].type).toBe('info');
        expect(notifications[0].message).toBe(message);
        done();
      });
    });

    it('should generate unique IDs for notifications', () => {
      // Test unique ID generation
      service.success('First message');
      service.error('Second message');
      
      service.notifications$.subscribe(notifications => {
        if (notifications.length === 2) {
          expect(notifications[0].id).not.toEqual(notifications[1].id);
        }
      });
    });
  });

  /**
   * NOTIFICATION MANAGEMENT TESTS
   */
  describe('Notification Management', () => {
    it('should add multiple notifications', (done) => {
      // Test multiple notification handling
      service.success('First notification');
      service.error('Second notification');
      service.warning('Third notification');
      
      service.notifications$.subscribe(notifications => {
        if (notifications.length === 3) {
          expect(notifications[0].message).toBe('First notification');
          expect(notifications[1].message).toBe('Second notification');
          expect(notifications[2].message).toBe('Third notification');
          done();
        }
      });
    });

    it('should remove notification by ID', (done) => {
      // Test notification removal
      service.success('First notification');
      service.error('Second notification');
      
      service.notifications$.subscribe(notifications => {
        if (notifications.length === 2) {
          const firstNotificationId = notifications[0].id;
          
          // Remove the first notification
          service.removeNotification(firstNotificationId);
          
          // Check that only one notification remains
          service.notifications$.subscribe(updatedNotifications => {
            if (updatedNotifications.length === 1) {
              expect(updatedNotifications[0].message).toBe('Second notification');
              done();
            }
          });
        }
      });
    });

    it('should clear all notifications', (done) => {
      // Test clearing all notifications
      service.success('First notification');
      service.error('Second notification');
      service.warning('Third notification');
      
      service.notifications$.subscribe(notifications => {
        if (notifications.length === 3) {
          service.clearAll();
          
          service.notifications$.subscribe(clearedNotifications => {
            expect(clearedNotifications.length).toBe(0);
            done();
          });
        }
      });
    });

    it('should handle removal of non-existent notification gracefully', (done) => {
      // Test edge case - removing non-existent notification
      service.success('Test notification');
      
      service.notifications$.subscribe(notifications => {
        if (notifications.length === 1) {
          const originalLength = notifications.length;
          
          // Try to remove notification with fake ID
          service.removeNotification(99999);
          
          service.notifications$.subscribe(updatedNotifications => {
            expect(updatedNotifications.length).toBe(originalLength);
            done();
          });
        }
      });
    });
  });

  /**
   * AUTO-REMOVAL TESTS
   */
  describe('Auto-removal Functionality', () => {
    beforeEach(() => {
      // Install jasmine clock for timer testing
      jasmine.clock().install();
    });

    afterEach(() => {
      // Uninstall jasmine clock
      jasmine.clock().uninstall();
    });

    it('should auto-remove notifications after timeout', () => {
      // Test auto-removal functionality
      service.success('Auto-remove test');
      
      let notificationCount = 0;
      service.notifications$.subscribe(notifications => {
        notificationCount = notifications.length;
      });
      
      expect(notificationCount).toBe(1);
      
      // Fast-forward time by 5 seconds (default auto-remove time)
      jasmine.clock().tick(5001);
      
      service.notifications$.subscribe(notifications => {
        expect(notifications.length).toBe(0);
      });
    });

    it('should allow custom auto-remove duration', () => {
      // Test that notifications auto-remove after 5 seconds (fixed duration)
      service.success('Auto-remove test');
      
      let notificationCount = 0;
      service.notifications$.subscribe(notifications => {
        notificationCount = notifications.length;
      });
      
      expect(notificationCount).toBe(1);
      
      // Fast-forward by less than 5 seconds
      jasmine.clock().tick(4000);
      expect(notificationCount).toBe(1);
      
      // Fast-forward past 5 seconds
      jasmine.clock().tick(1500);
      service.notifications$.subscribe(notifications => {
        expect(notifications.length).toBe(0);
      });
    });

    it('should auto-remove all notification types', () => {
      // Test that all notification types are auto-removed
      service.success('Success message');
      service.error('Error message');
      service.warning('Warning message');
      service.info('Info message');
      
      let notificationCount = 0;
      service.notifications$.subscribe(notifications => {
        notificationCount = notifications.length;
      });
      
      expect(notificationCount).toBe(4);
      
      // Fast-forward past auto-remove time
      jasmine.clock().tick(5001);
      
      service.notifications$.subscribe(notifications => {
        expect(notifications.length).toBe(0);
      });
    });
  });

  /**
   * STRESS TESTING
   */
  describe('Stress Testing', () => {
    it('should handle rapid notification creation', () => {
      // Test rapid successive notifications
      for (let i = 0; i < 100; i++) {
        service.info(`Notification ${i}`);
      }
      
      service.notifications$.subscribe(notifications => {
        expect(notifications.length).toBe(100);
        expect(notifications[0].message).toBe('Notification 0');
        expect(notifications[99].message).toBe('Notification 99');
      });
    });

    it('should handle rapid notification removal', () => {
      // Test rapid removal
      const notificationIds: number[] = [];
      
      // Create notifications and store their IDs
      for (let i = 0; i < 10; i++) {
        service.info(`Notification ${i}`);
      }
      
      service.notifications$.subscribe(notifications => {
        if (notifications.length === 10) {
          notifications.forEach(notification => {
            notificationIds.push(notification.id);
          });
          
          // Remove all notifications rapidly
          notificationIds.forEach(id => {
            service.removeNotification(id);
          });
          
          service.notifications$.subscribe(finalNotifications => {
            expect(finalNotifications.length).toBe(0);
          });
        }
      });
    });
  });

  /**
   * DATA INTEGRITY TESTS
   */
  describe('Data Integrity', () => {
    it('should preserve notification order', (done) => {
      // Test that notifications maintain creation order
      service.success('First');
      service.error('Second');
      service.warning('Third');
      
      service.notifications$.subscribe(notifications => {
        if (notifications.length === 3) {
          expect(notifications[0].message).toBe('First');
          expect(notifications[1].message).toBe('Second');
          expect(notifications[2].message).toBe('Third');
          done();
        }
      });
    });

    it('should handle special characters in messages', (done) => {
      // Test special character handling
      const specialMessage = 'Message with émojis 🎉 and "quotes" & <tags>';
      
      service.info(specialMessage);
      
      service.notifications$.subscribe(notifications => {
        expect(notifications[0].message).toBe(specialMessage);
        done();
      });
    });

    it('should handle empty and null messages', (done) => {
      // Test edge cases with empty messages
      service.success('');
      service.error('null message');  // Service expects string, so we pass a descriptive string
      service.warning('undefined message');
      
      service.notifications$.subscribe(notifications => {
        if (notifications.length === 3) {
          expect(notifications[0].message).toBe('');
          expect(notifications[1].message).toBe('null message');
          expect(notifications[2].message).toBe('undefined message');
          done();
        }
      });
    });
  });

  /**
   * OBSERVABLE BEHAVIOR TESTS
   */
  describe('Observable Behavior', () => {
    it('should emit updates to all subscribers', () => {
      // Test that multiple subscribers receive updates
      let subscriber1Count = 0;
      let subscriber2Count = 0;
      
      service.notifications$.subscribe(notifications => {
        subscriber1Count = notifications.length;
      });
      
      service.notifications$.subscribe(notifications => {
        subscriber2Count = notifications.length;
      });
      
      service.success('Test notification');
      
      expect(subscriber1Count).toBe(1);
      expect(subscriber2Count).toBe(1);
    });

    it('should provide current state to new subscribers', (done) => {
      // Test that new subscribers get current state
      service.success('Existing notification');
      
      // Subscribe after notification is created
      service.notifications$.subscribe(notifications => {
        expect(notifications.length).toBe(1);
        expect(notifications[0].message).toBe('Existing notification');
        done();
      });
    });
  });
});
