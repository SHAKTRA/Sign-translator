import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { WelcomeComponent } from './welcome.component';
import { AppTranslocoTestingModule } from '../../core/modules/transloco/transloco-testing.module';
import { provideIonicAngular } from '@ionic/angular/standalone';

describe('WelcomeComponent', () => {
  let component: WelcomeComponent;
  let fixture: ComponentFixture<WelcomeComponent>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [AppTranslocoTestingModule, WelcomeComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        provideIonicAngular()
      ],
    }).compileComponents();

    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WelcomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to app when continue button is clicked', () => {
    component.continueToApp();
    expect(router.navigate).toHaveBeenCalledWith(['/app']);
  });
});
