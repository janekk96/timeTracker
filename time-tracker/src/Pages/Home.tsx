import { useEffect, useState } from "react";
import { Button, ButtonGroup, Card } from "react-bootstrap";

import styles from "./styles/Home.module.css";
import PageWrapper from "../Design/PageWrapper/PageWrapper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { supabase } from "../consts/supabase";
import { useNavigate } from "react-router-dom";

export interface UserProfile {
  id: string;
  full_name: string;
  username: string;
  role: string;
  is_approved: boolean;
}

export interface UserListProps {
  filter: ProfileFilter;
  setUnverifiedCount: (count: number) => void;
}

function UserList({ filter, setUnverifiedCount }: UserListProps) {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfiles = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("profiles").select("*");
      if (error) {
        console.error("Error fetching profiles:", error);
      } else {
        setProfiles(data);
      }
      setLoading(false);
    };
    fetchProfiles();
  }, []);

  useEffect(() => {
    const unverifiedCount =
      profiles.filter(PROFILE_FILTERS_CALLBACKS.notVerified.callback).length ||
      0;
    setUnverifiedCount(unverifiedCount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profiles]);

  if (loading)
    return (
      <p role="status" aria-live="polite">
        Ładowanie profili...
      </p>
    );

  return (
    <div className={styles.cards} role="list" aria-label="Lista użytkowników">
      {profiles.filter(filter.callback).map((profile) => (
        <Card
          key={profile.id}
          className={styles.userCard}
          onClick={() => navigate(`/${profile.id}`)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              navigate(`/${profile.id}`);
            }
          }}
          tabIndex={0}
          role="listitem"
          aria-label={`Użytkownik ${profile.full_name}, nazwa: ${profile.username}, rola: ${profile.role}`}
        >
          <Card.Body className="text-center">
            <Card.Title as="h2" className={styles.userFullName}>
              {profile.full_name}
            </Card.Title>
            <Card.Subtitle className={styles.userName}>
              {profile.username}
            </Card.Subtitle>
            <Card.Text className={styles.userRole}>
              Rola: {profile.role}
            </Card.Text>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
}

type ProfileFilterKey = "all" | "verified" | "notVerified";
interface ProfileFilter {
  label: (a?: number) => string;
  callback: (profile: UserProfile) => boolean;
}

const PROFILE_FILTERS_CALLBACKS: Record<ProfileFilterKey, ProfileFilter> = {
  all: {
    label: () => "Wszyscy",
    callback: () => true,
  },
  verified: {
    label: () => "Zatwierdzeni",
    callback: (profile: UserProfile) => profile.is_approved,
  },
  notVerified: {
    label: (a?: number) => `Niezatwierdzeni ${a}`,
    callback: (profile: UserProfile) => !profile.is_approved,
  },
};
function Home() {
  const [profileFilter, setProfileFilter] = useState<ProfileFilterKey>("all");
  const [unverifiedCount, setUnverifiedCount] = useState(0);
  return (
    <PageWrapper>
      <div className={styles.homeWrapper}>
        <h1>Lista Użytkowników</h1>
        <ButtonGroup
          className="w-100"
          role="group"
          aria-label="Filtrowanie użytkowników"
        >
          {Object.entries(PROFILE_FILTERS_CALLBACKS).map(([key, value]) => (
            <Button
              key={key}
              onClick={() => setProfileFilter(key as ProfileFilterKey)}
              variant={`secondary ${key === profileFilter && "active"}`}
              size="sm"
              aria-pressed={key === profileFilter}
              aria-label={value.label(unverifiedCount)}
            >
              {value.label(unverifiedCount)}
            </Button>
          ))}
        </ButtonGroup>
        <UserList
          filter={PROFILE_FILTERS_CALLBACKS[profileFilter]}
          setUnverifiedCount={setUnverifiedCount}
        />
        <Button
          className="mt-2"
          variant="warning"
          onClick={() => supabase.auth.signOut()}
          aria-label="Wyloguj się z aplikacji"
        >
          <FontAwesomeIcon icon={faArrowRightFromBracket} aria-hidden="true" />{" "}
          Wyloguj
        </Button>
      </div>
    </PageWrapper>
  );
}

export default Home;
