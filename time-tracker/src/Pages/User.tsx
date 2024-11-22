import { useEffect, useState, useMemo, useContext, createContext } from "react";
import { Button, Card, Spinner, Table } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import AddTimeEntryDialog from "../components/AddTimeEntryDialog/AddTimeEntryDialog";

import "./styles/user.css";
import PageWrapper from "../Design/PageWrapper/PageWrapper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCheck,
  faExclamationCircle,
  faFilter,
  faPlus,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { supabase } from "../consts/supabase";
import { UserProfile } from "./Home";
import ExportTableToExcel from "../Utils/ExportTableToExcel";
import FilterEntriesDialog from "../components/FilterEntriesDialog/FilterEntriesDialog";
import { PREDEFINED_FILTERS } from "../consts/WorkTimeFilters";
import moment from "moment";
import { AuthContext } from "../contexts/AuthContext";
import { AuthUser } from "../contexts/AuthContext";
import EditTimeEntryDialog from "../components/EditTimeEntryDialog/EditTimeEntryDialog";

export interface TimeEntryType {
  type: string;
  id: number;
}

export interface TimeEntry {
  id: string;
  uid: string;
  start: string;
  end: string;
  created_at: string;
  workhours_entry_type: TimeEntryType;
}

export interface Filter {
  from: string;
  to: string;
  types: number[];
}

const ReloadContext = createContext({ reload: () => {} });

const getDuration = (entry: Pick<TimeEntry, "start" | "end">) => {
  const minutes = getDurationInMinutes(entry);
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
};

const getDurationInMinutes = (entry: Pick<TimeEntry, "start" | "end">) => {
  const start = new Date(entry.start);
  const end = new Date(entry.end);
  const diff = end.getTime() - start.getTime();
  return Math.floor(diff / 60000);
};

