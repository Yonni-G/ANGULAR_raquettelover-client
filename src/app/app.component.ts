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
    this.spinnerService.show("Merci de patienter pendant le chargement de l'API, cela peut prendre plusieurs dizaines de secondes...");
    this.http
      .get(this.baseUrl + '/test/all', { responseType: 'text' })
      .pipe(delay(10000))
      .subscribe(() => this.spinnerService.hide());
  }
}
