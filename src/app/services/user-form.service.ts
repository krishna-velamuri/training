import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, delay, of } from 'rxjs';

export interface FormUser {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  website: string;
  company: string;
  position: string;
  salary: number;
  skills: string[];
  bio: string;
  gender: string;
  country: string;
  agreeToTerms: boolean;
  newsletter: boolean;
  contactPreference: string;
  experience: number;
  profileImage?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserFormService {
  private formUsers: FormUser[] = [];
  private formUsersSubject = new BehaviorSubject<FormUser[]>([]);

  formUsers$ = this.formUsersSubject.asObservable();

  constructor() { }

  createUser(user: FormUser): Observable<FormUser> {
    const newUser: FormUser = {
      ...user,
      id: Date.now() // Simple ID generation
    };
    
    this.formUsers.push(newUser);
    this.formUsersSubject.next(this.formUsers);
    
    return of(newUser).pipe(delay(1000)); // Simulate API call
  }

  updateUser(id: number, user: Partial<FormUser>): Observable<FormUser | null> {
    const index = this.formUsers.findIndex(u => u.id === id);
    if (index === -1) {
      return of(null);
    }
    
    this.formUsers[index] = { ...this.formUsers[index], ...user };
    this.formUsersSubject.next(this.formUsers);
    
    return of(this.formUsers[index]).pipe(delay(800));
  }

  getUserById(id: number): Observable<FormUser | undefined> {
    return of(this.formUsers.find(u => u.id === id)).pipe(delay(500));
  }

  getAllUsers(): Observable<FormUser[]> {
    return of(this.formUsers).pipe(delay(600));
  }

  // Validation helpers
  validateEmail(email: string): Observable<boolean> {
    // Simulate async email validation
    const existingEmails = this.formUsers.map(u => u.email);
    return of(!existingEmails.includes(email)).pipe(delay(500));
  }

  getCountries(): Observable<string[]> {
    return of([
      'United States',
      'Canada',
      'United Kingdom',
      'Germany',
      'France',
      'Spain',
      'Italy',
      'Japan',
      'Australia',
      'Brazil',
      'India',
      'China'
    ]).pipe(delay(300));
  }

  getSkillsSuggestions(): Observable<string[]> {
    return of([
      'JavaScript',
      'TypeScript',
      'Angular',
      'React',
      'Vue.js',
      'Node.js',
      'Python',
      'Java',
      'C#',
      'PHP',
      'SQL',
      'MongoDB',
      'Docker',
      'AWS',
      'Azure',
      'Git',
      'HTML',
      'CSS',
      'SCSS',
      'GraphQL'
    ]);
  }
}
