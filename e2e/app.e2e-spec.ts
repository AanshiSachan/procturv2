import { ProcturPage } from './app.po';

describe('proctur App', () => {
  let page: ProcturPage;

  beforeEach(() => {
    page = new ProcturPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
