// SlideInModal.tsx
import { FC, useEffect, useState } from "react";
import { useModal } from "./ModalProvider";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { Typography } from "../Typography";
import { Textarea } from "../Inputs/TextAreaInput";
import { useFormik } from "formik";
import * as yup from "yup";
import { Input } from "../Inputs/TextInput";
import { Button } from "../Buttons";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { MODAL_ID } from "../../Layouts/ModalLayouts";
import { useRequestError } from "../Hooks/useRequestError";
import { GENRES } from "../../contants";
import { toast } from "react-toastify";
import { GetAuthor } from "../../services/author.service";
import { useDispatch, useSelector } from "react-redux";
import CustomSelect from "../Inputs/SelectInput";
import UploadFile from "../Inputs/UploadInput";
import { uploadFileToFirebase } from "../../firebase";
import { DefaultImage } from "../../assets";
import { generateRandomDocumentName } from "../../Utils/Helpers";
import { EditBook } from "../../services/book.service";
import { setAuthor } from "../../redux/slices/author.slice";
import { RootState } from "../../redux/store";

interface ModalComponentProps {
  modalId: string;
}

type FormProps = {
  title: string;
  description: string;
  genre: string;
};

const schema = yup.object().shape({
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
  genre: yup.string().required("Genre is required"),
});

