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

export const TimeEntryTypes: { [key: number]: string } = {
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
    <Modal show={show} onHide={onHide} aria-labelledby="add-entry-modal-title">
      <Modal.Header closeButton>
        <Modal.Title id="add-entry-modal-title">Dodaj wpis</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form id="add-entry-form" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
          <div className="form-group">
            <label htmlFor="add-entry-date">Data</label>
            <input
              type="date"
              className="form-control"
              id="add-entry-date"
              value={moment(date).format("YYYY-MM-DD")}
              onChange={(e) => setDate(new Date(e.target.value))}
              aria-required="true"
            />
          </div>
          <div className="form-group">
            <label htmlFor="add-entry-start">Start</label>
            <input
              type="time"
              className="form-control"
              id="add-entry-start"
              value={start}
              onChange={(e) => {
                setStart(e.target.value);
              }}
              aria-required="true"
            />
          </div>
          <div className="form-group">
            <label htmlFor="add-entry-end">Koniec</label>
            <input
              type="time"
              className="form-control"
              id="add-entry-end"
              value={end}
              onChange={(e) => {
                setEnd(e.target.value);
              }}
              aria-required="true"
            />
          </div>
          <div className="form-group d-flex gap-1 align-items-center pt-3">
            <label id="entry-type-label" className="visually-hidden">Typ wpisu</label>
            <Dropdown>
              <Dropdown.Toggle 
                variant="outline-secondary" 
                id="add-entry-type-dropdown"
                aria-labelledby="entry-type-label"
              >
                {TimeEntryTypes[selectedType]}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {Object.entries(TimeEntryTypes).map(([key, value]) => (
                  <Dropdown.Item
                    key={key}
                    onClick={() => setSelectedType(parseInt(key))}
                    aria-selected={selectedType === parseInt(key)}
                  >
                    {value}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <button
          type="button"
          className="btn btn-secondary d-flex gap-1 align-items-center"
          onClick={onHide}
          aria-label="Anuluj dodawanie wpisu"
        >
          <FontAwesomeIcon icon={faTimes} aria-hidden="true" />
          Anuluj
        </button>
        <button
          type="submit"
          form="add-entry-form"
          className="btn btn-primary d-flex gap-1 align-items-center"
          aria-label="Zapisz nowy wpis czasu pracy"
        >
          <FontAwesomeIcon icon={faSave} aria-hidden="true" />
          Zapisz
        </button>
      </Modal.Footer>
    </Modal>
  );
}

export default AddTimeEntryDialog;
