import { TestBed } from '@angular/core/testing';

import { GrnFormService } from './grn-form.service';

describe('GrnFormService', () => {
  let service: GrnFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GrnFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
