import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerHomeComponent } from './player-home.component';

describe('PlayerHomeComponent', () => {
  let component: PlayerHomeComponent;
  let fixture: ComponentFixture<PlayerHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayerHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display init message', () => {
    const initMsg = fixture.nativeElement.querySelector('p');
    expect(initMsg.textContent).toContain('zone');
  })
});
