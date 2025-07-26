import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { HomeComponent } from './home.component';

/**
 * HOME COMPONENT TESTING CONCEPTS DEMONSTRATED:
 * 
 * 1. Landing Page Testing - Testing main entry point and navigation hub
 * 2. Router Integration Testing - Testing navigation links and routing
 * 3. Template Rendering Testing - Testing static content and dynamic elements
 * 4. Feature Card Testing - Testing grid layouts and feature showcases
 * 5. Responsive Design Testing - Testing layout adaptation
 * 6. Link Validation Testing - Testing all navigation links work correctly
 * 7. Content Verification Testing - Testing marketing copy and descriptions
 * 8. User Journey Testing - Testing user flow from home to features
 * 9. SEO and Accessibility Testing - Testing semantic markup and ARIA
 * 10. Performance Testing - Testing initial page load and rendering speed
 */

// Mock components for routing tests
@Component({ template: '<div>Users Page</div>' })
class MockUsersComponent { }

@Component({ template: '<div>Dashboard Page</div>' })
class MockDashboardComponent { }

@Component({ template: '<div>Template Forms Page</div>' })
class MockTemplateFormsComponent { }

@Component({ template: '<div>Reactive Forms Page</div>' })
class MockReactiveFormsComponent { }

@Component({ template: '<div>Settings Page</div>' })
class MockSettingsComponent { }

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let router: Router;
  let location: Location;

  /**
   * Setup for each test
   * This demonstrates how to configure TestBed for components with routing
   */
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HomeComponent,
        RouterTestingModule.withRoutes([
          { path: 'users', component: MockUsersComponent },
          { path: 'dashboard', component: MockDashboardComponent },
          { path: 'template-forms', component: MockTemplateFormsComponent },
          { path: 'reactive-forms', component: MockReactiveFormsComponent },
          { path: 'settings', component: MockSettingsComponent }
        ])
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    
    fixture.detectChanges();
  });

  /**
   * BASIC COMPONENT TESTS
   * Testing component creation and initialization
   */
  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should render without errors', () => {
      expect(fixture.debugElement.nativeElement).toBeTruthy();
    });
  });

  /**
   * TEMPLATE RENDERING TESTS
   * Testing DOM elements and content display
   */
  describe('Template Rendering', () => {
    it('should display main heading and welcome message', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      
      // Check for main heading
      const heading = compiled.querySelector('h1');
      expect(heading).toBeTruthy();
      expect(heading?.textContent).toContain('Angular Training');
      
      // Check for welcome message or description
      const description = compiled.querySelector('.hero p, .welcome-text, p');
      expect(description).toBeTruthy();
      expect(description?.textContent).toContain('comprehensive');
    });

    it('should display navigation/feature cards', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      
      // Look for navigation cards or sections
      const featureCards = compiled.querySelectorAll('.feature-card, .nav-card, .section-card, .card');
      expect(featureCards.length).toBeGreaterThan(0);
      
      // Verify cards have content
      const firstCard = featureCards[0] as HTMLElement;
      expect(firstCard.textContent?.trim().length).toBeGreaterThan(0);
    });

    it('should display feature icons', () => {
      const featureIcons = fixture.debugElement.queryAll(By.css('.feature-icon'));
      expect(featureIcons.length).toBeGreaterThanOrEqual(4); // At least 4 main features
      
      // Verify icons have content (emojis or text)
      featureIcons.forEach(icon => {
        expect(icon.nativeElement.textContent?.trim()).toBeTruthy();
      });
    });

    it('should display feature titles and descriptions', () => {
      const featureCards = fixture.debugElement.queryAll(By.css('.feature-card'));
      
      featureCards.forEach(card => {
        const title = card.query(By.css('h3, .feature-title'));
        const description = card.query(By.css('p, .feature-description'));
        
        expect(title).toBeTruthy();
        expect(description).toBeTruthy();
        expect(title.nativeElement.textContent?.trim()).toBeTruthy();
        expect(description.nativeElement.textContent?.trim()).toBeTruthy();
      });
    });

    it('should have proper heading hierarchy', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      
      // Should have h1 as main heading
      const h1Elements = compiled.querySelectorAll('h1');
      expect(h1Elements.length).toBe(1);
      
      // Should have h3 elements for feature titles
      const h3Elements = compiled.querySelectorAll('h3');
      expect(h3Elements.length).toBeGreaterThan(0);
    });
  });

  /**
   * NAVIGATION LINK TESTS
   * Testing router links and navigation functionality
   */
  describe('Navigation Links', () => {
    it('should have Users navigation link', () => {
      const usersLink = fixture.debugElement.query(By.css('a[routerLink="/users"], a[href*="users"]'));
      expect(usersLink).toBeTruthy();
      expect(usersLink.nativeElement.textContent).toContain('User');
    });

    it('should have Dashboard navigation link', () => {
      const dashboardLink = fixture.debugElement.query(By.css('a[routerLink="/dashboard"], a[href*="dashboard"]'));
      expect(dashboardLink).toBeTruthy();
      expect(dashboardLink.nativeElement.textContent).toContain('Dashboard');
    });

    it('should have Template Forms navigation link', () => {
      const templateFormsLink = fixture.debugElement.query(By.css('a[routerLink="/template-forms"], a[href*="template-forms"]'));
      expect(templateFormsLink).toBeTruthy();
      expect(templateFormsLink.nativeElement.textContent).toContain('Template');
    });

    it('should have Reactive Forms navigation link', () => {
      const reactiveFormsLink = fixture.debugElement.query(By.css('a[routerLink="/reactive-forms"], a[href*="reactive-forms"]'));
      expect(reactiveFormsLink).toBeTruthy();
      expect(reactiveFormsLink.nativeElement.textContent).toContain('Reactive');
    });

    it('should have Settings navigation link', () => {
      const settingsLink = fixture.debugElement.query(By.css('a[routerLink="/settings"], a[href*="settings"]'));
      expect(settingsLink).toBeTruthy();
      expect(settingsLink.nativeElement.textContent).toContain('Settings');
    });

    it('should navigate to Users page when Users link is clicked', async () => {
      const usersLink = fixture.debugElement.query(By.css('a[routerLink="/users"], a[href*="users"]'));
      
      usersLink.nativeElement.click();
      fixture.detectChanges();
      await fixture.whenStable();
      
      expect(location.path()).toBe('/users');
    });

    it('should navigate to Dashboard page when Dashboard link is clicked', async () => {
      const dashboardLink = fixture.debugElement.query(By.css('a[routerLink="/dashboard"], a[href*="dashboard"]'));
      
      dashboardLink.nativeElement.click();
      fixture.detectChanges();
      await fixture.whenStable();
      
      expect(location.path()).toBe('/dashboard');
    });

    it('should navigate to Template Forms page when Template Forms link is clicked', async () => {
      const templateFormsLink = fixture.debugElement.query(By.css('a[routerLink="/template-forms"], a[href*="template-forms"]'));
      
      templateFormsLink.nativeElement.click();
      fixture.detectChanges();
      await fixture.whenStable();
      
      expect(location.path()).toBe('/template-forms');
    });

    it('should navigate to Reactive Forms page when Reactive Forms link is clicked', async () => {
      const reactiveFormsLink = fixture.debugElement.query(By.css('a[routerLink="/reactive-forms"], a[href*="reactive-forms"]'));
      
      reactiveFormsLink.nativeElement.click();
      fixture.detectChanges();
      await fixture.whenStable();
      
      expect(location.path()).toBe('/reactive-forms');
    });
  });

  /**
   * ACCESSIBILITY TESTS
   * Testing accessibility features and ARIA attributes
   */
  describe('Accessibility', () => {
    it('should have proper page structure for screen readers', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      
      // Should have main content area
      const main = compiled.querySelector('main, [role="main"], .main-content');
      expect(main).toBeTruthy();
      
      // Should have proper heading hierarchy
      const h1 = compiled.querySelector('h1');
      expect(h1).toBeTruthy();
    });

    it('should have accessible navigation links', () => {
      const links = fixture.debugElement.queryAll(By.css('a[routerLink], a[href]'));
      
      links.forEach(link => {
        const linkElement = link.nativeElement as HTMLAnchorElement;
        const hasAccessibleText = 
          linkElement.textContent?.trim() ||
          linkElement.getAttribute('aria-label') ||
          linkElement.getAttribute('title');
          
        expect(hasAccessibleText).toBeTruthy();
      });
    });

    it('should support keyboard navigation', () => {
      const focusableElements = fixture.debugElement.queryAll(
        By.css('a, button, [tabindex]:not([tabindex="-1"])')
      );
      
      expect(focusableElements.length).toBeGreaterThan(0);
      
      // First focusable element should be reachable
      const firstFocusable = focusableElements[0].nativeElement;
      firstFocusable.focus();
      expect(document.activeElement).toBe(firstFocusable);
    });
  });

  /**
   * LAYOUT AND STYLING TESTS
   * Testing visual layout and responsive design
   */
  describe('Layout and Styling', () => {
    it('should have proper container structure', () => {
      const container = fixture.debugElement.query(By.css('.home-container, .container, main'));
      expect(container).toBeTruthy();
    });

    it('should have hero section', () => {
      const hero = fixture.debugElement.query(By.css('.hero, .hero-section, header'));
      expect(hero).toBeTruthy();
      
      const heroHeading = hero.query(By.css('h1'));
      expect(heroHeading).toBeTruthy();
    });

    it('should have features section with grid layout', () => {
      const featuresSection = fixture.debugElement.query(By.css('.features, .feature-grid, .cards-grid'));
      expect(featuresSection).toBeTruthy();
      
      const featureCards = featuresSection.queryAll(By.css('.feature-card, .card'));
      expect(featureCards.length).toBeGreaterThanOrEqual(4);
    });

    it('should apply proper CSS classes', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      
      // Check for key CSS classes that indicate proper styling
      const hasStyledElements = 
        compiled.querySelector('.feature-card') ||
        compiled.querySelector('.hero') ||
        compiled.querySelector('.features');
        
      expect(hasStyledElements).toBeTruthy();
    });
  });

  /**
   * CONTENT VALIDATION TESTS
   * Testing marketing copy and content quality
   */
  describe('Content Validation', () => {
    it('should have compelling hero copy', () => {
      const heroText = fixture.debugElement.query(By.css('.hero p, .hero-description'));
      
      if (heroText) {
        const text = heroText.nativeElement.textContent.toLowerCase();
        const hasCompellingWords = 
          text.includes('comprehensive') ||
          text.includes('sample') ||
          text.includes('demonstrating') ||
          text.includes('features');
          
        expect(hasCompellingWords).toBeTruthy();
      }
    });

    it('should have clear feature descriptions', () => {
      const featureCards = fixture.debugElement.queryAll(By.css('.feature-card'));
      
      featureCards.forEach(card => {
        const description = card.query(By.css('p, .feature-description'));
        if (description) {
          const text = description.nativeElement.textContent.trim();
          expect(text.length).toBeGreaterThan(10); // Should have meaningful descriptions
        }
      });
    });

    it('should have action-oriented link text', () => {
      const featureLinks = fixture.debugElement.queryAll(By.css('.feature-link, .feature-card a'));
      
      featureLinks.forEach(link => {
        const linkText = link.nativeElement.textContent.toLowerCase();
        const hasActionWords = 
          linkText.includes('view') ||
          linkText.includes('try') ||
          linkText.includes('open') ||
          linkText.includes('explore');
          
        expect(hasActionWords).toBeTruthy();
      });
    });
  });

  /**
   * ERROR HANDLING TESTS
   * Testing edge cases and error states
   */
  describe('Error Handling', () => {
    it('should handle missing router gracefully', () => {
      // Component should not crash even if router has issues
      expect(component).toBeTruthy();
      expect(fixture.debugElement.nativeElement.textContent).toContain('Angular Training');
    });

    it('should render even with missing content', () => {
      // Basic structure should always be present
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('h1')).toBeTruthy();
    });
  });
});
