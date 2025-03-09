import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Spinner } from './spinner';

vi.mock('./spinner.module.css', () => ({
  default: {
    wrapper: 'spinner-wrapper',
    global: 'spinner-global',
    border: 'spinner-border',
  },
}));

describe('Spinner', () => {
  it('should render spinner', () => {
    const { container, getByRole } = render(<Spinner />);
    expect(getByRole('status')).toBeInTheDocument();
    expect(container.querySelector('.spinner-wrapper')).toBeInTheDocument();
    expect(container.querySelector('.spinner-border')).toBeInTheDocument();
  });

  it('should render spinner with "global" class name', () => {
    const { container } = render(<Spinner global={true} />);
    expect(container.querySelector('.spinner-global')).toBeInTheDocument();
  });
});
