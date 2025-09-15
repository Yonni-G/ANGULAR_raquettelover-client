import { Component } from '@angular/core';
import { SpinnerService } from '../../../services/spinner.service';

@Component({
  selector: 'app-spinner',
  imports: [],
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.css'
})
export class SpinnerComponent {

  loading: boolean = false;
  constructor(private readonly spinnerService: SpinnerService) {
    spinnerService.loading$.subscribe(loading => this.loading = loading)
  }
}
