import { useState, useRef, useContext } from 'react';
import AuthContext from "../../store/auth-context"
import classes from './AuthForm.module.css';
import { useHistory } from 'react-router-dom/cjs/react-router-dom';

const AuthForm = () => {
  const history = useHistory();
  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  const context = useContext(AuthContext);

  const [isLogin, setIsLogin] = useState(true);
  const [isAuthentacting, setIsAuthentacting] = useState(false);

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    setIsAuthentacting((prevState) => !prevState);

    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    let url;

    if (isLogin){
      url = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCG8XR7bL35PRRg8t-Kr03QdTp6fzuPtgA";
    } else {
      url = "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCG8XR7bL35PRRg8t-Kr03QdTp6fzuPtgA";
    }
    fetch(url,
      {
        method: "POST",
        body: JSON.stringify({
          email: enteredEmail,
          password: enteredPassword,
          returnSecureToken: true
        }),
        headers: {
          "Content-Type": "application/json"
        }
      }
    ).then ((res)=> {
      setIsAuthentacting((prevState) => !prevState);
      if (res.ok) {
        return res.json();
      } else {
        return res.json().then((data)=>{
          let errorMessage = "Signup Failed";
          if (data && data.error && data.error.message) {
            errorMessage = data.error.message;
          }
          throw new Error(errorMessage);
        })
      }
    }).then(data => {
      context.login(data.idToken);
      history.replace("/");
    })
    .catch(err => {
      alert(err.message);
    })
  }

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={submitHandler} >
        <div className={classes.control}>
          <label htmlFor='email'>Your Email</label>
          <input type='email' id='email' required ref={emailInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          <input
            type='password'
            id='password'
            ref={passwordInputRef}
            required
          />
        </div>
        <div className={classes.actions}>
          {isAuthentacting ? <p> Sending Request... </p> : <button> {isLogin ? 'Login' : 'Create Account'} </button>}
          <button
            type='button'
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;