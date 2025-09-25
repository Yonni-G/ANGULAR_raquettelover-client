import { Component } from '@angular/core';
import { SpinnerService } from '../../../services/spinner.service';
import { Spinner } from '../../../models/Spinner';

@Component({
  selector: 'app-spinner',
  imports: [],
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.css'
})
export class SpinnerComponent {

  spinner!: Spinner;
  constructor(private readonly spinnerService: SpinnerService) {
    spinnerService.loading$.subscribe((spinner) => (this.spinner = spinner));
  }
}
