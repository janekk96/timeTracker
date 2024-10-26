import { Modal } from "react-bootstrap";

export interface AddTimeEntryDialogProps {
  show: boolean;
  onHide: () => void;
}

function AddTimeEntryDialog({ show, onHide }: AddTimeEntryDialogProps) {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Add Time Entry</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form>
          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input type="date" className="form-control" id="date" />
          </div>
          <div className="form-group">
            <label htmlFor="hours">Start</label>
            <input type="number" className="form-control" id="hours" />
          </div>
          <div className="form-group">
            <label htmlFor="hours">End</label>
            <input type="number" className="form-control" id="hours" />
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <button type="button" className="btn btn-secondary" onClick={onHide}>
          Cancel
        </button>
        <button type="button" className="btn btn-primary" onClick={onHide}>
          Add
        </button>
      </Modal.Footer>
    </Modal>
  );
}

export default AddTimeEntryDialog;
