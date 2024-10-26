import { useContext, useEffect, useMemo, useState } from "react";
import { Button, Table } from "react-bootstrap";
import { useParams } from "react-router-dom";
import ExportTableToExcel from "../Utils/ExportTableToExcel";
import { AuthContext } from "../AuthProvider";
import AddTimeEntryDialog from "../components/AddTimeEntryDialog/AddTimeEntryDialog";

import "./styles/user.css";
import PageWrapper from "../Design/PageWrapper/PageWrapper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faBackward,
  faPlus,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";

function User() {
  const { uid } = useParams();
  const { user: u, logout } = useContext(AuthContext) || {};
  const [user, setUser] = useState(null);
  const [addEntryShow, setAddEntryShow] = useState(false);
  useEffect(() => {
    fetch(`http://localhost:8000/users/${uid}`)
      .then((response) => response.json())
      .then((json) => setUser(json));
  }, []);

  const getTimeFormatted = (time) => {
    return new Date(time).toLocaleString();
  };

  const getDuration = (entry) => {
    const minutes = getDurationInMinutes(entry);
    return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
  };

  const getDurationInMinutes = (entry) => {
    const start = new Date(entry.start);
    const end = new Date(entry.end);
    const diff = end.getTime() - start.getTime();
    return Math.floor(diff / 60000);
  };

  const totalDuration = useMemo(() => {
    if (!user) return [];
    return user?.work_time.reduce(
      (acc, entry) => acc + getDurationInMinutes(entry),
      0
    );
  }, [user]);

  if (!user) return <div>Loading...</div>;

  const tableData = user?.work_time.map((entry) => ({
    start: getTimeFormatted(entry.start),
    end: getTimeFormatted(entry.end),
    duration: getDuration(entry),
  }));
  tableData.push({
    start: "Total",
    end: "",
    duration: `${Math.floor(totalDuration / 60)}h ${totalDuration % 60}m`,
  });

  return (
    <PageWrapper>
      <div className="user-wrapper">
        <div className="top-bar">
          <Button
            variant="success"
            onClick={() => setAddEntryShow((prev) => !prev)}
          >
            <FontAwesomeIcon icon={faPlus} />
          </Button>
          {u.role === "Admin" && (
            <Button variant="secondary" onClick={() => window.history.back()}>
              <FontAwesomeIcon icon={faArrowLeft} />
            </Button>
          )}
          {u.role === "User" && (
            <Button variant="warning" onClick={logout}>
              <FontAwesomeIcon icon={faRightFromBracket} />
            </Button>
          )}
        </div>
        <AddTimeEntryDialog
          show={addEntryShow}
          onHide={() => setAddEntryShow(false)}
        />

        <h1>{user?.username}</h1>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Start</th>
              <th>End</th>
              <th>Duration</th>
            </tr>
          </thead>
          <tbody>
            {user?.work_time.map((entry) => (
              <tr key={entry.id}>
                <td>{getTimeFormatted(entry.start)}</td>
                <td>{getTimeFormatted(entry.end)}</td>
                <td>{getDuration(entry)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={2}>Total</td>
              <td>
                {`${Math.floor(totalDuration / 60)}h ${totalDuration % 60}m`}
              </td>
            </tr>
          </tfoot>
        </Table>
        <ExportTableToExcel tableData={tableData} fileName={user.username} />
      </div>
    </PageWrapper>
  );
}

export default User;
