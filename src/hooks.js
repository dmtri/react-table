import { useEffect } from "react";

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
