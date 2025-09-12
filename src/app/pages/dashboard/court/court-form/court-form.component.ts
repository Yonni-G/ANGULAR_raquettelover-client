import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourtTypeService } from '../../../../services/court-type.service';

@Component({
  selector: 'app-court-form',
  imports: [],
  templateUrl: './court-form.component.html',
  styleUrl: './court-form.component.css',
})
export class CourtFormComponent implements OnInit {
  placeId!: number;

  constructor(private readonly route: ActivatedRoute, private readonly courtTypeService: CourtTypeService) {}

  ngOnInit(): void {
    // méthode 1 : snapshot (fixe, au moment du chargement)
    this.placeId = Number(this.route.snapshot.paramMap.get('id'));
    
    this.courtTypeService.getCourtType().subscribe({
      next: (ct) => { console.log(ct); },
      error: (err) => { console.log("erreur"); }
    });
  }
}
