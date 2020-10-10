import { IMEGTemplatePage } from './app.po';

describe('IMEG App', function() {
  let page: IMEGTemplatePage;

  beforeEach(() => {
    page = new IMEGTemplatePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
