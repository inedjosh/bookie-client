import { useFormik } from "formik";
import Modal from "../../../../../components/Modal/Modal";
import { useModal } from "../../../../../components/Modal/ModalProvider";
import { useState } from "react";
import { createCourseSchema } from "../../../../../schema";
import { Input } from "../../../../../components/Inputs/TextInput";
import { SelectInput } from "../../../../../components/Inputs/SelectInput";
import UploadFile from "../../../../../components/Inputs/UploadInput";
import { DefaultImage } from "../../../../../assets";
import { uploadFileToFirebase } from "../../../../../firebase";
import { Button } from "../../../../../components/Buttons";
import { postData } from "../../../../../Utils/fetch";
import { Editor } from "../../../../../components/Inputs/Editor";
import { useDispatch } from "react-redux";
import { setReload } from "../../../../../redux/slices/uiActions.slice";

interface ModalComponentProps {
  modalId: string;
}

function CreateCourseModal({ modalId }: ModalComponentProps) {
  const { hideModal } = useModal();

  const [imageUrl, setImageUrl] = useState<string>(DefaultImage);
  const [loadingImage, setLoadingImage] = useState<boolean>(false);
  const dispatch = useDispatch();

  const handleImageUpload = async (file: File) => {
    setLoadingImage(true);

    try {
      const url = await uploadFileToFirebase(file, "images");

      setImageUrl(url);
      setValues({ ...values, thumbnail: url });
    } finally {
      setLoadingImage(false);
    }
  };

  const {
    handleSubmit,
    isSubmitting,
    setValues,
    touched,
    values,
    resetForm,
    handleBlur,
    handleChange,
    errors,
  } = useFormik({
    initialValues: {
      title: "",
      courseCode: "",
      description: "",
      durationInMonths: 1,
      category: "",
      price: 0,
      thumbnail: "",
    },
    validationSchema: createCourseSchema,
    onSubmit: () => submit(),
  });

  const submit = async () => {
    try {
      await postData("course", values);
    } finally {
      resetForm();
      dispatch(setReload(true));
      hideModal(modalId);
    }
  };

  return (
    <Modal modalId={modalId} title="Create Course">
      <div className="w-full h-[700px] overflow-visible md:w-[500px]">
        <form onSubmit={handleSubmit}>
          <div className="py-2">
            <label className="mb-2 block text-sm font-medium text-[#1f1f1f]">
              Course thumbnail
            </label>
            <UploadFile
              loadingImage={loadingImage}
              type="image"
              onUpload={handleImageUpload}
              currentFile={imageUrl}
            />
          </div>
          <div className="py-2">
            <Input
              value={values.title}
              name="title"
              handleBlur={handleBlur}
              error={errors.title}
              onChange={handleChange}
              label="Course title"
              touched={touched.title}
              placeholder="Enter course title"
              type="text"
            />
          </div>
          <div className="py-2">
            <Input
              value={values.courseCode}
              name="courseCode"
              handleBlur={handleBlur}
              error={errors.courseCode}
              onChange={handleChange}
              label="Course code"
              touched={touched.courseCode}
              placeholder="Enter course code"
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
            <Input
              value={values.durationInMonths}
              name="durationInMonths"
              handleBlur={handleBlur}
              error={errors.durationInMonths}
              onChange={handleChange}
              label="Duration in months"
              touched={touched.durationInMonths}
              placeholder="5"
              type="number"
            />
          </div>
          <div className="py-2">
            <SelectInput
              value={values.category}
              name="category"
              handleBlur={handleBlur}
              error={errors.category}
              onChange={handleChange}
              label="Course category"
              touched={touched.category}
              options={[
                { value: "Front End Development", key: "front_end_dev" },
                { value: "Back End Development", key: "back_end_dev" },
                { value: "UI/UX", key: "ui" },
                { value: "Data Analytics", key: "data_analytics" },
                { value: "Cyber Security", key: "cyber_security" },
              ]}
            />
          </div>
          <div className="py-2">
            <Input
              value={values.price}
              name="price"
              handleBlur={handleBlur}
              error={errors.price}
              onChange={handleChange}
              label="Course price"
              touched={touched.price}
              placeholder="Amount"
              type="number"
            />
          </div>
          <div className="pb-20 mt-10 w-full">
            <Button
              type="submit"
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              Create{" "}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

export default CreateCourseModal;
