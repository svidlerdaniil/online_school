import styles from './Header.module.scss';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <div className={styles.header}>
      <Link to={'/'}>
        <div className={styles.leftHeader}>
          <img src="img/logo.svg" height={50} width={50} alt="logo" />
          <h1>Школа</h1>
        </div>
      </Link>
      <Link to={'/account'}>
        <div className={styles.rightHeader}>
          <h4>Кабинет</h4>
          <img src="img/account.svg" height={25} width={25} alt="logo" />
        </div>
      </Link>
    </div>
  );
}

export default Header;
