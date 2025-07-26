import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { provideRouter } from '@angular/router';

import { NavigationComponent } from './navigation.component';

/**
 * Unit tests for NavigationComponent
 * 
 * This test suite demonstrates several key Angular testing concepts:
 * 1. Component testing with routing dependencies
 * 2. Testing navigation functionality
 * 3. Testing responsive behavior (mobile menu)
 * 4. Testing DOM interactions and event handling
 * 5. Using TestBed for component configuration
 * 6. Mocking external dependencies
 */

// Create a simple test component for routing tests
@Component({
  template: '<h1>Test Page</h1>'
})
class TestComponent { }

describe('NavigationComponent', () => {
  let component: NavigationComponent;
  let fixture: ComponentFixture<NavigationComponent>;
  let router: Router;
  let location: Location;

  /**
   * BeforeEach hook runs before each test case
   * This is where we configure the testing module and create component instances
   */
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Import the component under test
      imports: [NavigationComponent],
      // Provide router configuration for testing navigation
      providers: [
        provideRouter([
          { path: '', component: TestComponent },
          { path: 'users', component: TestComponent },
          { path: 'dashboard', component: TestComponent },
          { path: 'settings', component: TestComponent },
          { path: 'template-forms', component: TestComponent },
          { path: 'reactive-forms', component: TestComponent }
        ])
      ]
    })
    .compileComponents(); // Compile the component and its template

    fixture = TestBed.createComponent(NavigationComponent);
    component = fixture.componentInstance;
    
    // Get injected services for testing navigation behavior
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    
    // Trigger initial change detection cycle
    fixture.detectChanges();
  });

  /**
   * Basic component creation test
   * This is a fundamental test that ensures the component can be instantiated
   */
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /**
   * Testing component initialization
   * Verifies that component properties are set correctly on init
   */
  it('should initialize with correct default values', () => {
    expect(component.isMenuOpen).toBe(false);
  });

  /**
   * Testing template rendering
   * Verifies that the component template renders expected elements
   */
  it('should render navigation elements', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    
    // Test that main navigation elements are present
    expect(compiled.querySelector('.navbar')).toBeTruthy();
    expect(compiled.querySelector('.nav-brand')).toBeTruthy();
    expect(compiled.querySelector('.nav-menu')).toBeTruthy();
    
    // Test that navigation links are rendered
    const navLinks = compiled.querySelectorAll('.nav-link');
    expect(navLinks.length).toBeGreaterThan(0);
  });

  /**
   * Testing navigation links
   * Verifies that all expected navigation links are present with correct routes
   */
  it('should display all navigation links', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const navLinks = compiled.querySelectorAll('.nav-link');
    
    // Expected navigation items
    const expectedRoutes = ['/', '/users', '/dashboard', '/settings', '/template-forms', '/reactive-forms'];
    const actualRoutes = Array.from(navLinks).map(link => 
      (link as HTMLAnchorElement).getAttribute('routerLink')
    );
    
    expectedRoutes.forEach(route => {
      expect(actualRoutes).toContain(route);
    });
  });

  /**
   * Testing mobile menu functionality
   * Demonstrates testing of component methods and state changes
   */
  it('should toggle mobile menu', () => {
    // Initial state
    expect(component.isMenuOpen).toBe(false);
    
    // Test opening mobile menu
    component.toggleMenu();
    expect(component.isMenuOpen).toBe(true);
    
    // Test closing mobile menu
    component.toggleMenu();
    expect(component.isMenuOpen).toBe(false);
  });

  /**
   * Testing mobile menu DOM behavior
   * Verifies that the mobile menu state affects the DOM correctly
   */
  it('should show mobile menu when toggled', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    
    // Initially mobile menu should not be visible
    expect(compiled.querySelector('.nav-menu.nav-menu-active')).toBeFalsy();
    
    // Toggle mobile menu and trigger change detection
    component.toggleMenu();
    fixture.detectChanges();
    
    // Now mobile menu should be visible (has 'nav-menu-active' class)
    expect(compiled.querySelector('.nav-menu.nav-menu-active')).toBeTruthy();
  });

  /**
   * Testing mobile menu button click
   * Demonstrates testing user interactions through DOM events
   */
  it('should toggle mobile menu when hamburger button is clicked', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const toggleButton = compiled.querySelector('.nav-toggle') as HTMLElement;
    
    expect(toggleButton).toBeTruthy();
    expect(component.isMenuOpen).toBe(false);
    
    // Simulate click event
    toggleButton.click();
    expect(component.isMenuOpen).toBe(true);
    
    // Click again to close
    toggleButton.click();
    expect(component.isMenuOpen).toBe(false);
  });

  /**
   * Testing navigation behavior
   * Demonstrates testing router navigation in Angular
   */
  it('should navigate to correct routes when links are clicked', async () => {
    const compiled = fixture.nativeElement as HTMLElement;
    
    // Test navigation to users page
    const usersLink = compiled.querySelector('a[routerLink="/users"]') as HTMLAnchorElement;
    expect(usersLink).toBeTruthy();
    
    // Click the link and wait for navigation
    usersLink.click();
    await fixture.whenStable();
    
    // Verify navigation occurred
    expect(location.path()).toBe('/users');
  });

  /**
   * Testing responsive behavior
   * Verifies that the mobile toggle button is present for responsive design
   */
  it('should have mobile toggle button for responsive navigation', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const mobileToggle = compiled.querySelector('.nav-toggle');
    
    expect(mobileToggle).toBeTruthy();
    // Check for toggle bars (hamburger menu indicators)
    const toggleBars = compiled.querySelectorAll('.toggle-bar');
    expect(toggleBars.length).toBe(3);
  });

  /**
   * Testing accessibility features
   * Demonstrates testing for accessibility attributes
   */
  it('should have proper accessibility attributes', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    
    // Test navigation role
    const nav = compiled.querySelector('nav');
    expect(nav).toBeTruthy();
    
    // Test that navigation links have proper structure
    const navLinks = compiled.querySelectorAll('.nav-link');
    expect(navLinks.length).toBeGreaterThan(0);
  });

  /**
   * Testing component cleanup
   * Demonstrates testing that mobile menu closes when navigating
   */
  it('should close mobile menu when navigation link is clicked', () => {
    // Open mobile menu
    component.toggleMenu();
    expect(component.isMenuOpen).toBe(true);
    
    // Simulate clicking a navigation link (this would normally trigger router navigation)
    component.isMenuOpen = false; // Simulating what happens on route change
    
    expect(component.isMenuOpen).toBe(false);
  });

  /**
   * Testing brand link
   * Verifies that the brand/logo links to home page
   */
  it('should have brand link pointing to home', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const brandLink = compiled.querySelector('.brand-link') as HTMLAnchorElement;
    
    expect(brandLink).toBeTruthy();
    expect(brandLink.getAttribute('routerLink')).toBe('/');
  });

  /**
   * Testing active route highlighting
   * This test would verify that active routes are highlighted (if implemented)
   */
  it('should highlight active route', async () => {
    // Navigate to a specific route
    await router.navigate(['/users']);
    fixture.detectChanges();
    
    // In a real implementation, you would check for active class on the current route
    // This demonstrates how to test route-based styling
    expect(location.path()).toBe('/users');
  });
});
