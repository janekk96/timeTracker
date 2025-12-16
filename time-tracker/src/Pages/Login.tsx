import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "../consts/supabase";
import { Button, Card } from "react-bootstrap";
import { useState } from "react";

import styles from "./styles/Login.module.css";

enum Views {
  LOGIN = "login",
  REGISTER = "register",
}

function Login() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [activeView, setActiveView] = useState<Views>(Views.LOGIN);

  const checkInputs = () => {
    let res = true;
    if (
      username === "" ||
      password === "" ||
      firstName === "" ||
      lastName === ""
    ) {
      res = false;
    }
    if (
      username.length < 3 ||
      password.length < 6 ||
      firstName.length < 3 ||
      lastName.length < 3
    ) {
      res = false;
    }

    return res;
  };

  const addUser = async () => {
    if (!checkInputs()) {
      alert("Fill all fields");
      return;
    }
    const { data, error } = await supabase.auth.signUp({
      email: username,
      password,
    });
    const updateProfile = async (id: string | undefined) => {
      if (!id) {
        return;
      }
      const { data, error } = await supabase
        .from("profiles")
        .update({
          role: "User",
          username: `${firstName}.${lastName}`.toLowerCase(),
          full_name: `${firstName} ${lastName}`,
        })
        .eq("id", id);
      if (error) {
        alert("Bład podczas dodawania profilu użytkownika");
      }
      if (data) {
        alert("Dodano użytkownika");
      }
    };

    if (error) {
      alert("Bład podczas dodawania użytkownika");
    } else {
      const { user } = data;
      updateProfile(user?.id);
    }
  };

  return (
    <main
      className={styles.wrapper}
      id="main-content"
      role="main"
      aria-label="Strona logowania"
    >
      <Card className={styles.loginCard}>
        <Card.Header className={styles.loginCardHeader}>
          <h1 id="login-title">Zaloguj się</h1>
        </Card.Header>
        {activeView === Views.LOGIN && (
          <Auth
            providers={[]}
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            showLinks={false}
            localization={{
              variables: {
                sign_in: {
                  email_label: "Email",
                  password_label: "Hasło",
                  button_label: "Zaloguj",
                },
              },
            }}
          />
        )}
        {activeView === Views.REGISTER && (
          <form
            className="d-flex flex-column gap-2"
            aria-labelledby="login-title"
            onSubmit={(e) => {
              e.preventDefault();
              addUser();
            }}
          >
            <div className="form-group">
              <label htmlFor="register-firstname">Imię</label>
              <input
                type="text"
                className="form-control"
                id="register-firstname"
                autoComplete="given-name"
                aria-required="true"
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="register-lastname">Nazwisko</label>
              <input
                type="text"
                className="form-control"
                id="register-lastname"
                autoComplete="family-name"
                aria-required="true"
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="register-email">Email</label>
              <input
                type="email"
                className="form-control"
                id="register-email"
                autoComplete="email"
                aria-required="true"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="register-password">Hasło</label>
              <input
                type="password"
                className="form-control"
                id="register-password"
                autoComplete="new-password"
                aria-required="true"
                aria-describedby="password-hint"
                onChange={(e) => setPassword(e.target.value)}
              />
              <small id="password-hint" className="form-text text-muted">
                Hasło musi mieć minimum 6 znaków
              </small>
            </div>
            <Button className="mt-3" variant="primary" type="submit">
              Zarejestruj
            </Button>
          </form>
        )}
        <Card.Footer className={styles.loginCardFooter}>
          <Button
            variant="outline-secondary"
            onClick={() =>
              setActiveView(
                activeView === Views.LOGIN ? Views.REGISTER : Views.LOGIN
              )
            }
            className={styles.modeSwitch}
            aria-label={
              activeView === Views.LOGIN
                ? "Przejdź do rejestracji"
                : "Przejdź do logowania"
            }
          >
            {activeView === Views.LOGIN && "Nie masz konta? Zarejestruj się"}
            {activeView === Views.REGISTER && "Masz konto? Zaloguj się"}
          </Button>
        </Card.Footer>
      </Card>
    </main>
  );
}
export default Login;
