import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Spinner } from '../models/Spinner';

@Injectable({
  providedIn: 'root',
})
export class SpinnerService {
  private readonly _loading = new BehaviorSubject<Spinner>({
    isLoading: false,
    message: '',
  });
  public readonly loading$: Observable<Spinner> = this._loading.asObservable();

  show(message: string = 'Chargement en cours...') {
    this._loading.next({ isLoading: true, message });
  }

  hide() {
    this._loading.next({ isLoading: false, message: '' });
  }
}
