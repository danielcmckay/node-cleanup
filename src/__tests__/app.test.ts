import {matchFiles} from '../app';

test('matches files with pattern', () => {
  const files = ['foo.png', 'bar.jpg', 'baz.txt'];
  const pattern = new RegExp(/\.(png|jpg|jpeg)$/i);

  const matchedFiles = matchFiles(files, pattern);

  expect(matchedFiles).toEqual(['foo.png', 'bar.jpg']);
});