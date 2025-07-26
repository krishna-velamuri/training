import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, delay, map, of } from 'rxjs';

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  website: string;
  company: string;
  address: {
    street: string;
    city: string;
    zipcode: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private users: User[] = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      phone: '555-0123',
      website: 'john-doe.com',
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
      email: 'jane@example.com',
      phone: '555-0124',
      website: 'jane-smith.com',
      company: 'Design Studio',
      address: {
        street: '456 Oak Ave',
        city: 'Los Angeles',
        zipcode: '90210'
      }
    },
    {
      id: 3,
      name: 'Bob Johnson',
      email: 'bob@example.com',
      phone: '555-0125',
      website: 'bob-johnson.com',
      company: 'Marketing Inc',
      address: {
        street: '789 Pine Rd',
        city: 'Chicago',
        zipcode: '60601'
      }
    },
    {
      id: 4,
      name: 'Alice Brown',
      email: 'alice@example.com',
      phone: '555-0126',
      website: 'alice-brown.com',
      company: 'Consulting LLC',
      address: {
        street: '321 Elm St',
        city: 'Boston',
        zipcode: '02101'
      }
    },
    {
      id: 5,
      name: 'Charlie Wilson',
      email: 'charlie@example.com',
      phone: '555-0127',
      website: 'charlie-wilson.com',
      company: 'Finance Group',
      address: {
        street: '654 Maple Dr',
        city: 'Seattle',
        zipcode: '98101'
      }
    }
  ];

  private usersSubject = new BehaviorSubject<User[]>(this.users);
  users$ = this.usersSubject.asObservable();

  constructor() { }

  getUsers(): Observable<User[]> {
    return of(this.users).pipe(delay(500)); // Simulate API call
  }

  getUserById(id: number): Observable<User | undefined> {
    return of(this.users.find(user => user.id === id)).pipe(delay(300));
  }

  searchUsers(term: string): Observable<User[]> {
    if (!term.trim()) {
      return of(this.users);
    }
    
    return of(this.users.filter(user => 
      user.name.toLowerCase().includes(term.toLowerCase()) ||
      user.email.toLowerCase().includes(term.toLowerCase()) ||
      user.company.toLowerCase().includes(term.toLowerCase())
    )).pipe(delay(400));
  }

  addUser(user: Omit<User, 'id'>): Observable<User> {
    const newUser: User = {
      ...user,
      id: Math.max(...this.users.map(u => u.id)) + 1
    };
    
    this.users.push(newUser);
    this.usersSubject.next(this.users);
    
    return of(newUser).pipe(delay(500));
  }

  updateUser(id: number, updates: Partial<User>): Observable<User | null> {
    const index = this.users.findIndex(user => user.id === id);
    if (index === -1) {
      return of(null);
    }
    
    this.users[index] = { ...this.users[index], ...updates };
    this.usersSubject.next(this.users);
    
    return of(this.users[index]).pipe(delay(500));
  }

  deleteUser(id: number): Observable<boolean> {
    const index = this.users.findIndex(user => user.id === id);
    if (index === -1) {
      return of(false);
    }
    
    this.users.splice(index, 1);
    this.usersSubject.next(this.users);
    
    return of(true).pipe(delay(500));
  }
}
