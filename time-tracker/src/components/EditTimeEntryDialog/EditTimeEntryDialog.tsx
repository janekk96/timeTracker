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
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Edytuj wpis</Modal.Title>
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
          className="btn btn-primary d-flex gap-1 align-items-center"
          onClick={handleSave}
        >
          <FontAwesomeIcon icon={faSave} />
          Zapisz
        </button>
        <button
          type="button"
          className="btn btn-danger d-flex gap-1 align-items-center"
          onClick={handleDelete}
        >
          <FontAwesomeIcon icon={faTrash} />
          Usuń
        </button>
      </Modal.Footer>
    </Modal>
  );
}

export default EditTimeEntryDialog;
