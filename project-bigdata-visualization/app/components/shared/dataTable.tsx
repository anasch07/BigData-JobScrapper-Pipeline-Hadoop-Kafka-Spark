import { CommonValuesByCountryDTO } from "@/models/commonValuesByCountry.model";
import { PersonDto } from "@/models/person.model";
import { useSocket } from "@/util/useSocket";
import { useMemo } from "react";
import DataTable, { createTheme } from "react-data-table-component";

const CustomDataTable = () => {
  const { data, countryData } = useSocket();

  const columns = useMemo(
    () => [
      {
        name: "Rank",
        selector: (row: PersonDto) => row.rank,
        sortable: true,
      },
      {
        name: "Name",
        selector: (row: PersonDto) => row.personName,
        sortable: true,
      },
      {
        name: "Worth",
        selector: (row: PersonDto) => row.finalWorth,
        sortable: true,
      },
      {
        name: "Age",
        selector: (row: PersonDto) => row.age,
        sortable: true,
      },
      {
        name: "Country",
        selector: (row: PersonDto) => row.country,
        sortable: true,
      },
      {
        name: "gender",
        selector: (row: PersonDto) => row.gender,
        sortable: true,
      },
    ],
    []
  );

  const columnsForCountryCommonValues = [
    {
      name: "Country",
      selector: (row: CommonValuesByCountryDTO) => row.country,
      sortable: true,
    },
    {
      name: "City",
      selector: (row: CommonValuesByCountryDTO) => row.city,
      sortable: true,
    },
    {
      name: "State",
      selector: (row: CommonValuesByCountryDTO) => row.city,
      sortable: true,
    },
    {
      name: "Self Made",
      selector: (row: CommonValuesByCountryDTO) => row.selfMade,
      sortable: true,
    },
    {
      name: "Source",
      selector: (row: CommonValuesByCountryDTO) => row.source,
      sortable: true,
    },
    {
      name: "Title",
      selector: (row: CommonValuesByCountryDTO) => row.title,
      sortable: true,
    },
    {
      name: "Organization",
      selector: (row: CommonValuesByCountryDTO) => row.organization,
      sortable: true,
    },
    {
      name: "Age",
      selector: (row: CommonValuesByCountryDTO) => row.age,
      sortable: true,
    },
    {
      name: "Category",
      selector: (row: CommonValuesByCountryDTO) => row.category,
      sortable: true,
    },
  ];
  createTheme(
    "solarized",
    {
      text: {
        primary: "rgb(156,163,175)",
        secondary: "rgb(156,163,175)",
      },
      background: {
        default: "transparent",
      },
      pagination: {
        text: "rgb(156,163,175)",
        button: { color: "rgb(156,163,175)" },
      },
      context: {
        background: "transparent",
        text: "rgb(156,163,175)",
      },
      divider: {
        default: "#e5e7eb",
      },
      action: {
        button: "rgba(0,0,0,.54)",
        hover: "rgba(0,0,0,.08)",
        disabled: "rgba(0,0,0,.12)",
      },
    },
    "dark"
  );

  const customStyle = {
    headCells: {
      style: {
        color: "rgb(51,65,85)",
        paddingLeft: 0,
        paddingRight: 0,
      },
    },
    cells: {
      style: {
        paddingLeft: 0,
        paddingRight: 0,
      },
    },
  };

  return (
    <div className="flex flex-col py-10">
      <div className="flex-1 flex flex-col">
        <p className="text-gray-400 text-xs font-normal">DataTable</p>
        <h1 className="text-2xl font-semibold text-slate-700">
          Most Common values per country
        </h1>
        <DataTable
          customStyles={customStyle}
          columns={columnsForCountryCommonValues}
          theme="solarized"
          pagination
          data={countryData?.slice(2)}
        />
      </div>
      <div>
        <p className="text-gray-400 text-xs font-normal">Ranks</p>
        <h1 className="text-2xl font-semibold text-slate-700">
          Billionaires Ranked
        </h1>
        <DataTable
          customStyles={customStyle}
          columns={columns}
          theme="solarized"
          pagination
          data={data?.slice(1).sort((a, b) => b.finalWorth - a.finalWorth)}
        />
      </div>
    </div>
  );
};

export default CustomDataTable;
