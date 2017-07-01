import { ClientV2Page } from './app.po';

describe('client-v2 App', () => {
  let page: ClientV2Page;

  beforeEach(() => {
    page = new ClientV2Page();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
