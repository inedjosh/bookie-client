import { Typography } from "./Typography";
import { useModal } from "./Modal/ModalProvider";
import { MODAL_ID } from "../Layouts/ModalLayouts";
import { truncateText } from "../Utils/Helpers";
import { Author } from "../redux/slices/author.slice";
type Props = {
  id: string;
  img: string;
  name: string;
  genres: string[];
  rating: number;
  bio: string;
  author: Author;
};

function AuthorCard({ id, img, name, bio, author }: Props) {
  const { showModal } = useModal();

  return (
    <div key={id} className="flex items-center justify-start  md:w-[310px] ">
      <div className="flex-[.5]">
        <img
          src={img}
          className="w-[120px] md:w-[120px] object-contain rounded-full"
        />
      </div>
      <div className="pl-2  flex flex-col  flex-[.5] ">
        <Typography as="h5" variant="subheading2">
          {name}
        </Typography>
        <Typography as="p" color="muted-alt" className="my-1 ">
          {truncateText(bio, 30)}
        </Typography>

        <div className="">
          <Typography
            as="p"
            variant="underlined"
            color="primary"
            onClick={() => showModal(MODAL_ID.AUTHOR_MODAL, { ...author })}
          >
            View Author
          </Typography>
        </div>
      </div>
    </div>
  );
}

export default AuthorCard;
