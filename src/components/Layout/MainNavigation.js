import { Link } from 'react-router-dom';

import classes from './MainNavigation.module.css';
import { useContext } from 'react';
import AuthContext from '../../store/auth-context';
import { useHistory } from 'react-router-dom/cjs/react-router-dom';

const MainNavigation = () => {
  const context = useContext(AuthContext);
  const history = useHistory();

  const isLoggedIn = context.isLoggedIn;

  const logoutHandler = () => {
    context.logout();
    history.replace("/auth")
  }

  return (
    <header className={classes.header}>
      <Link to='/'>
        <div className={classes.logo}>React Auth</div>
      </Link>
      <nav>
        <ul>
          {
            !isLoggedIn && 
            <li>
              <Link to='/auth'>Login</Link>
            </li>
          }
          {
            isLoggedIn && 
            <li>
              <Link to='/profile'>Profile</Link>
            </li>
          }
          {
            isLoggedIn && 
            <li>
              <button onClick={logoutHandler}>Logout</button>
            </li>
          }
        </ul>
      </nav>
    </header>
  );
};

export default MainNavigation;
