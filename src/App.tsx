import React, { useEffect, useState } from "react";
import "./assets/index.scss";
import LawyerTable from "./components/LawyerTable";
import WarningMessage from "./components/WarningMessage";
import { Lawyer } from "./core/models/lawyer";

function App() {
  const [isCsv, setIsCsv] = useState<boolean>(true);
  const [lawyersList, setLawyersList] = useState<Lawyer[]>([]);

  useEffect(() => {
    for (const obj of lawyersList) {
      if (
        !obj.hasOwnProperty("full_name") ||
        !obj.hasOwnProperty("phone") ||
        !obj.hasOwnProperty("email")
      ) {
        setIsCsv(false);
      }
    }
  }, [lawyersList]);

  const isCSVFile = (file: File) => {
    setIsCsv(file.type === "text/csv");
  };

  const csvFileToArray = (str: string) => {
    const lines = str.split("\n");

    const headers = lines[0]
      .split(",")
      .map((header) => header.trim().toLowerCase().replace(/\s+/g, "_"));

    const array = lines.slice(1).map((line, index) => {
      const values = line.split(",");
      const obj: any = {};

      headers.forEach((header, columnIndex) => {
        let value = values[columnIndex];
        if (!isNaN(Number(value))) {
          value = String(value);
        }
        obj[header] = value?.trim();
      });

      obj.id = index + 1;
      obj.duplicate_with = "";

      return obj;
    });

    setLawyersList(array);
  };

  const csvToArray = (file: File) => {
    const fileReader = new FileReader();

    isCSVFile(file);

    if (file && isCsv) {
      fileReader.onload = function (event: ProgressEvent<FileReader>) {
        const text: any = event.target?.result;
        if (typeof text === "string") {
          csvFileToArray(text);
        }
      };

      fileReader.readAsText(file);
    }
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      csvToArray(selectedFile);
    }
  };

  return (
    <section className="container">
      <div className="import-btn">
        <label htmlFor="import" className="import-btn__click">
          Import users
          <input id="import" type="file" onChange={handleOnChange} />
        </label>
      </div>
      {isCsv ? (
        <LawyerTable
          lawyersList={lawyersList}
          setLawyersList={setLawyersList}
        />
      ) : (
        <WarningMessage />
      )}
    </section>
  );
}

export default App;
