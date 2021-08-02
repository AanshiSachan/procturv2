import { NullvaluePipe } from './nullvalue.pipe';

describe('NullvaluePipe', () => {
  it('create an instance', () => {
    const pipe = new NullvaluePipe();
    expect(pipe).toBeTruthy();
  });
});
