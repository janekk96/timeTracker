import { Modal } from "react-bootstrap";
import { useState } from "react";
import { supabase } from "../../consts/supabase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

export interface AddUserDialogProps {
  show: boolean;
  onHide: () => void;
}

enum userRoles {
  User = "User",
  Admin = "Admin",
}

function AddUserDialog({ show, onHide }: AddUserDialogProps) {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [role, setRole] = useState<userRoles>(userRoles.User);

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
          role: role,
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
      onHide();
    }
  };
  return (
    <Modal show={show} onHide={onHide} aria-labelledby="add-user-modal-title">
      <Modal.Header closeButton>
        <Modal.Title id="add-user-modal-title">Dodaj użytkownika</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form
          id="add-user-form"
          onSubmit={(e) => {
            e.preventDefault();
            addUser();
          }}
        >
          <div className="form-group">
            <label htmlFor="add-user-firstname">Imię</label>
            <input
              type="text"
              className="form-control"
              id="add-user-firstname"
              autoComplete="given-name"
              aria-required="true"
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="add-user-lastname">Nazwisko</label>
            <input
              type="text"
              className="form-control"
              id="add-user-lastname"
              autoComplete="family-name"
              aria-required="true"
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="add-user-email">Email</label>
            <input
              type="email"
              className="form-control"
              id="add-user-email"
              autoComplete="email"
              aria-required="true"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="add-user-password">Hasło</label>
            <input
              type="password"
              className="form-control"
              id="add-user-password"
              autoComplete="new-password"
              aria-required="true"
              aria-describedby="add-user-password-hint"
              onChange={(e) => setPassword(e.target.value)}
            />
            <small id="add-user-password-hint" className="form-text text-muted">
              Hasło musi mieć minimum 6 znaków
            </small>
          </div>
          <div className="form-group">
            <label htmlFor="add-user-role">Rola</label>
            <select
              className="form-control"
              id="add-user-role"
              aria-required="true"
              onChange={(e) => setRole(e.target.value as userRoles)}
            >
              {Object.values(userRoles).map((role) => (
                <option value={role} key={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <button
          type="button"
          className="btn btn-secondary d-flex gap-1 align-items-center"
          onClick={onHide}
          aria-label="Zamknij okno dodawania użytkownika"
        >
          <FontAwesomeIcon icon={faTimes} aria-hidden="true" />
          Zamknij
        </button>
        <button
          type="submit"
          form="add-user-form"
          className="btn btn-primary d-flex gap-1 align-items-center"
          aria-label="Dodaj nowego użytkownika"
        >
          <FontAwesomeIcon icon={faPlus} aria-hidden="true" />
          Dodaj
        </button>
      </Modal.Footer>
    </Modal>
  );
}

export default AddUserDialog;
