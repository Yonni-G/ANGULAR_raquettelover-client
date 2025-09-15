import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './pages/partials/footer/footer.component';
import { HeaderComponent } from './pages/partials/header/header.component';
import { MessageComponent } from './pages/partials/message/message.component';
import { SpinnerComponent } from './pages/partials/spinner/spinner.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FooterComponent, HeaderComponent, MessageComponent, SpinnerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'raquettelover-client';
}
