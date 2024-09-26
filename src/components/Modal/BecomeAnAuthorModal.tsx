// SlideInModal.tsx
import { FC, useState } from "react";
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
import { BecomenAnAuthor } from "../../services/author.service";
import { GetUser } from "../../services/user.service";
import { useDispatch } from "react-redux";
import { signinUser } from "../../redux/slices/auth.slice";

interface ModalComponentProps {
  modalId: string;
}

type FormProps = {
  pen_name: string;
  bio: string;
};

const schema = yup.object().shape({
  pen_name: yup.string().required("Pen Name is required"),
  bio: yup.string().required("Bio is required"),
});

const BecomeAnAuthorModal: FC<ModalComponentProps> = ({ modalId }) => {
  const { modalStates, hideModal } = useModal();
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const isOpen = modalStates[modalId]?.isOpen;
  const { handleRequestError } = useRequestError({ useToast: true });
  const dispatch = useDispatch();

  const selectGenres = (genre: string) => {
    setSelectedGenres((prev) => {
      if (prev.includes(genre)) {
        return prev.filter((g) => g !== genre);
      } else {
        return [...prev, genre];
      }
    });
  };

  const {
    values,
    handleChange,
    handleBlur,
    isSubmitting,
    touched,
    errors,
    handleSubmit,
  } = useFormik({
    initialValues: {
      pen_name: "",
      bio: "",
    },
    validationSchema: schema,
    onSubmit: async (values: FormProps) => {
      await submit(values);
      hideModal(modalId);
    },
  });

  if (!isOpen) return null;

  const submit = async (values: FormProps) => {
    try {
      const author = await BecomenAnAuthor({
        ...values,
        genres: selectedGenres,
      });
      const user = await GetUser();

      dispatch(signinUser(user.data));

      console.log(author);
      toast.success("You are now an author");
    } catch (error) {
      handleRequestError(error);
    }
  };

  return (
    <Dialog
      open={isOpen}
      as="div"
      className="relative z-10 focus:outline-none"
      onClose={() => hideModal(modalId)}
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
                Become an author
              </Typography>
              <div
                className="cursor-pointer"
                onClick={() => hideModal(MODAL_ID.BECOME_AN_AUTHOR_MODAL)}
              >
                <IoIosCloseCircleOutline size="30px" />
              </div>
            </div>
            <form className="p-5" onSubmit={handleSubmit}>
              <div className="">
                <Input
                  value={values.pen_name}
                  onChange={handleChange}
                  name="pen_name"
                  onBlur={handleBlur}
                  error={errors.pen_name}
                  touched={touched.pen_name}
                  className="placeholder:text-xs"
                  placeholder="Enter your pen name"
                  type="text"
                  label="Pen Name"
                />
              </div>
              <div className="my-4 ">
                <Typography
                  variant="caption"
                  as="label"
                  className="font-medium text-sm"
                >
                  Select genres
                </Typography>

                <div className="flex flex-wrap">
                  {GENRES.map((genre) => (
                    <div
                      key={genre.key}
                      className={`border-input border p-2 w-fit m-1 rounded-full cursor-pointer ${
                        selectedGenres.includes(genre.value)
                          ? "bg-primary text-white"
                          : ""
                      }`}
                      onClick={() => selectGenres(genre.value)}
                    >
                      <Typography variant="caption">{genre.value}</Typography>
                    </div>
                  ))}
                </div>
              </div>
              <div className="my-4">
                <Textarea
                  value={values.bio}
                  className="placeholder:text-xs"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="bio"
                  error={errors.bio}
                  placeholder="Enter your bio"
                  label="Bio"
                  touched={touched.bio}
                />
              </div>
              <div className="mt-10">
                <Button
                  type="submit"
                  variant="default"
                  disabled={isSubmitting}
                  loading={isSubmitting}
                >
                  Submit
                </Button>
              </div>
            </form>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default BecomeAnAuthorModal;
