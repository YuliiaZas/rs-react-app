import style from './spinner.module.css';

export const Spinner = () => {
  return (
    <div role="status" className={style.wrapper}>
      <div className={style.border}></div>
    </div>
  );
};
