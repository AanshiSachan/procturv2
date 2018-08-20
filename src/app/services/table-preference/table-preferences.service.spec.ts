import { TestBed, inject } from '@angular/core/testing';

import { TablePreferencesService } from './table-preferences.service';

describe('TablePreferencesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TablePreferencesService]
    });
  });

  it('should be created', inject([TablePreferencesService], (service: TablePreferencesService) => {
    expect(service).toBeTruthy();
  }));
});
