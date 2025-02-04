import React, { useState } from "react";
import SearchInput from "../../../../../components/Inputs/SearchInput";
import { fetchData } from "../../../../../Utils/fetch";
import { AxiosClassType } from "../../../../../types";

type Props = {
  page: number;
  setData: (data: AxiosClassType | null) => void;
  cohortId: string;
};
function SearchClass({ page, setData, cohortId }: Props) {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetchData<AxiosClassType>(
        `/class/${cohortId}/search?value=${value}&page=${page}`
      );
      setData(response.data || null);
      setValue("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-3 md:w-[400px] md:mt-0">
      <form onSubmit={submit}>
        <SearchInput
          value={value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setValue(e.target.value)
          }
          placeholder="Search class by week number"
          className=""
          onIconClick={submit}
          loading={loading}
        />
      </form>
    </div>
  );
}

export default SearchClass;
