import { Modal } from "react-bootstrap";

function AddUserDialog({ show, onHide }) {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Add User</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input type="text" className="form-control" id="username" />
          </div>
          <div className="form-group">
            <label htmlFor="password">User code</label>
            <input type="text" className="form-control" id="password" />
          </div>
          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select className="form-control" id="role">
              <option value="User">User</option>
              <option value="Admin">Admin</option>
            </select>
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

export default AddUserDialog;
