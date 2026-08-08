import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('./components/Home/WireframeVisual', () => () => null);
jest.mock('./components/ScrollToTop', () => () => null);

test('renders the editorial homepage', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /notes from the edge/i })).toBeInTheDocument();
});