const EditBookModal: FC<ModalComponentProps> = ({ modalId }) => {
  const { user } = useSelector((state: RootState) => state.auth);

  const { modalStates, hideModal } = useModal();
  const isOpen = modalStates[modalId]?.isOpen;
  const { handleRequestError } = useRequestError({ useToast: true });
  const dispatch = useDispatch();

  const [imageUrl, setImageUrl] = useState<string>(DefaultImage);
  const [documentUrl, setDocumentUrl] = useState<string | null>(null);
  const [loadingImage, setLoadingImage] = useState<boolean>(false);
  const [loadingDoc, setLoadingDoc] = useState<boolean>(false);
  const [documentName, setDocumentName] = useState<string>("");
  const [documentError, setDocumentError] = useState<string>("");
  const [imageError, setImageError] = useState<string>("");
  const [editedForm, setEditedForm] = useState(false);

  const handleImageUpload = async (file: File) => {
    setLoadingImage(true);

    try {
      const url = await uploadFileToFirebase(file, "images");

      setImageUrl(url);
    } catch (error) {
    } finally {
      setLoadingImage(false);
    }
  };

  const handleDocumentUpload = async (file: File) => {
    setLoadingDoc(true);

    try {
      const url = await uploadFileToFirebase(file, "documents");
      setDocumentUrl(url);

      setDocumentName(generateRandomDocumentName());
    } catch (error) {
    } finally {
      setLoadingDoc(false);
    }
  };

  const {
    values,
    handleChange,
    handleBlur,
    isSubmitting,
    touched,
    errors,
    setValues,
    handleSubmit,
  } = useFormik({
    initialValues: {
      title: "",
      description: "",
      genre: "",
    },
    validationSchema: schema,
    onSubmit: async (values: FormProps) => {
      await submit(values);
      hideModal(modalId);
    },
  });

  useEffect(() => {
    setValues({
      ...values,
      title: modalStates?.edit_book?.props?.title,
      description: modalStates?.edit_book?.props?.description,
      genre: modalStates?.edit_book?.props?.genre,
    });
    setImageUrl(modalStates?.edit_book?.props?.book_image_url);
    setDocumentUrl(modalStates?.edit_book?.props?.book_url);
    setDocumentName(modalStates?.edit_book?.props?.title);
  }, [modalStates?.edit_book?.props]);

  useEffect(() => {
    const isEdited =
      values.title !== modalStates?.edit_book?.props?.title ||
      values.description !== modalStates?.edit_book?.props?.description ||
      values.genre !== modalStates?.edit_book?.props?.genre ||
      imageUrl !== modalStates?.edit_book?.props?.book_image_url ||
      documentUrl !== modalStates?.edit_book?.props?.book_url;

    setEditedForm(isEdited);
  }, [values, user, imageUrl, documentUrl]);

  if (!isOpen) return null;

  const submit = async (values: FormProps) => {
    try {
      if (!documentUrl) {
        setDocumentError("Please upload the book document");
      }
      if (!imageUrl) {
        setImageError("Please upload the book cover image");
      }
      setDocumentError("");
      setImageError("");

      const payload = {
        ...values,
        book_url: documentUrl as string,
        book_image_url: imageUrl,
      };
      await EditBook(payload, modalStates?.edit_book?.props?.id);

      const { data } = await GetAuthor(user?.id);

      dispatch(
        setAuthor({
          _id: data._id,
          user: {
            _id: data?.user?._id,
            email: data?.user?.email,
            first_name: data?.user?.first_name,
            last_name: data?.user?.last_name,
            username: data?.user?.username,
            profile_url: data?.user?.profile_url,
            role: data?.user?.role,
          },
          bio: data?.bio,
          pen_name: data?.pen_name,
          genres: data?.genres,
          rating: data?.rating,
          books: data?.books,
        })
      );

      toast.success("Book updated successfully");
      setValues({
        title: "",
        description: "",
        genre: "",
      });
      setImageUrl("");
      setDocumentUrl("");
    } catch (error) {
      handleRequestError(error);
    }
  };

  return (
    <Dialog
      open={isOpen}
      as="div"
      className="relative z-10 focus:outline-none"
      onClose={() => hideModal(MODAL_ID.EDIT_BOOK)}
    >
      <DialogBackdrop className="fixed inset-0 bg-black/70 w-full" />
      <div className="fixed inset-0 z-10 w-screen">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel
            transition
            className="w-full md:px-16 py-12 max-w-4xl h-[90vh] overflow-y-scroll bg-white shadow-md backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
          >
            <div className="flex p-5 justify-between">
              <Typography as="h5" variant="heading2">
                Edit book{" "}
              </Typography>
              <div
                className="cursor-pointer"
                onClick={() => hideModal(MODAL_ID.EDIT_BOOK)}
              >
                <IoIosCloseCircleOutline size="30px" />
              </div>
            </div>
            <form className="p-5" onSubmit={handleSubmit}>
              <div>
                <Typography as="p" variant="body" className="mb-2">
                  Upload book cover{" "}
                </Typography>
                <UploadFile
                  loadingImage={loadingImage}
                  type="image"
                  onUpload={handleImageUpload}
                  currentFile={imageUrl}
                />
                {imageError && (
                  <Typography variant="caption" color="destructive">
                    {imageError}
                  </Typography>
                )}
              </div>
              <div className="mt-5">
                <Input
                  value={values.title}
                  onChange={handleChange}
                  name="title"
                  onBlur={handleBlur}
                  error={errors.title}
                  touched={touched.title}
                  className="placeholder:text-xs"
                  placeholder="Enter title"
                  type="text"
                  label="Title"
                />
              </div>
              <div className="my-4 ">
                <CustomSelect
                  label="Genres"
                  onChange={handleChange}
                  name="genre"
                  touched={touched.genre}
                  error={errors.genre}
                  value={values.genre}
                  options={GENRES}
                />
              </div>
              <div className="my-4">
                <Typography as="label" className="text-sm">
                  Book Document{" "}
                </Typography>
                <UploadFile
                  loadingDocument={loadingDoc}
                  type="document"
                  documentName={documentName}
                  onUpload={handleDocumentUpload}
                />
                {documentError && (
                  <Typography variant="caption" color="destructive">
                    {documentError}
                  </Typography>
                )}
              </div>
              <div className="mt-5">
                <Textarea
                  value={values.description}
                  onChange={handleChange}
                  name="description"
                  onBlur={handleBlur}
                  error={errors.description}
                  touched={touched.description}
                  className="placeholder:text-xs"
                  placeholder="Enter description"
                  label="Description"
                />
              </div>
              <div className="mt-10">
                <Button
                  type="submit"
                  variant="default"
                  disabled={isSubmitting || !editedForm}
                  loading={isSubmitting}
                >
                  Update
                </Button>
              </div>
            </form>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default EditBookModal;
