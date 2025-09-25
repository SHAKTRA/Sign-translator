import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonButton, IonContent, IonHeader, IonTitle, IonToolbar, IonIcon, IonCard, IonCardContent, IonCardHeader, IonCardTitle } from '@ionic/angular/standalone';
import { LogoComponent } from '../../components/logo/logo.component';
import { TranslocoPipe } from '@jsverse/transloco';
import { arrowForward, checkmarkCircle, people, accessibility, globe, logoGithub } from 'ionicons/icons';
import { addIcons } from 'ionicons';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonIcon,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    LogoComponent,
    TranslocoPipe
  ]
})
export class WelcomeComponent {
  constructor(private router: Router) {
    addIcons({ arrowForward, checkmarkCircle, people, accessibility, globe, logoGithub });
  }

  continueToApp() {
    this.router.navigate(['/app']);
  }
}
