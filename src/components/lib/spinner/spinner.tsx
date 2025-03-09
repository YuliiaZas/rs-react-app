import style from './spinner.module.css';

export const Spinner = ({ global = false }: { global?: boolean }) => {
  return (
    <div
      role="status"
      className={`${style.wrapper} ${global ? style.global : ''}`}
    >
      <div className={style.border}></div>
    </div>
  );
};
