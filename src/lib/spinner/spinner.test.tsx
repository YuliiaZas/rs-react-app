import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Spinner } from './spinner';

describe('Spinner', () => {
  it('should render spinner', () => {
    const { container } = render(<Spinner />);
    expect(container.querySelector('.spinner-wrapper')).toBeInTheDocument();
    expect(container.querySelector('.spinner-border')).toBeInTheDocument();
  });
});
