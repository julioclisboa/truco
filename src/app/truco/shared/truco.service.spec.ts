import { TestBed } from '@angular/core/testing';

import { TrucoService } from './truco.service';

describe('TrucoService', () => {
  let service: TrucoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrucoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
