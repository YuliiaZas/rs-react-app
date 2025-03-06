import { FunctionComponent, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@hooks';
import { KeyValuePair, PeopleFormatted, text } from '@utils';
import { getSelectedItems, getSelectedItemsNumber, unselectAll } from '@store';
import styles from './home-page-save.module.css';

export const HomePageSave: FunctionComponent = () => {
  const [link, setLink] = useState('');
  const [fileName, setFileName] = useState('');

  const downloadRef = useRef<HTMLAnchorElement>(null);

  const dispatch = useAppDispatch();

  const selectedItemsObject = useAppSelector((state) =>
    getSelectedItems(state)
  );
  const selectedItemsNumber = useAppSelector((state) =>
    getSelectedItemsNumber(state)
  );

  function handleSaving() {
    const csvData = new Blob([arrayToCsv(getFormattedData())], {
      type: 'text/csv;charset=utf-8;',
    });
    setLink(URL.createObjectURL(csvData));
    setFileName(`${selectedItemsNumber}${text.save.fileName}`);
    setTimeout(() => downloadRef.current?.click());
  }

  function getFormattedData(): string[][] {
    const selectedItems = Object.values(selectedItemsObject);
    if (!selectedItems.length) return [];

    return [
      [...getHeader(selectedItems[0].details)],
      ...getData(selectedItems),
    ];
  }

  function getHeader(details: KeyValuePair[]): string[] {
    return ['', ...details.map(({ key }) => key)];
  }

  function getData(selectedItems: PeopleFormatted[]): string[][] {
    return selectedItems.map(({ name, details }) => [
      name,
      ...details.map(({ value }) => value),
    ]);
  }

  function arrayToCsv(data: string[][]) {
    return data
      .map((row) =>
        row
          .map(String)
          .map((v) => v.replaceAll('"', '""'))
          .map((v) => `"${v}"`)
          .join(',')
      )
      .join('\r\n');
  }

  if (!selectedItemsNumber) {
    return null;
  }

  return (
    <div className={styles['save-wrapper']}>
      <p className={styles['save-title']}>
        {selectedItemsNumber} {text.save.selectedItems}
      </p>
      <div className={styles['save-buttons']}>
        <button
          className={styles['button-with-icon']}
          onClick={() => dispatch(unselectAll())}
        >
          <i className="icon-checkbox"></i>
          <span>{text.save.unselect}</span>
        </button>
        <button className={styles['button-with-icon']} onClick={handleSaving}>
          <i className="icon-save"></i>
          <span>{text.save.download}</span>
        </button>
      </div>
      <a
        className="d-none"
        href={link}
        download={fileName}
        ref={downloadRef}
        aria-hidden="true"
        role="link"
      ></a>
    </div>
  );
};
