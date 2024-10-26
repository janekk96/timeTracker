import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { saveAs } from "file-saver";
import { Button } from "react-bootstrap";
import * as XLSX from "xlsx";

export interface ExportTableToExcelProps {
  tableData: unknown[];
  fileName: string;
}

const ExportTableToExcel = ({
  tableData,
  fileName,
}: ExportTableToExcelProps) => {
  // Function to export the data to an Excel file
  const exportToExcel = () => {
    // Create a new workbook and a worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(tableData); // Convert JSON data to worksheet

    // Append the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    // Generate a Blob from the workbook
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });

    // Save the Excel file
    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(data, fileName + ".xlsx");
  };

  return (
    <Button onClick={exportToExcel}>
      <FontAwesomeIcon icon={faDownload} />
    </Button>
  );
};

export default ExportTableToExcel;
