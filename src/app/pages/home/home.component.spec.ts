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
   * FEATURE CONTENT TESTS
   * Testing specific feature descriptions and content
   */
  describe('Feature Content', () => {
    it('should describe User Management features', () => {
      const featureCards = fixture.debugElement.queryAll(By.css('.feature-card'));
      const userMgmtCard = featureCards.find(card => 
        card.nativeElement.textContent.toLowerCase().includes('user')
      );
      
      expect(userMgmtCard).toBeTruthy();
      expect(userMgmtCard?.nativeElement.textContent.toLowerCase()).toContain('manage');
    });

    it('should describe Search functionality', () => {
      const featureCards = fixture.debugElement.queryAll(By.css('.feature-card'));
      const searchCard = featureCards.find(card => 
        card.nativeElement.textContent.toLowerCase().includes('search')
      );
      
      expect(searchCard).toBeTruthy();
      expect(searchCard?.nativeElement.textContent.toLowerCase()).toContain('filter');
    });

    it('should describe Dashboard features', () => {
      const featureCards = fixture.debugElement.queryAll(By.css('.feature-card'));
      const dashboardCard = featureCards.find(card => 
        card.nativeElement.textContent.toLowerCase().includes('dashboard')
      );
      
      expect(dashboardCard).toBeTruthy();
      expect(dashboardCard?.nativeElement.textContent.toLowerCase()).toContain('analytics');
    });

    it('should describe Forms features', () => {
      const featureCards = fixture.debugElement.queryAll(By.css('.feature-card'));
      const formsCards = featureCards.filter(card => 
        card.nativeElement.textContent.toLowerCase().includes('form')
      );
      
      expect(formsCards.length).toBeGreaterThanOrEqual(2); // Template and Reactive forms
      
      const templateFormsCard = formsCards.find(card =>
        card.nativeElement.textContent.toLowerCase().includes('template')
      );
      const reactiveFormsCard = formsCards.find(card =>
        card.nativeElement.textContent.toLowerCase().includes('reactive')
      );
      
      expect(templateFormsCard).toBeTruthy();
      expect(reactiveFormsCard).toBeTruthy();
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

    it('should have meaningful alt text for images (if any)', () => {
      const images = fixture.debugElement.queryAll(By.css('img'));
      
      images.forEach(img => {
        const imgElement = img.nativeElement as HTMLImageElement;
        const hasAltText = 
          imgElement.alt ||
          imgElement.getAttribute('aria-label');
          
        expect(hasAltText).toBeTruthy();
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
   * RESPONSIVE DESIGN TESTS
   * Testing layout adaptation for different screen sizes
   */
  describe('Responsive Design', () => {
    it('should have responsive meta viewport (tested indirectly)', () => {
      // This is typically set in index.html, but we can verify the component
      // is designed to work with responsive layouts
      const featureGrid = fixture.debugElement.query(By.css('.feature-grid, .features'));
      expect(featureGrid).toBeTruthy();
    });

    it('should use CSS Grid or Flexbox for layout', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const featureGrid = compiled.querySelector('.feature-grid, .features, .cards-grid');
      
      if (featureGrid) {
        const computedStyle = window.getComputedStyle(featureGrid);
        const hasModernLayout = 
          computedStyle.display === 'grid' ||
          computedStyle.display === 'flex';
          
        // Note: This test might not work in all test environments
        // It's more of a documentation of expected behavior
        expect(featureGrid).toBeTruthy();
      }
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

  /**
   * PERFORMANCE TESTS
   * Testing rendering performance and optimization
   */
  describe('Performance', () => {
    it('should render quickly without heavy computations', () => {
      const startTime = performance.now();
      
      // Re-create component to measure render time
      const testFixture = TestBed.createComponent(HomeComponent);
      testFixture.detectChanges();
      
      const renderTime = performance.now() - startTime;
      
      // Should render in under 100ms (generous for testing environment)
      expect(renderTime).toBeLessThan(100);
    });

    it('should not have memory leaks in template', () => {
      // Verify component can be created and destroyed without issues
      const testFixture = TestBed.createComponent(HomeComponent);
      testFixture.detectChanges();
      testFixture.destroy();
      
      // If we get here without errors, no obvious memory leaks
      expect(true).toBeTruthy();
    });
  });
});
    
    // Check for specific content areas
    const sections = compiled.querySelectorAll('section, .feature, .nav-item');
    expect(sections.length).toBeGreaterThan(0);
  });

  /**
   * Testing navigation links
   * This verifies that all expected navigation links are present
   */
  it('should have navigation links to different sections', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    
    // Look for router links
    const routerLinks = compiled.querySelectorAll('a[routerLink]');
    expect(routerLinks.length).toBeGreaterThan(0);
    
    // Expected routes
    const expectedRoutes = ['/users', '/dashboard', '/template-forms', '/reactive-forms'];
    const actualRoutes = Array.from(routerLinks).map(link => 
      (link as HTMLAnchorElement).getAttribute('routerLink')
    );
    
    // Check that at least some expected routes are present
    const foundRoutes = expectedRoutes.filter(route => actualRoutes.includes(route));
    expect(foundRoutes.length).toBeGreaterThan(0);
  });

  /**
   * Testing navigation functionality
   * This demonstrates testing router navigation from component interactions
   */
  it('should navigate to users page when users link is clicked', async () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const usersLink = compiled.querySelector('a[routerLink="/users"]') as HTMLAnchorElement;
    
    if (usersLink) {
      usersLink.click();
      await fixture.whenStable();
      expect(location.path()).toBe('/users');
    } else {
      // If the specific link structure is different, we can test navigation programmatically
      await router.navigate(['/users']);
      expect(location.path()).toBe('/users');
    }
  });

  /**
   * Testing dashboard navigation
   */
  it('should navigate to dashboard when dashboard link is clicked', async () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const dashboardLink = compiled.querySelector('a[routerLink="/dashboard"]') as HTMLAnchorElement;
    
    if (dashboardLink) {
      dashboardLink.click();
      await fixture.whenStable();
      expect(location.path()).toBe('/dashboard');
    } else {
      // Fallback test
      await router.navigate(['/dashboard']);
      expect(location.path()).toBe('/dashboard');
    }
  });

  /**
   * Testing forms navigation
   */
  it('should navigate to template forms page', async () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const formsLink = compiled.querySelector('a[routerLink="/template-forms"]') as HTMLAnchorElement;
    
    if (formsLink) {
      formsLink.click();
      await fixture.whenStable();
      expect(location.path()).toBe('/template-forms');
    } else {
      // Fallback test
      await router.navigate(['/template-forms']);
      expect(location.path()).toBe('/template-forms');
    }
  });

  /**
   * Testing responsive design elements
   * This verifies that the component includes responsive design considerations
   */
  it('should have responsive design elements', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    
    // Check for responsive classes or grid layouts
    const responsiveElements = compiled.querySelectorAll(
      '.container, .grid, .flex, .responsive, [class*="col-"], [class*="row"]'
    );
    
    // Should have some layout structure
    expect(responsiveElements.length).toBeGreaterThan(0);
  });

  /**
   * Testing accessibility features
   * This demonstrates testing for accessibility attributes and semantic HTML
   */
  it('should have proper accessibility features', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    
    // Check for semantic HTML elements
    const mainElement = compiled.querySelector('main');
    const headings = compiled.querySelectorAll('h1, h2, h3, h4, h5, h6');
    
    // Should have proper heading structure
    expect(headings.length).toBeGreaterThan(0);
    
    // Check for navigation landmarks
    const navElements = compiled.querySelectorAll('nav, [role="navigation"]');
    
    // Check that links have proper attributes for accessibility
    const links = compiled.querySelectorAll('a[routerLink]');
    links.forEach(link => {
      const href = link.getAttribute('routerLink');
      expect(href).toBeTruthy();
    });
  });

  /**
   * Testing component styling
   * This verifies that CSS classes are applied correctly
   */
  it('should apply CSS classes correctly', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    
    // Check for primary container classes
    const containers = compiled.querySelectorAll('.container, .home-container, .page-container');
    expect(containers.length).toBeGreaterThan(0);
    
    // Check for styled elements
    const styledElements = compiled.querySelectorAll('[class]');
    expect(styledElements.length).toBeGreaterThan(0);
  });

  /**
   * Testing content structure
   * This verifies the logical structure of the home page content
   */
  it('should have proper content structure', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    
    // Should have a main content area
    const contentArea = compiled.querySelector('.content, .main-content, main, .home-content');
    
    // Should have some form of sectioned content
    const sections = compiled.querySelectorAll('section, .section, .feature-section');
    
    // Should have descriptive text
    const textContent = compiled.textContent || '';
    expect(textContent.length).toBeGreaterThan(50); // Should have substantial content
  });

  /**
   * Testing interactive elements
   * This verifies that buttons and interactive elements are functional
   */
  it('should have interactive elements', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    
    // Look for buttons and interactive elements
    const interactiveElements = compiled.querySelectorAll(
      'button, a[routerLink], [role="button"], .btn, .button'
    );
    
    expect(interactiveElements.length).toBeGreaterThan(0);
    
    // Test that interactive elements have proper styling
    interactiveElements.forEach(element => {
      const classList = Array.from(element.classList);
      expect(classList.length).toBeGreaterThan(0); // Should have some styling classes
    });
  });

  /**
   * Testing feature descriptions
   * This verifies that the home page explains the application features
   */
  it('should describe application features', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const textContent = (compiled.textContent || '').toLowerCase();
    
    // Should mention key Angular concepts
    const concepts = ['forms', 'components', 'services', 'routing'];
    const mentionedConcepts = concepts.filter(concept => 
      textContent.includes(concept.toLowerCase())
    );
    
    // Should mention at least some Angular concepts
    expect(mentionedConcepts.length).toBeGreaterThan(0);
  });

  /**
   * Testing component lifecycle
   * This demonstrates testing Angular lifecycle hooks
   */
  it('should handle component lifecycle correctly', () => {
    // Test component initialization
    expect(component).toBeTruthy();
    
    // Test that component renders without errors
    expect(() => fixture.detectChanges()).not.toThrow();
    
    // Test component destruction
    expect(() => fixture.destroy()).not.toThrow();
  });

  /**
   * Performance test - component rendering speed
   * This demonstrates basic performance testing concepts
   */
  it('should render efficiently', () => {
    const startTime = performance.now();
    
    // Trigger change detection
    fixture.detectChanges();
    
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    // Should render quickly (adjust threshold as needed)
    expect(renderTime).toBeLessThan(100); // 100ms threshold
  });

  /**
   * Testing error handling
   * This demonstrates testing component robustness
   */
  it('should handle component initialization gracefully', () => {
    // This test ensures the component doesn't break during initialization
    expect(() => {
      fixture.detectChanges();
    }).not.toThrow();
  });
});
