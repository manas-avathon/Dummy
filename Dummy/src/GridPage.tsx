import { AgGridReact } from "ag-grid-react";
import { useCallback, useEffect, useState } from "react";

// import 'ag-grid-community/styles/ag-grid.css';
// import 'ag-grid-community/styles/ag-theme-alpine.css';
import type { ColDef } from "ag-grid-community";

interface RawCountryApiItem {
  name: {
    common: string;
    official: string;
  };

  flags: {
    png: string;
    svg: string;
  };
}

interface TableCountryData {
  countryName: string;
  officialName: string;
  flagURL:string;
}

const GridPage: React.FC = () => {
  const [rowData, setRowData] = useState<TableCountryData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [colDefs] = useState<ColDef<TableCountryData>[]>([
    { field: "countryName", headerName: "Country Name" },
    { field: "officialName", headerName: "Official Name" },
    { field: "flagURL", headerName: "Flag"},
  ]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "https://restcountries.com/v3.1/all?fields=name,flags"
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status : ${response.status}`);
      }

      const apiData: RawCountryApiItem[] = await response.json();

      const transformedData: TableCountryData[] = apiData.map(
        (country: RawCountryApiItem) => ({
          countryName: country.name?.common || "N/A",
          officialName: country.name?.official || "N/A",
          flagURL: country.flags?.png || "N/A",
        })
      );

      console.log("Transformed Data (for AG Grid):", transformedData);
      setRowData(transformedData);
    } catch (err: unknown) {
      console.log("Failed to fetch data : ", err);
      if (err instanceof Error) {
        setError(err.message || "Unknown error occured");
      } else {
        setError("An unexpected error occured.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  },);

  if (loading) {
    return (
      <div className="p-8 text-center text-3xl text-blue-600">
        <p>Data Loading....</p>
        <div className="mt-4 animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-600">
        <h2 className="text-2xl font-bold">Error in loading data</h2>
        <p className="text-lg mt-2">{error}</p>
        <button
          onClick={fetchData}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className=" text-center text-4xl font-bold text-gray-800 mb-8">
        Country Data
      </h1>
      <div
        className="ag-theme-alpine h-[500px] w-full"
        style={{ height: 500, width: "100%" }}
      >
        <AgGridReact
          rowData={rowData}
          columnDefs={colDefs}
          animateRows={true}
          rowSelection="multiple"
          pagination={true}
          paginationPageSize={20}
        />
      </div>
    </div>
  );
};

export default GridPage;
