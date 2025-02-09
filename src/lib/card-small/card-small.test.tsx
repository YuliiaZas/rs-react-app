import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { KeyValuePair } from '@utils';
import { CardSmall } from './card-small';

describe('CardSmall', () => {
  const cardTitle = 'Test Card';
  const listOfDetails: KeyValuePair[] = [
    { key: 'Height', value: '172' },
    { key: 'Mass', value: '77' },
  ];

  it('should render card title', () => {
    const { getByText } = render(
      <CardSmall cardTitle={cardTitle} listOfDetails={listOfDetails} />
    );
    expect(getByText(cardTitle)).toBeInTheDocument();
  });

  it('should render list of details', () => {
    const { getByText } = render(
      <CardSmall cardTitle={cardTitle} listOfDetails={listOfDetails} />
    );
    listOfDetails.forEach((detail) => {
      expect(
        getByText((_content, element) => {
          if (!element) return false;
          const hasText = (node: Element) =>
            node.textContent?.includes(`${detail.key}: ${detail.value}`);
          const elementHasText = !!hasText(element);
          const childrenDontHaveText = Array.from(element.children).every(
            (child) => !hasText(child)
          );
          return elementHasText && childrenDontHaveText;
        }) as unknown
      ).toBeInTheDocument();
    });
  });

  it('should separate details with semicolons and add point in the end', () => {
    const { container } = render(
      <CardSmall cardTitle={cardTitle} listOfDetails={listOfDetails} />
    );
    const detailText =
      container.querySelector('.small-card-detail')?.textContent;
    expect(detailText).toContain('Height: 172; Mass: 77.');
  });
});
