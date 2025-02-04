import { useFormik } from "formik";
import Modal from "../../../../../components/Modal/Modal";
import { useModal } from "../../../../../components/Modal/ModalProvider";
import { createContentSchema } from "../../../../../schema";
import { Input } from "../../../../../components/Inputs/TextInput";
import { SelectInput } from "../../../../../components/Inputs/SelectInput";
import { Button } from "../../../../../components/Buttons";
import { postData } from "../../../../../Utils/fetch";
import { Editor } from "../../../../../components/Inputs/Editor";
import { useDispatch } from "react-redux";
import { setReload } from "../../../../../redux/slices/uiActions.slice";

interface ModalComponentProps {
  modalId: string;
}

function CreateContentModal({ modalId }: ModalComponentProps) {
  const { hideModal } = useModal();

  const dispatch = useDispatch();

  const {
    handleSubmit,
    isSubmitting,

    touched,
    values,
    resetForm,
    handleBlur,
    handleChange,
    errors,
  } = useFormik({
    initialValues: {
      title: "",
      description: "",
      contentUrl: "",
      contentType: "",
    },
    validationSchema: createContentSchema,
    onSubmit: () => submit(),
  });

  const submit = async () => {
    try {
      await postData("course-content", values);
    } finally {
      resetForm();
      dispatch(setReload(true));
      hideModal(modalId);
    }
  };

  return (
    <Modal modalId={modalId} title="Create Content">
      <div className="w-full h-[700px] overflow-visible md:w-[500px]">
        <form onSubmit={handleSubmit}>
          <div className="py-2">
            <Input
              value={values.title}
              name="title"
              handleBlur={handleBlur}
              error={errors.title}
              onChange={handleChange}
              label="Course title"
              touched={touched.title}
              placeholder="Enter content title"
              type="text"
            />
          </div>
          <div className="py-2">
            <Input
              value={values.contentUrl}
              name="contentUrl"
              handleBlur={handleBlur}
              error={errors.contentUrl}
              onChange={handleChange}
              label="Content URL"
              touched={touched.contentUrl}
              placeholder="Enter content URL"
              type="text"
            />
          </div>
          <div className="py-2">
            <Editor
              value={values.description}
              name="description"
              error={errors.description}
              onChange={handleChange}
              label="Course description"
              touched={touched.description}
              placeholder="Enter course description"
              onBlur={handleBlur}
            />
          </div>

          <div className="py-2">
            <SelectInput
              value={values.contentType}
              name="contentType"
              handleBlur={handleBlur}
              error={errors.contentType}
              onChange={handleChange}
              label="Course category"
              touched={touched.contentType}
              options={[
                { key: "pdf", value: "PDF" },
                { key: "video", value: "VIDEO" },
                { key: "slide", value: "SLIDE" },
                { key: "audio", value: "AUDIO" },
                { key: "text", value: "TEXT" },
                { key: "image", value: "IMAGE" },
                { key: "article", value: "ARTICLE" },
                { key: "link", value: "LINK" },
                { key: "quiz", value: "QUIZ" },
                { key: "code", value: "CODE" },
                { key: "document", value: "DOCUMENT" },
                { key: "ebook", value: "EBOOK" },
                { key: "infographic", value: "INFOGRAPHIC" },
                { key: "spreadsheet", value: "SPREADSHEET" },
                { key: "animation", value: "ANIMATION" },
                { key: "other", value: "OTHER" },
              ]}
            />
          </div>

          <div className="pb-20 mt-10 w-full">
            <Button
              type="submit"
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              Create
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

export default CreateContentModal;
