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

  if (loading) return <p>Loading profiles...</p>;

  return (
    <div className={styles.cards}>
      {profiles.filter(filter.callback).map((profile) => (
        <Card
          key={profile.id}
          className={styles.userCard}
          onClick={() => navigate(`user/${profile.id}`)}
        >
          <Card.Body className="text-center">
            <Card.Title className={styles.userFullName}>
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
        <ButtonGroup>
          {Object.entries(PROFILE_FILTERS_CALLBACKS).map(([key, value]) => (
            <Button
              key={key}
              onClick={() => setProfileFilter(key as ProfileFilterKey)}
              variant={`outline-secondary ${key === profileFilter && "active"}`}
              size="sm"
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
          variant="warning"
          className="mt-auto"
          onClick={() => supabase.auth.signOut()}
        >
          <FontAwesomeIcon icon={faArrowRightFromBracket} /> Wyloguj
        </Button>
      </div>
    </PageWrapper>
  );
}

export default Home;
