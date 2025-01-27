import { AppComponent } from './app.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrimeNGConfig } from 'primeng/api';
import { RouterTestingModule } from '@angular/router/testing';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, RouterTestingModule],
      providers: [PrimeNGConfig],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should have as title 'OrdemS'`, () => {
    expect(component.title).toEqual('OrdemS');
  });

  it('should set translation', () => {
    const primengConfig = TestBed.inject(PrimeNGConfig);
    const setTranslationSpy = spyOn(primengConfig, 'setTranslation');
    component.ngOnInit();
    expect(setTranslationSpy).toHaveBeenCalled();
  });
});
