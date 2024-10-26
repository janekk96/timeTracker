import { Dropdown, Modal } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useState } from "react";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTimes } from "@fortawesome/free-solid-svg-icons";
import { supabase } from "../../consts/supabase";

export interface AddTimeEntryDialogProps {
  show: boolean;
  onHide: () => void;
}

const TimeEntryTypes: { [key: number]: string } = {
  1: "Prace standardowe",
  2: "Prace naprawcze",
};

function AddTimeEntryDialog({ show, onHide }: AddTimeEntryDialogProps) {
  const { uid } = useParams();
  const [selectedType, setSelectedType] = useState<number>(1);
  const [date, setDate] = useState<Date>(new Date());
  const [start, setStart] = useState<string>("08:00");
  const [end, setEnd] = useState<string>("16:00");

  const updateEntry = async () => {
    const startingTime = moment(
      `${moment(date).format("YYYY-MM-DD")} ${start}`
    );
    const endingTime = moment(`${moment(date).format("YYYY-MM-DD")} ${end}`);

    if (startingTime.isAfter(endingTime)) {
      alert("Start time cannot be after end time");
      return false;
    }

    const { error } = await supabase.from("workhours").insert([
      {
        uid,
        start: startingTime.toISOString(true),
        end: endingTime.toISOString(true),
        entry_type: selectedType,
      },
    ]);
    if (error) {
      console.error("Error inserting entry:", error);
      alert("Wystąpił błąd podczas dodawania wpisu");
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (await updateEntry()) {
      onHide();
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Add Time Entry</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="form-group">
          <label htmlFor="date">Data</label>
          <input
            type="date"
            className="form-control"
            id="date"
            value={moment(date).format("YYYY-MM-DD")}
            onChange={(e) => setDate(new Date(e.target.value))}
          />
        </div>
        <div className="form-group">
          <label htmlFor="hours">Start</label>
          <input
            type="time"
            className="form-control"
            id="hours"
            value={start}
            onChange={(e) => {
              setStart(e.target.value);
            }}
          />
        </div>
        <div className="form-group">
          <label htmlFor="hours">Koniec</label>
          <input
            type="time"
            className="form-control"
            id="hours"
            value={end}
            onChange={(e) => {
              setEnd(e.target.value);
            }}
          />
        </div>
        <div className="form-group d-flex gap-1 align-items-center pt-3">
          <Dropdown>
            <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic">
              {TimeEntryTypes[selectedType]}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {Object.entries(TimeEntryTypes).map(([key, value]) => (
                <Dropdown.Item
                  key={key}
                  onClick={() => setSelectedType(parseInt(key))}
                >
                  {value}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button
          type="button"
          className="btn btn-secondary d-flex gap-1 align-items-center"
          onClick={onHide}
        >
          <FontAwesomeIcon icon={faTimes} />
          Anuluj
        </button>
        <button
          type="button"
          className="btn btn-primary d-flex gap-1 align-items-center"
          onClick={handleSave}
        >
          <FontAwesomeIcon icon={faSave} />
          Zapisz
        </button>
      </Modal.Footer>
    </Modal>
  );
}

export default AddTimeEntryDialog;
