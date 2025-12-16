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
    <Modal show={show} onHide={onHide} aria-labelledby="filter-modal-title">
      <Modal.Header closeButton>
        <Modal.Title id="filter-modal-title">Filtruj wpisy</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <fieldset>
          <legend>
            <h2 className="h6">Zakres dat</h2>
          </legend>
          <div
            className="d-flex gap-1 pb-3 flex-wrap"
            role="group"
            aria-label="Predefiniowane zakresy dat"
          >
            {Object.entries(PREDEFINED_FILTERS).map(([key, value]) => (
              <Button
                key={key}
                variant="outline-primary"
                size="sm"
                onClick={() => {
                  setStartDate(value.startDate());
                  setEndDate(value.endDate());
                }}
                aria-label={`Ustaw zakres: ${value.label}`}
              >
                {value.label}
              </Button>
            ))}
          </div>
          <InputGroup className="mb-3">
            <InputGroup.Text
              as="label"
              htmlFor="filter-start-date"
              id="filter-start-label"
            >
              Od:
            </InputGroup.Text>
            <input
              type="date"
              className="form-control"
              id="filter-start-date"
              value={startDateStr}
              onChange={(e) => setStartDate(new Date(e.target.value))}
              aria-labelledby="filter-start-label"
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text
              as="label"
              htmlFor="filter-end-date"
              id="filter-end-label"
            >
              Do:
            </InputGroup.Text>
            <input
              type="date"
              className="form-control"
              id="filter-end-date"
              value={endDateStr}
              onChange={(e) => setEndDate(new Date(e.target.value))}
              aria-labelledby="filter-end-label"
            />
          </InputGroup>
        </fieldset>
        <fieldset className="pt-3">
          <legend>
            <h2 className="h6">Typy wpisów</h2>
          </legend>
          <div className="d-flex gap-1 pb-3 flex-wrap">
            <ToggleButtonGroup
              type="checkbox"
              value={types}
              onChange={setTypes}
              aria-label="Wybierz typy wpisów do filtrowania"
            >
              <ToggleButton
                id="tgl-standard"
                value={1}
                variant="outline-primary"
                aria-pressed={types.includes(1)}
              >
                Prace Standardowe
              </ToggleButton>
              <ToggleButton
                id="tgl-repair"
                value={2}
                variant="outline-primary"
                aria-pressed={types.includes(2)}
              >
                Prace naprawcze
              </ToggleButton>
            </ToggleButtonGroup>
          </div>
        </fieldset>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={onHide}
          aria-label="Zamknij okno filtrowania"
        >
          Zamknij
        </Button>
        <Button
          variant="primary"
          onClick={handleApplyFilters}
          aria-label="Zastosuj filtry"
        >
          Filtruj
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default FilterEntriesDialog;
