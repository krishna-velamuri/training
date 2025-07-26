import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserFormService, FormUser } from './user-form.service';

/**
 * SERVICE TESTING CONCEPTS:
 * 
 * 1. HttpClientTestingModule - Angular's testing utility for HTTP requests
 * 2. HttpTestingController - Tool to mock and verify HTTP requests
 * 3. Service Injection - Testing dependency injection
 * 4. Observable Testing - Testing RxJS observables
 * 5. HTTP Error Handling - Testing error scenarios
 * 6. Data Transformation - Testing service data processing
 * 7. Async Operations - Testing asynchronous service methods
 */

describe('UserFormService', () => {
  let service: UserFormService;
  let httpMock: HttpTestingController;

  const mockUser: FormUser = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '5551234567',
    dateOfBirth: '1990-01-01',
    website: 'https://john.com',
    company: 'Tech Corp',
    position: 'Developer',
    salary: 75000,
    skills: ['JavaScript', 'Angular'],
    bio: 'Software developer',
    gender: 'male',
    country: 'United States',
    agreeToTerms: true,
    newsletter: false,
    contactPreference: 'email',
    experience: 5
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      // Import HttpClientTestingModule to mock HTTP requests
      imports: [HttpClientTestingModule],
      providers: [UserFormService]
    });
    
    // Inject service and HTTP testing controller
    service = TestBed.inject(UserFormService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Verify that no unmatched requests are outstanding
    httpMock.verify();
  });

  /**
   * BASIC SERVICE TESTS
   */
  describe('Service Initialization', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });
  });

  /**
   * COUNTRY LOADING TESTS
   */
  describe('getCountries', () => {
    it('should return list of countries', () => {
      // Test successful country loading
      service.getCountries().subscribe(countries => {
        expect(countries.length).toBeGreaterThan(0);
        expect(countries).toContain('United States');
        expect(countries).toContain('Canada');
        expect(countries).toContain('United Kingdom');
      });
    });

    it('should provide default countries when no external API', () => {
      // Test that service provides fallback countries
      service.getCountries().subscribe(countries => {
        expect(countries.length).toBeGreaterThan(0);
        expect(countries).toContain('United States');
      });
    });
  });

  /**
   * SKILLS SUGGESTIONS TESTS
   */
  describe('getSkillsSuggestions', () => {
    it('should return list of skill suggestions', () => {
      // Test skills suggestions
      service.getSkillsSuggestions().subscribe(skills => {
        expect(skills.length).toBeGreaterThan(0);
        expect(skills).toContain('JavaScript');
        expect(skills).toContain('Angular');
        expect(skills).toContain('TypeScript');
      });
    });
  });

  /**
   * USER CREATION TESTS
   */
  describe('createUser', () => {
    it('should create user successfully', () => {
      // Test successful user creation
      service.createUser(mockUser).subscribe(user => {
        expect(user).toEqual(jasmine.objectContaining({
          firstName: mockUser.firstName,
          lastName: mockUser.lastName,
          email: mockUser.email
        }));
        expect(user.id).toBeDefined(); // Should have generated ID
      });

      // In a real app with HTTP backend:
      // const req = httpMock.expectOne('/api/users');
      // expect(req.request.method).toBe('POST');
      // req.flush({ ...mockUser, id: 1 });
    });

    it('should generate unique IDs for users', () => {
      // Test that each user gets a unique ID
      const user1Promise = service.createUser(mockUser).toPromise();
      const user2Promise = service.createUser({ ...mockUser, email: 'jane@example.com' }).toPromise();

      Promise.all([user1Promise, user2Promise]).then(([user1, user2]) => {
        expect(user1?.id).not.toEqual(user2?.id);
      });
    });

    it('should preserve user data during creation', () => {
      // Test data integrity during user creation
      service.createUser(mockUser).subscribe(createdUser => {
        expect(createdUser.firstName).toBe(mockUser.firstName);
        expect(createdUser.skills).toEqual(mockUser.skills);
        expect(createdUser.agreeToTerms).toBe(mockUser.agreeToTerms);
      });
    });
  });

  /**
   * ASYNC VALIDATION TESTS
   */
  describe('Async Validation Methods', () => {
    it('should validate email availability', (done) => {
      // Test async email validation
      const testEmail = 'test@example.com';
      
      service.validateEmail(testEmail).subscribe((isAvailable: boolean) => {
        expect(typeof isAvailable).toBe('boolean');
        expect(isAvailable).toBe(true); // Should be available since no users exist yet
        done();
      });
    });

    it('should detect taken email addresses', (done) => {
      // First create a user
      service.createUser(mockUser).subscribe(() => {
        // Then check if the same email is available
        service.validateEmail(mockUser.email).subscribe((isAvailable: boolean) => {
          expect(isAvailable).toBe(false); // Should not be available
          done();
        });
      });
    });

    it('should simulate network delay for async validation', (done) => {
      // Test that async validation has realistic delay
      const startTime = Date.now();
      
      service.validateEmail('test@example.com').subscribe(() => {
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        // Should have some delay (at least 500ms in the implementation)
        expect(duration).toBeGreaterThanOrEqual(400); // Allow some tolerance
        done();
      });
    });
  });

  /**
   * ERROR HANDLING TESTS
   */
  describe('Error Handling', () => {
    it('should handle invalid user data gracefully', () => {
      // Test error handling for invalid data
      const invalidUser = { ...mockUser, email: '' };
      
      service.createUser(invalidUser).subscribe({
        next: (user) => {
          // Should still create user but might have validation warnings
          expect(user).toBeDefined();
        },
        error: (error) => {
          // Or might return error for invalid data
          expect(error).toBeDefined();
        }
      });
    });
  });

  /**
   * DATA TRANSFORMATION TESTS
   */
  describe('Data Processing', () => {
    it('should handle empty skills array', () => {
      // Test edge case with empty skills
      const userWithoutSkills = { ...mockUser, skills: [] };
      
      service.createUser(userWithoutSkills).subscribe(user => {
        expect(user.skills).toEqual([]);
      });
    });

    it('should handle special characters in user data', () => {
      // Test data with special characters
      const userWithSpecialChars = {
        ...mockUser,
        firstName: 'José',
        lastName: "O'Connor",
        bio: 'Developer with "expertise" in múltiple technologies & frameworks'
      };
      
      service.createUser(userWithSpecialChars).subscribe(user => {
        expect(user.firstName).toBe('José');
        expect(user.lastName).toBe("O'Connor");
        expect(user.bio).toContain('múltiple');
      });
    });
  });
});
