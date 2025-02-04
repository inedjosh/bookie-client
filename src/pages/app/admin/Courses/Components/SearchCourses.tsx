import React, { useState } from "react";
import SearchInput from "../../../../../components/Inputs/SearchInput";
import { fetchData } from "../../../../../Utils/fetch";
import { AxiosCourseType } from "../../../../../types";

type Props = {
  page: number;
  setData: (data: AxiosCourseType | null) => void;
};
function SearchCourses({ page, setData }: Props) {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetchData<AxiosCourseType>(
        `/admin/course/search?value=${value}&page=${page}`
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
          placeholder="Search courses by title"
          className=""
          onIconClick={submit}
          loading={loading}
        />
      </form>
    </div>
  );
}

export default SearchCourses;
