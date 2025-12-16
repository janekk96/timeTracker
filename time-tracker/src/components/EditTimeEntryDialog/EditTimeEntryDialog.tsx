import { Modal, Dropdown } from "react-bootstrap";
import moment from "moment";
import { TimeEntryTypes } from "../AddTimeEntryDialog/AddTimeEntryDialog";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTrash } from "@fortawesome/free-solid-svg-icons";
import { supabase } from "../../consts/supabase";

export interface EditTimeEntryDialogProps {
  show: boolean;
  onHide: () => void;
  id: number;
  startTime: Date;
  endTime: Date;
  entrySelectedType: number;
}

function EditTimeEntryDialog({
  show,
  onHide,
  id,
  entrySelectedType,
  startTime,
  endTime,
}: EditTimeEntryDialogProps) {
  const [date, setDate] = useState<Date>(startTime);
  const [start, setStart] = useState<string>(moment(startTime).format("HH:mm"));
  const [end, setEnd] = useState<string>(moment(endTime).format("HH:mm"));
  const [selectedType, setSelectedType] = useState<number>(entrySelectedType);

  const shouldUpdate = () => {
    let shouldUpdate = false;
    if (date.getTime() !== startTime.getTime()) {
      shouldUpdate = true;
    }
    if (start !== moment(startTime).format("HH:mm")) {
      shouldUpdate = true;
    }
    if (end !== moment(endTime).format("HH:mm")) {
      shouldUpdate = true;
    }
    if (selectedType !== entrySelectedType) {
      shouldUpdate = true;
    }
    return shouldUpdate;
  };

  const handleSave = async () => {
    if (shouldUpdate()) {
      const startingTime = moment(
        `${moment(date).format("YYYY-MM-DD")} ${start}`
      );
      const endingTime = moment(`${moment(date).format("YYYY-MM-DD")} ${end}`);
      const { error } = await supabase
        .from("workhours")
        .update({
          start: startingTime.toISOString(true),
          end: endingTime.toISOString(true),
          entry_type: selectedType,
        })
        .eq("id", id);
      if (error) {
        console.error("Error updating entry:", error);
        alert("Wystąpił błąd podczas aktualizacji wpisu");
        return;
      } else {
        onHide();
        return;
      }
    } else {
      alert("Nie dokonano żadnych zmian");
      onHide();
    }
  };
  const handleDelete = async () => {
    const shouldDelete = window.confirm("Czy na pewno chcesz usunąć ten wpis?");
    if (!shouldDelete) {
      return;
    }
    const { error } = await supabase.from("workhours").delete().eq("id", id);
    if (error) {
      console.error("Error deleting entry:", error);
      alert("Wystąpił błąd podczas usuwania wpisu");
      return;
    } else {
      onHide();
      return;
    }
  };

  return (
    <Modal show={show} onHide={onHide} aria-labelledby="edit-entry-modal-title">
      <Modal.Header closeButton>
        <Modal.Title id="edit-entry-modal-title">Edytuj wpis</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form
          id="edit-entry-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          <div className="form-group">
            <label htmlFor="edit-entry-date">Data</label>
            <input
              type="date"
              className="form-control"
              id="edit-entry-date"
              value={moment(date).format("YYYY-MM-DD")}
              onChange={(e) => setDate(new Date(e.target.value))}
              aria-required="true"
            />
          </div>
          <div className="form-group">
            <label htmlFor="edit-entry-start">Start</label>
            <input
              type="time"
              className="form-control"
              id="edit-entry-start"
              value={start}
              onChange={(e) => {
                setStart(e.target.value);
              }}
              aria-required="true"
            />
          </div>
          <div className="form-group">
            <label htmlFor="edit-entry-end">Koniec</label>
            <input
              type="time"
              className="form-control"
              id="edit-entry-end"
              value={end}
              onChange={(e) => {
                setEnd(e.target.value);
              }}
              aria-required="true"
            />
          </div>
          <div className="form-group d-flex gap-1 align-items-center pt-3">
            <label id="edit-entry-type-label" className="visually-hidden">
              Typ wpisu
            </label>
            <Dropdown>
              <Dropdown.Toggle
                variant="outline-secondary"
                id="edit-entry-type-dropdown"
                aria-labelledby="edit-entry-type-label"
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
          type="submit"
          form="edit-entry-form"
          className="btn btn-primary d-flex gap-1 align-items-center"
          aria-label="Zapisz zmiany we wpisie"
        >
          <FontAwesomeIcon icon={faSave} aria-hidden="true" />
          Zapisz
        </button>
        <button
          type="button"
          className="btn btn-danger d-flex gap-1 align-items-center"
          onClick={handleDelete}
          aria-label="Usuń wpis czasu pracy"
        >
          <FontAwesomeIcon icon={faTrash} aria-hidden="true" />
          Usuń
        </button>
      </Modal.Footer>
    </Modal>
  );
}

export default EditTimeEntryDialog;
