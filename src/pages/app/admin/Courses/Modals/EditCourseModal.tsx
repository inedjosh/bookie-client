import { useFormik } from "formik";
import Modal from "../../../../../components/Modal/Modal";
import { useModal } from "../../../../../components/Modal/ModalProvider";
import { useEffect, useState } from "react";
import { createCourseSchema } from "../../../../../schema";
import { Input } from "../../../../../components/Inputs/TextInput";
import { SelectInput } from "../../../../../components/Inputs/SelectInput";
import UploadFile from "../../../../../components/Inputs/UploadInput";
import { DefaultImage } from "../../../../../assets";
import { uploadFileToFirebase } from "../../../../../firebase";
import { Button } from "../../../../../components/Buttons";
import { fetchData, updateData } from "../../../../../Utils/fetch";
import { Editor } from "../../../../../components/Inputs/Editor";
import { CourseType } from "../../../../../types";
import EditCourseSkeleton from "../Components/EditCourseSkeleton";
import { useDispatch } from "react-redux";
import { setReload } from "../../../../../redux/slices/uiActions.slice";

interface ModalComponentProps {
  modalId: string;
}

function EditCourseModal({ modalId }: ModalComponentProps) {
  const { hideModal } = useModal();
  const dispatch = useDispatch();
  const { modalStates } = useModal();
  const statesData = modalStates[modalId]?.props;
  const [imageUrl, setImageUrl] = useState<string>(DefaultImage);
  const [loadingImage, setLoadingImage] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState<CourseType | null>(null);

  useEffect(() => {
    const getCourse = async () => {
      try {
        setLoading(true);
        const response = await fetchData<CourseType>(
          `/course/${statesData?.courseId}`
        );

        setCourse(response.data);
      } finally {
        setLoading(false);
      }
    };

    if (modalStates[modalId]?.isOpen) getCourse();
  }, [statesData?.courseId, modalStates[modalId]?.isOpen]);

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
    handleBlur,
    resetForm,
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

  useEffect(() => {
    if (course) {
      setValues({
        title: course.title,
        courseCode: course.courseCode,
        description: course.description,
        durationInMonths: course.durationInMonths,
        category: course.category,
        price: course.price,
        thumbnail: course.thumbnail,
      });
      setImageUrl(course.thumbnail);
    }
  }, [course]);

  const submit = async () => {
    try {
      await updateData(`/course/${statesData?.courseId}`, values);
    } finally {
      resetForm();
      dispatch(setReload(true));
      hideModal(modalId);
    }
  };

  return (
    <Modal modalId={modalId} title="Update Course">
      <div className="w-full h-[700px] overflow-visible md:w-[500px]">
        {loading ? (
          <EditCourseSkeleton />
        ) : (
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
                  { value: "coding", key: "Coding" },
                  { value: "design", key: "Design" },
                  { value: "gaming", key: "Gaming" },
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
                Update{" "}
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
}

export default EditCourseModal;
