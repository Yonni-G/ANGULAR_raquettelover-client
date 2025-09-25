import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './pages/partials/footer/footer.component';
import { HeaderComponent } from './pages/partials/header/header.component';
import { MessageComponent } from './pages/partials/message/message.component';
import { SpinnerComponent } from './pages/partials/spinner/spinner.component';
import { SpinnerService } from './services/spinner.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { delay } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FooterComponent, HeaderComponent, MessageComponent, SpinnerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  private readonly baseUrl = environment.apiUrl;

  constructor(private readonly spinnerService: SpinnerService, private readonly http: HttpClient) {
    this.spinnerService.show("Réveil en cours du serveur gratuit Render sur lequel est hébergé l'API Rest, cela peut prendre plus de 1 minute...");
    this.http
      .get(this.baseUrl + '/test/all', { responseType: 'text' })
      .subscribe(() => this.spinnerService.hide());
  }
}
