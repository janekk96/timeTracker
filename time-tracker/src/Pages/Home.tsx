import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../AuthProvider";
import { Button, Card } from "react-bootstrap";
import { Navigate, useNavigate } from "react-router-dom";

import "./styles/home.css";
import AddUserDialog from "../components/AddUserDialog/AddUserDialog";
import PageWrapper from "../Design/PageWrapper/PageWrapper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightFromBracket,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { supabase } from "../consts/supabase";

function UserList() {
  const nav = useNavigate();
  const [users, setUsers] = useState([]);
  useEffect(() => {
    fetch("http://localhost:8000/users")
      .then((response) => response.json())
      .then((json) => setUsers(json));
  }, []);
  return (
    <div className="d-flex p-2 cards" style={{ gap: "10px" }}>
      {users.map((user) => (
        <Card
          // onClick={() => nav(`/user/${user.id}`)}
          // key={`usercard${user.id}`}
          className="user-card"
        >
          <img
            src="https://th.bing.com/th/id/OIP.cS-Y_XOsZXTltLGPmuEbfgHaGJ?rs=1&pid=ImgDetMain"
            alt="avatar"
          />
          {/* <div>{user.username}</div> */}
          {/* <div>{user.create_at}</div> */}
        </Card>
      ))}
    </div>
  );
}

function Home() {
  const [showAddUser, setShowAddUser] = useState(false);
  return (
    <PageWrapper>
      <div className="home-wrapper">
        <AddUserDialog
          show={showAddUser}
          onHide={() => setShowAddUser(false)}
        />
        <h1>Users list</h1>
        <Button onClick={() => setShowAddUser((prev) => !prev)}>
          <FontAwesomeIcon icon={faPlus} /> Add User
        </Button>
        <UserList />
        <Button
          variant="warning"
          className="mt-auto"
          onClick={() => supabase.auth.signOut()}
        >
          <FontAwesomeIcon icon={faArrowRightFromBracket} /> Logout
        </Button>
      </div>
    </PageWrapper>
  );
}

export default Home;
