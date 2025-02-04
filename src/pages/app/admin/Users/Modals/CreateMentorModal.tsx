import { useFormik } from "formik";
import * as Yup from "yup";
import { Input } from "../../../../../components/Inputs/TextInput";
import Modal from "../../../../../components/Modal/Modal";
import { Button } from "../../../../../components/Buttons";
import { fetchData, postData } from "../../../../../Utils/fetch";
import { useModal } from "../../../../../components/Modal/ModalProvider";
import { useDispatch } from "react-redux";
import { setReload } from "../../../../../redux/slices/uiActions.slice";
import { useEffect, useState } from "react";
import { Typography } from "../../../../../components/Typography";
import { Editor } from "../../../../../components/Inputs/Editor";
import ModalHeader from "../../../../../components/Modal/ModalHeader";
import { CourseType } from "../../../../../types";
import EditContentSkeleton from "../../Content/Components/EditContentSkeleton";
import { SelectInput } from "../../../../../components/Inputs/SelectInput";

interface ModalComponentProps {
  modalId: string;
}

function CreateMentorModal({ modalId }: ModalComponentProps) {
  const { hideModal, modalStates } = useModal();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const [workHistory, setWorkHistory] = useState<
    { company: string; from: string; to: string; isCurrent: boolean }[]
  >([]);

  const [courseList, setCourseList] =
    useState<{ value: string; key: string }[]>();

  useEffect(() => {
    const getCourse = async () => {
      try {
        setLoading(true);
        const response = await fetchData<CourseType[]>(`/course`);

        const courseArr: { value: string; key: string }[] = [];

        if (response.data) {
          response.data.map((course: CourseType) =>
            courseArr.push({
              value: course._id,
              key: course.title,
            })
          );
          setCourseList(courseArr);
        }
      } finally {
        setLoading(false);
      }
    };

    if (modalStates[modalId]?.isOpen) getCourse();
  }, [modalStates[modalId]?.isOpen]);

  const addWorkHistory = () => {
    setWorkHistory([
      ...workHistory,
      { company: "", from: "", to: "", isCurrent: false },
    ]);
  };

  const handleWorkHistoryChange = (
    index: number,
    field: "company" | "from" | "to" | "isCurrent",
    value: string | boolean
  ) => {
    const updated = [...workHistory];
    updated[index][field] = value as never;
    if (field === "isCurrent" && value === true) {
      updated[index].to = "Present"; // Automatically set 'to' to 'Present'
    } else if (field === "isCurrent" && value === false) {
      updated[index].to = ""; // Clear 'to' field when 'isCurrent' is unchecked
    }
    setWorkHistory(updated);
  };

  const removeWorkHistory = (index: number) => {
    const updated = workHistory.filter((_, i) => i !== index);
    setWorkHistory(updated);
  };

  const {
    values,
    handleChange,
    handleBlur,
    touched,
    isSubmitting,
    resetForm,
    errors,
    handleSubmit,
  } = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      bio: "",
      phoneNumber: "",
      course: "",
      experience: 0,
      email: "",
      country: "",
    },
    validationSchema: Yup.object().shape({
      firstName: Yup.string().required("First Name is required"),
      email: Yup.string().required("Email is required"),
      lastName: Yup.string().required("Last Name is required"),
      course: Yup.string().required("Course is required"),
      bio: Yup.string().required("Bio is required"),
      phoneNumber: Yup.string().required("Phone Number is required"),
      experience: Yup.number().required("Experience is required"),
      country: Yup.number().required("Country is required"),
    }),
    onSubmit: async () => submit(),
  });

  const submit = async () => {
    try {
      const payload = {
        ...values,
        workHistory,
      };
      await postData("user/create-mentor", payload);
    } finally {
      resetForm();
      setWorkHistory([{ company: "", from: "", to: "", isCurrent: false }]);
      dispatch(setReload(true));
      hideModal(modalId);
    }
  };

  return (
    <Modal modalId={modalId} title="Create Mentor">
      <ModalHeader modalId={modalId}>
        <Typography variant="subheading">Create Mentor </Typography>
      </ModalHeader>
      <div className="w-full h-[500px] px-5 md:px-10 mt-10 overflow-visible md:w-[800px]">
        {loading ? (
          <EditContentSkeleton />
        ) : (
          <form onSubmit={handleSubmit} className="py-5">
            <div className="py-3">
              <Input
                value={values.email}
                label="Email"
                onChange={handleChange}
                name="email"
                touched={touched.email}
                handleBlur={handleBlur}
                error={errors.email}
                placeholder="Email"
                type="email"
              />
            </div>
            <div className="py-3">
              <Input
                value={values.firstName}
                label="First Name"
                onChange={handleChange}
                name="firstName"
                touched={touched.firstName}
                handleBlur={handleBlur}
                error={errors.firstName}
                placeholder="First Name"
                type="text"
              />
            </div>
            <div className="py-3">
              <Input
                value={values.lastName}
                label="Last Name"
                onChange={handleChange}
                name="lastName"
                touched={touched.lastName}
                handleBlur={handleBlur}
                error={errors.lastName}
                placeholder="Last Name"
                type="text"
              />
            </div>
            <div className="py-3">
              <Input
                value={values.country}
                label="Country"
                onChange={handleChange}
                name="lastName"
                touched={touched.country}
                handleBlur={handleBlur}
                error={errors.country}
                placeholder="Country"
                type="text"
              />
            </div>
            <div className="py-3">
              <Input
                value={values.experience}
                label="Experience"
                onChange={handleChange}
                name="experience"
                touched={touched.experience}
                handleBlur={handleBlur}
                error={errors.experience}
                placeholder="experience"
                type="number"
              />
            </div>

            <div className="py-3">
              <Editor
                value={values.bio}
                label="Bio"
                onChange={handleChange}
                name="bio"
                touched={touched.bio}
                onBlur={handleBlur}
                error={errors.bio}
                placeholder="Enter bio"
              />
            </div>
            <div className="py-2">
              <SelectInput
                value={values.course}
                name="course"
                handleBlur={handleBlur}
                error={errors.course}
                onChange={handleChange}
                label="Select Course"
                touched={touched.course}
                options={courseList}
              />
            </div>
            <div className="py-3">
              <Input
                value={values.phoneNumber}
                label="Phone Number"
                onChange={handleChange}
                name="phoneNumber"
                touched={touched.phoneNumber}
                handleBlur={handleBlur}
                error={errors.phoneNumber}
                placeholder="Phone Number"
                type="text"
              />
            </div>
            {/* Work History Section */}
            <div>
              <h3 className="font-bold mb-3">Work History</h3>
              {workHistory.map((work, index) => (
                <div key={index} className="py-3 border-b border-gray-300">
                  <div className="flex justify-end items-end w-full">
                    <Typography
                      variant="body"
                      color="destructive"
                      onClick={() => removeWorkHistory(index)}
                      className="mt-2"
                    >
                      Remove Work History
                    </Typography>
                  </div>
                  <Input
                    value={work.company}
                    label="Company"
                    onChange={(e) =>
                      handleWorkHistoryChange(index, "company", e.target.value)
                    }
                    placeholder="Enter company name"
                    type="text"
                  />
                  <Input
                    value={work.from}
                    label="From"
                    onChange={(e) =>
                      handleWorkHistoryChange(index, "from", e.target.value)
                    }
                    placeholder="Start date"
                    type="date"
                  />
                  {!work.isCurrent && (
                    <Input
                      value={work.to}
                      label="To"
                      onChange={(e) =>
                        handleWorkHistoryChange(index, "to", e.target.value)
                      }
                      placeholder="End date"
                      type="date"
                    />
                  )}
                  <div className="flex items-center mt-2">
                    <input
                      type="checkbox"
                      checked={work.isCurrent}
                      onChange={(e) =>
                        handleWorkHistoryChange(
                          index,
                          "isCurrent",
                          e.target.checked
                        )
                      }
                      id={`current-${index}`}
                    />
                    <label
                      htmlFor={`current-${index}`}
                      className="ml-2 text-sm text-gray-600"
                    >
                      Currently working here
                    </label>
                  </div>
                </div>
              ))}
              <div className="w-[200px]">
                <Button type="button" onClick={addWorkHistory} className="mt-5">
                  Add Work History
                </Button>
              </div>
            </div>
            <div className="pb-20 mt-20 w-full">
              <Button
                type="submit"
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                Create Mentor
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
}

export default CreateMentorModal;
