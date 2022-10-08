import { useState, useEffect } from "react";

export const useInitialData = (dataSource, loading) => {
  const [tableData, setTableData] = useState([]);
  const [tableDataLoading, setTableDataLoading] = useState(loading);

  useEffect(() => {
    const getData = async () => {
      setTableDataLoading(true);
      const { data } = await dataSource();
      setTableData(data);
      setTableDataLoading(false);
    };
    if (typeof dataSource === "function") {
      getData().catch((e) => {
        throw new Error("Problem fetching table data");
      });
    } else if (Array.isArray(dataSource)) {
      setTableData(dataSource);
    } else {
      throw new Error("Invalid table datasource");
    }
  }, [dataSource]);

  return [tableData, tableDataLoading];
};

export const useIndeterminateCheckbox = (checkboxRef, selected, total) => {
  useEffect(() => {
    if (!checkboxRef.current) return;
    if (selected.length && selected.length !== total) {
      checkboxRef.current.indeterminate = true;
    } else {
      checkboxRef.current.indeterminate = false;
    }
  }, [selected, total, checkboxRef]);
};
