import { ChangeEventHandler, MouseEventHandler } from "react";
import ClipLoader from "react-spinners/ClipLoader";

type PlainInputType = {
  value?: string | number;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  name?: string;
  placeholder?: string;
  onIconClick: MouseEventHandler<HTMLButtonElement>;
  loading: boolean;
  className?: string;
};
const SearchInput = ({
  value,
  onChange,
  name,
  placeholder = "",
  onIconClick,
  loading,
  className,
}: PlainInputType) => {
  return (
    <div
      className={` border-[1.38px] bg-white h-[50px] rounded-[5px] w-full px-3  font-normal flex items-center space-x-3 ${className}`}
    >
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        name={name}
        className={`outline-none border-none bg-none placeholder:text-[#9199A3] w-full h-full`}
      />
      {loading ? (
        <ClipLoader color="#5b32e5" size="15px" />
      ) : (
        <button
          type="button"
          onClick={onIconClick}
          className="focus:outline-none"
        >
          <svg
            width="25"
            height="25"
            viewBox="0 0 25 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.1055 19.875C15.5237 19.875 19.1055 16.2933 19.1055 11.875C19.1055 7.45672 15.5237 3.875 11.1055 3.875C6.68719 3.875 3.10547 7.45672 3.10547 11.875C3.10547 16.2933 6.68719 19.875 11.1055 19.875Z"
              stroke="#B3B4B1"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M21.1039 21.8734L16.7539 17.5234"
              stroke="#B3B4B1"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default SearchInput;