function User() {
  const [reloadCounter, setReloadCounter] = useState(0);
  const { uid } = useParams();
  const { user: authUser } = useContext(AuthContext) || {};
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [workTime, setWorkTime] = useState<TimeEntry[]>([]);
  const [loadingWorkTime, setLoadingWorkTime] = useState(true);
  const [filters, setFilters] = useState<Filter>(() => {
    return {
      from: moment(PREDEFINED_FILTERS.thisMonth.startDate()).format(
        "YYYY-MM-DD"
      ),
      to: moment(PREDEFINED_FILTERS.thisMonth.endDate()).format("YYYY-MM-DD"),
      types: [1, 2],
    };
  });

  const [addEntryShow, setAddEntryShow] = useState(false);
  const [filteringDialogShow, setFilteringDialogShow] = useState(false);

  const approveUser = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .update({ is_approved: true })
      .eq("id", uid);
    if (error) {
      alert("Bład podczas zatwierdzania użytkownika");
    }
    if (data) {
      alert("Zatwierdzono użytkownika");
    }
  };

  const handleUserApproval = async () => {
    if (authUser?.role === "Admin") {
      await approveUser();
      setUser((prev) => (prev ? { ...prev, is_approved: true } : prev));
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      setLoadingProfile(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", uid);
      if (error) {
        console.error("Error fetching user:", error);
      } else {
        setUser(data[0]);
      }
      setLoadingProfile(false);
    };
    fetchUser();
  }, [uid]);

  const filterString = useMemo(() => {
    const typeFilter =
      filters.types.length > 1
        ? `in.(${filters.types.join(",")})`
        : `eq.${filters.types[0]}`;
    return `and(uid.eq.${uid}, start.gte.${filters.from}, end.lte.${filters.to}, entry_type.${typeFilter})`;
  }, [filters, uid]);

  useEffect(() => {
    const fetchWorkTime = async () => {
      setLoadingWorkTime(true);
      const { data, error } = await supabase
        .from("workhours")
        .select(`*, workhours_entry_type (id, type)`)
        .order("start", { ascending: true })
        .or(filterString);
      if (error) {
        console.error("Error fetching work time:", error);
      } else {
        setWorkTime(data);
      }
      setLoadingWorkTime(false);
    };
    fetchWorkTime();
  }, [uid, filterString, addEntryShow, reloadCounter]);

  const getTimeFormatted = (time: string) => {
    return new Date(time).toLocaleString();
  };

  const totalDuration = useMemo(() => {
    return workTime.reduce(
      (acc, entry) => acc + getDurationInMinutes(entry),
      0
    );
  }, [workTime]);

  const tableData =
    workTime &&
    workTime.map((entry) => ({
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
    <ReloadContext.Provider
      value={{ reload: () => setReloadCounter(reloadCounter + 1) }}
    >
      <PageWrapper>
        <AddTimeEntryDialog
          show={addEntryShow}
          onHide={() => setAddEntryShow(false)}
        />
        <FilterEntriesDialog
          show={filteringDialogShow}
          onHide={() => setFilteringDialogShow(false)}
          activeFilters={filters}
          applyFilters={setFilters}
        />
        {(loadingProfile ? (
          <Spinner animation="border" />
        ) : (
          authUser?.role === "Admin"
        )) || user?.is_approved ? (
          <div className="user-wrapper">
            <TopBar
              setAddEntryShow={setAddEntryShow}
              setFilteringDialogShow={setFilteringDialogShow}
            />

            {loadingProfile ? (
              <Spinner animation="border" />
            ) : (
              <UserHeader
                authUser={authUser}
                handleUserApproval={handleUserApproval}
                user={user}
              />
            )}
            <HoursTable
              workTime={workTime}
              totalDuration={totalDuration}
              workTimeLoading={loadingWorkTime}
            />
            <ExportTableToExcel
              tableData={tableData}
              fileName={user?.username || ""}
            />
          </div>
        ) : (
          <NotVerifiedUser />
        )}
      </PageWrapper>
    </ReloadContext.Provider>
  );
}

export default User;

interface TopBarProps {
  setAddEntryShow: React.Dispatch<React.SetStateAction<boolean>>;
  setFilteringDialogShow: React.Dispatch<React.SetStateAction<boolean>>;
}

function TopBar({ setAddEntryShow, setFilteringDialogShow }: TopBarProps) {
  const { user } = useContext(AuthContext) || {};
  const navigate = useNavigate();
  return (
    <div className="top-bar">
      <div className="d-flex gap-1">
        <Button
          variant="success"
          onClick={() => setAddEntryShow((prev) => !prev)}
        >
          <FontAwesomeIcon icon={faPlus} />
        </Button>
        <Button variant="success" onClick={() => setFilteringDialogShow(true)}>
          <FontAwesomeIcon icon={faFilter} />
        </Button>
      </div>
      {user?.role === "Admin" && (
        <Button variant="secondary" onClick={() => navigate("/")}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </Button>
      )}
      {user?.role === "User" && (
        <Button variant="warning" onClick={() => supabase.auth.signOut()}>
          <FontAwesomeIcon icon={faRightFromBracket} />
        </Button>
      )}
    </div>
  );
}

interface HoursTableProps {
  workTime: TimeEntry[];
  totalDuration: number;
  workTimeLoading: boolean;
}

function EntryRow({
  id,
  start,
  end,
  workhours_entry_type,
}: Omit<TimeEntry, "uid">) {
  const { reload } = useContext(ReloadContext);
  const [editShown, setEditShown] = useState(false);
  const { user } = useContext(AuthContext) || {};
  const rowClass = user?.role === "Admin" ? "adminRow" : "";
  const handleRowClick = () => {
    if (user?.role === "Admin") {
      setEditShown(true);
    }
  };
  const handleClose = () => {
    setEditShown(false);
    reload();
  };
  return (
    <>
      <EditTimeEntryDialog
        show={editShown}
        onHide={handleClose}
        id={parseInt(id)}
        startTime={moment(start).toDate()}
        endTime={moment(end).toDate()}
        entrySelectedType={workhours_entry_type.id}
      />
      <tr className={rowClass} onClick={handleRowClick}>
        <td>{moment(start).format("DD.MM.YYYY")}</td>
        <td>{moment(start).format("HH:mm")}</td>
        <td>{moment(end).format("HH:mm")}</td>
        <td>{getDuration({ start, end })}</td>
        <td>{workhours_entry_type.type}</td>
      </tr>
    </>
  );
}

function HoursTable({
  workTime,
  totalDuration,
  workTimeLoading,
}: HoursTableProps) {
  return (
    <div className="table-wrapper">
      <Table striped bordered hover className="user-table">
        <thead>
          <tr>
            <th>Dzień</th>
            <th>Start</th>
            <th>Koniec</th>
            <th>Czas trwania</th>
            <th>Typ</th>
          </tr>
        </thead>
        <tbody>
          {workTimeLoading ? (
            <Spinner animation="border" />
          ) : (
            workTime.map((entry) => (
              <EntryRow
                key={`work_entry_${entry.id}`}
                id={entry.id}
                created_at={entry.created_at}
                end={entry.end}
                start={entry.start}
                workhours_entry_type={entry.workhours_entry_type}
              />
            ))
          )}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={4}>Łącznie</td>
            <td>
              {`${Math.floor(totalDuration / 60)}h ${totalDuration % 60}m`}
            </td>
          </tr>
        </tfoot>
      </Table>
    </div>
  );
}

interface UserHeaderProps {
  authUser: AuthUser | null | undefined;
  handleUserApproval: () => Promise<void>;
  user: UserProfile | null;
}

function UserHeader({ authUser, handleUserApproval, user }: UserHeaderProps) {
  return (
    <>
      <h1 className="d-flex align-items-center gap-2">
        {user?.full_name}
        {!user?.is_approved && (
          <FontAwesomeIcon
            title="Użytkownik nie został jeszcze zaakceptowany przez administratora i nie może dodawać wpisów czasu pracy"
            icon={faExclamationCircle}
            style={{ color: "red" }}
          />
        )}
      </h1>
      {authUser?.role === "Admin" && !user?.is_approved && (
        <Button
          className="mb-2 d-flex align-items-center gap-1 justify-content-center"
          variant="success"
          onClick={handleUserApproval}
        >
          <FontAwesomeIcon icon={faCheck} />
          Zatwierdź użytkownika
        </Button>
      )}
    </>
  );
}

function NotVerifiedUser() {
  return (
    <Card>
      <Card.Body>
        <div className="d-flex flex-column flex-wrap justify-content-center align-items-center">
          <h1>Użytkownik nie został jeszcze zaakceptowany</h1>
          <p>
            Użytkownik musi zostać zaakceptowany przez administratora, aby móc
            dodawać wpisy czasu pracy. Prosimy o cierpliwość.
          </p>
          <Button
            onClick={() => supabase.auth.signOut()}
            className="d-flex align-items-center gap-1"
          >
            <FontAwesomeIcon icon={faRightFromBracket} />
            Wyloguj
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}
