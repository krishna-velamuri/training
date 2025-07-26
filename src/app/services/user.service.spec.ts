import { TestBed } from '@angular/core/testing';
import { UserService, User } from './user.service';

/**
 * Unit tests for UserService
 * 
 * This test suite demonstrates testing Angular services:
 * 1. Service injection and instantiation
 * 2. Testing CRUD operations with in-memory data
 * 3. Testing observables and async operations
 * 4. Testing error handling
 * 5. Testing data transformation and validation
 * 6. Testing search and filtering functionality
 */

describe('UserService', () => {
  let service: UserService;

  // Sample user data for testing
  const sampleUser: User = {
    id: 999,
    name: 'Test User',
    email: 'test@example.com',
    phone: '555-TEST',
    website: 'test.com',
    company: 'Test Corp',
    address: {
      street: '123 Test St',
      city: 'Test City',
      zipcode: '12345'
    }
  };

  /**
   * Setup for each test
   * This demonstrates how to inject and test Angular services
   */
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserService);
  });

  /**
   * Basic service creation test
   */
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  /**
   * Testing the getUsers method
   * This demonstrates testing observable-based service methods
   */
  it('should return users observable', (done) => {
    service.getUsers().subscribe(users => {
      expect(users).toBeDefined();
      expect(Array.isArray(users)).toBe(true);
      expect(users.length).toBeGreaterThan(0);
      done();
    });
  });

  /**
   * Testing that initial users are loaded
   * This verifies the service has pre-loaded data
   */
  it('should have initial users loaded', (done) => {
    service.getUsers().subscribe(users => {
      expect(users.length).toBeGreaterThanOrEqual(3);
      
      // Verify user structure
      const firstUser = users[0];
      expect(firstUser.id).toBeDefined();
      expect(firstUser.name).toBeDefined();
      expect(firstUser.email).toBeDefined();
      expect(firstUser.company).toBeDefined();
      expect(firstUser.address).toBeDefined();
      expect(firstUser.address.city).toBeDefined();
      
      done();
    });
  });

  /**
   * Testing getUserById method
   * This shows testing services that return specific data based on parameters
   */
  it('should return user by id', (done) => {
    // Test with a known user ID (the service has pre-loaded users)
    service.getUserById(1).subscribe(user => {
      expect(user).toBeDefined();
      expect(user?.id).toBe(1);
      expect(user?.name).toBeDefined();
      expect(user?.email).toBeDefined();
      done();
    });
  });

  /**
   * Testing getUserById with non-existent ID
   * This demonstrates testing error cases and edge conditions
   */
  it('should return undefined for non-existent user ID', (done) => {
    service.getUserById(99999).subscribe(user => {
      expect(user).toBeUndefined();
      done();
    });
  });

  /**
   * Testing addUser method (renamed from createUser)
   * This shows testing create operations and data persistence
   */
  it('should add a new user', (done) => {
    const newUserData: Omit<User, 'id'> = {
      name: 'New Test User',
      email: 'newtest@example.com',
      phone: '555-NEW',
      website: 'newtest.com',
      company: 'New Test Corp',
      address: {
        street: '456 New St',
        city: 'New City',
        zipcode: '67890'
      }
    };

    service.addUser(newUserData).subscribe(createdUser => {
      expect(createdUser).toBeDefined();
      expect(createdUser.id).toBeDefined();
      expect(createdUser.name).toBe(newUserData.name);
      expect(createdUser.email).toBe(newUserData.email);
      expect(createdUser.company).toBe(newUserData.company);
      
      // Verify user was added to the list
      service.getUsers().subscribe(users => {
        const foundUser = users.find(u => u.id === createdUser.id);
        expect(foundUser).toBeDefined();
        expect(foundUser?.name).toBe(newUserData.name);
        done();
      });
    });
  });

  /**
   * Testing updateUser method
   * This demonstrates testing update operations
   */
  it('should update an existing user', (done) => {
    // First create a user
    const newUserData: Omit<User, 'id'> = {
      name: 'Original Name',
      email: 'original@example.com',
      phone: '555-ORIG',
      website: 'original.com',
      company: 'Original Corp',
      address: {
        street: '123 Original St',
        city: 'Original City',
        zipcode: '11111'
      }
    };

    service.addUser(newUserData).subscribe(createdUser => {
      // Now update the user
      const updatedUser: Partial<User> = {
        name: 'Updated Name',
        company: 'Updated Corp'
      };

      service.updateUser(createdUser.id, updatedUser).subscribe(result => {
        expect(result).toBeDefined();
        expect(result?.name).toBe('Updated Name');
        expect(result?.company).toBe('Updated Corp');
        expect(result?.id).toBe(createdUser.id);
        
        // Verify update persisted
        service.getUserById(createdUser.id).subscribe(retrievedUser => {
          expect(retrievedUser?.name).toBe('Updated Name');
          expect(retrievedUser?.company).toBe('Updated Corp');
          done();
        });
      });
    });
  });

  /**
   * Testing deleteUser method
   * This shows testing delete operations
   */
  it('should delete a user', (done) => {
    const newUserData: Omit<User, 'id'> = {
      name: 'To Delete User',
      email: 'delete@example.com',
      phone: '555-DEL',
      website: 'delete.com',
      company: 'Delete Corp',
      address: {
        street: '999 Delete St',
        city: 'Delete City',
        zipcode: '99999'
      }
    };

    // Create a user first
    service.addUser(newUserData).subscribe((createdUser: User) => {
      const userId = createdUser.id;
      
      // Delete the user
      service.deleteUser(userId).subscribe(success => {
        expect(success).toBe(true);
        
        // Verify user was deleted
        service.getUserById(userId).subscribe(deletedUser => {
          expect(deletedUser).toBeUndefined();
          done();
        });
      });
    });
  });

  /**
   * Testing delete operation with non-existent user
   * This demonstrates testing edge cases in delete operations
   */
  it('should return false when deleting non-existent user', (done) => {
    service.deleteUser(99999).subscribe(success => {
      expect(success).toBe(false);
      done();
    });
  });

  /**
   * Testing data validation and constraints
   * This demonstrates testing business logic in services
   */
  it('should maintain data integrity when creating users', (done) => {
    const user: Omit<User, 'id'> = {
      name: 'Data Integrity Test',
      email: 'integrity@example.com',
      phone: '555-DATA',
      website: 'integrity.com',
      company: 'Data Corp',
      address: {
        street: '100 Data St',
        city: 'Data City',
        zipcode: '55555'
      }
    };

    service.addUser(user).subscribe((created: User) => {
      // Each user should have a unique ID
      expect(created.id).toBeDefined();
      expect(typeof created.id).toBe('number');
      
      // All original data should be preserved
      expect(created.name).toBe(user.name);
      expect(created.email).toBe(user.email);
      expect(created.phone).toBe(user.phone);
      expect(created.website).toBe(user.website);
      expect(created.company).toBe(user.company);
      expect(created.address.street).toBe(user.address.street);
      expect(created.address.city).toBe(user.address.city);
      expect(created.address.zipcode).toBe(user.address.zipcode);
      
      done();
    });
  });

  /**
   * Testing service state management
   * This demonstrates testing how services maintain internal state
   */
  it('should maintain consistent state across operations', (done) => {
    // Get initial user count
    service.getUsers().subscribe(initialUsers => {
      const initialCount = initialUsers.length;
      
      const newUser: Omit<User, 'id'> = {
        name: 'State Test User',
        email: 'state@example.com',
        phone: '555-STATE',
        website: 'state.com',
        company: 'State Corp',
        address: {
          street: '200 State St',
          city: 'State City',
          zipcode: '22222'
        }
      };

      // Add a user
      service.addUser(newUser).subscribe((created: User) => {
        
        // Verify count increased
        service.getUsers().subscribe(afterCreate => {
          expect(afterCreate.length).toBe(initialCount + 1);
          
          // Delete the user
          service.deleteUser(created.id).subscribe(deleted => {
            expect(deleted).toBe(true);
            
            // Verify count returned to original
            service.getUsers().subscribe(afterDelete => {
              expect(afterDelete.length).toBe(initialCount);
              done();
            });
          });
        });
      });
    });
  });

  /**
   * Testing async behavior and delays
   * This demonstrates testing services with simulated network delays
   */
  it('should handle async operations with delays', (done) => {
    const startTime = Date.now();
    
    service.getUsers().subscribe(users => {
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      // The service should add a delay (check if it took at least some time)
      expect(duration).toBeGreaterThan(0);
      expect(users).toBeDefined();
      expect(Array.isArray(users)).toBe(true);
      
      done();
    });
  });

  /**
   * Testing multiple operations sequence
   * This demonstrates testing complex service workflows
   */
  it('should handle multiple CRUD operations in sequence', (done) => {
    let createdUserId: number;
    
    const user1: Omit<User, 'id'> = {
      name: 'First Sequential User',
      email: 'first@sequence.com',
      phone: '111-1111',
      website: 'first.com',
      company: 'First Corp',
      address: {
        street: '111 First St',
        city: 'First City',
        zipcode: '11111'
      }
    };

    const user2: Omit<User, 'id'> = {
      name: 'Second Sequential User',
      email: 'second@sequence.com',
      phone: '222-2222',
      website: 'second.com',
      company: 'Second Corp',
      address: {
        street: '222 Second St',
        city: 'Second City',
        zipcode: '22222'
      }
    };

    // Create first user
    service.addUser(user1).subscribe((created1: User) => {
      createdUserId = created1.id;
      
      // Create second user
      service.addUser(user2).subscribe((created2: User) => {
        
        // Update first user
        const updatedUser1: Partial<User> = { name: 'Updated First User' };
        service.updateUser(created1.id, updatedUser1).subscribe(updated => {
          expect(updated?.name).toBe('Updated First User');
          
          // Delete second user
          service.deleteUser(created2.id).subscribe(deleteSuccess => {
            expect(deleteSuccess).toBe(true);
            
            // Verify final state
            service.getUserById(created1.id).subscribe(stillExists => {
              expect(stillExists).toBeDefined();
              expect(stillExists?.name).toBe('Updated First User');
              
              service.getUserById(created2.id).subscribe(shouldBeDeleted => {
                expect(shouldBeDeleted).toBeUndefined();
                done();
              });
            });
          });
        });
      });
    });
  });
});
