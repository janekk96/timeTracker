import {
  Button,
  InputGroup,
  Modal,
  ToggleButton,
  ToggleButtonGroup,
} from "react-bootstrap";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import moment from "moment";
import { PREDEFINED_FILTERS } from "../../consts/WorkTimeFilters";
import { Filter } from "../../Pages/User";

export interface FilterEntriesDialogProps {
  show: boolean;
  onHide: () => void;
  activeFilters: Filter;
  applyFilters: Dispatch<SetStateAction<Filter>>;
}

function FilterEntriesDialog({
  show,
  onHide,
  activeFilters,
  applyFilters,
}: FilterEntriesDialogProps) {
  const [startDate, setStartDate] = useState<Date>(
    new Date(activeFilters.from)
  );
  const [endDate, setEndDate] = useState<Date>(new Date(activeFilters.to));
  const [types, setTypes] = useState<number[]>(activeFilters.types);

  const handleApplyFilters = () => {
    applyFilters({
      from: moment(startDate).format("YYYY-MM-DD"),
      to: moment(endDate).add(1, "day").format("YYYY-MM-DD"),
      types: types,
    });
    onHide();
  };

  const { startDateStr, endDateStr } = useMemo(() => {
    return {
      startDateStr: moment(startDate).format("YYYY-MM-DD") || "",
      endDateStr: moment(endDate).format("YYYY-MM-DD") || "",
    };
  }, [startDate, endDate]);
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Filtruj wpisy</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h6>Zakres dat</h6>
        <div className="d-flex gap-1 pb-3 flex-wrap">
          {Object.entries(PREDEFINED_FILTERS).map(([key, value]) => (
            <Button
              key={key}
              variant="outline-primary"
              size="sm"
              onClick={() => {
                setStartDate(value.startDate());
                setEndDate(value.endDate());
              }}
            >
              {value.label}
            </Button>
          ))}
        </div>
        <InputGroup className="mb-3">
          <InputGroup.Text id="basic-addon1">Od:</InputGroup.Text>
          <input
            type="date"
            className="form-control"
            value={startDateStr}
            onChange={(e) => setStartDate(new Date(e.target.value))}
          />
        </InputGroup>
        <InputGroup className="mb-3">
          <InputGroup.Text id="basic-addon1">Do:</InputGroup.Text>
          <input
            type="date"
            className="form-control"
            value={endDateStr}
            onChange={(e) => setEndDate(new Date(e.target.value))}
          />
        </InputGroup>
        <div className="pt-3">
          <h6>Typy wpisów</h6>
          <div className="d-flex gap-1 pb-3 flex-wrap">
            <ToggleButtonGroup
              type="checkbox"
              value={types}
              onChange={setTypes}
            >
              <ToggleButton id="tgl-1" value={1} variant="outline-primary">
                Prace Standardowe
              </ToggleButton>
              <ToggleButton id="tgl-2" value={2} variant="outline-primary">
                Prace naprawcze
              </ToggleButton>
            </ToggleButtonGroup>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Zamknij
        </Button>
        <Button variant="primary" onClick={handleApplyFilters}>
          Filtruj
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default FilterEntriesDialog;
