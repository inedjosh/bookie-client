import AuthorDetailsModal from "../components/Modal/AuthorDetailsModal";
import BecomeAnAuthorModal from "../components/Modal/BecomeAnAuthorModal";
import BooDetailsModal from "../components/Modal/BookDetailsModal";
import EditBookModal from "../components/Modal/EditBookModal";
import FilterModal from "../components/Modal/FilterModal";
import { ModalProvider } from "../components/Modal/ModalProvider";
import PostABookModal from "../components/Modal/PostABookModal";

export enum MODAL_ID {
  BECOME_AN_AUTHOR_MODAL = "become_an_author_modal",
  FILTER = "filter",
  BOOK_MODAL = "book_modal",
  AUTHOR_MODAL = "author_modal",
  EDIT_BOOK = "edit_book",
  ADD_BOOK = "add_book",
}

const ModalLayout: React.FC<any> = ({ children }) => {
  return (
    <ModalProvider>
      <BecomeAnAuthorModal modalId={MODAL_ID.BECOME_AN_AUTHOR_MODAL} />
      <FilterModal modalId={MODAL_ID.FILTER} />
      <AuthorDetailsModal modalId={MODAL_ID.AUTHOR_MODAL} />
      <BooDetailsModal modalId={MODAL_ID.BOOK_MODAL} />
      <EditBookModal modalId={MODAL_ID.EDIT_BOOK} />
      <PostABookModal modalId={MODAL_ID.ADD_BOOK} />
      {children}
    </ModalProvider>
  );
};

export default ModalLayout;
