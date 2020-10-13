import { TestBed } from '@angular/core/testing';

import { JogoTrucoService } from './jogo-truco.service';

describe('JogoTrucoService', () => {
  let service: JogoTrucoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JogoTrucoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
