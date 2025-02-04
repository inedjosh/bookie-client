import { useFormik } from "formik";
import Modal from "../../../../../components/Modal/Modal";
import { useModal } from "../../../../../components/Modal/ModalProvider";
import { Input } from "../../../../../components/Inputs/TextInput";
import { Button } from "../../../../../components/Buttons";
import { Editor } from "../../../../../components/Inputs/Editor";
import { useDispatch, useSelector } from "react-redux";
import { setReload } from "../../../../../redux/slices/uiActions.slice";
import { postData } from "../../../../../Utils/fetch";
import { useState } from "react";
import ModalHeader from "../../../../../components/Modal/ModalHeader";
import { Typography } from "../../../../../components/Typography";
import { RootState } from "../../../../../redux/store";

interface ModalComponentProps {
  modalId: string;
}

function CreateNewPeerModal({ modalId }: ModalComponentProps) {
  const { hideModal } = useModal();
  const dispatch = useDispatch();
  const { cohort } = useSelector((state: RootState) => state.auth);

  const [gradingCriteria, setGradingCriteria] = useState<
    {
      criteria: string;
      maxPoint: number;
      description: string;
      gradingFields: {
        fieldName: string;
        grade: number;
      }[];
    }[]
  >([]);

  const {
    handleSubmit,
    isSubmitting,
    touched,
    values,
    resetForm,
    handleBlur,
    handleChange,
    setFieldValue,
    errors,
  } = useFormik({
    initialValues: {
      topic: "",
      description: "",
      course: "",
      instructions: "",
      gradingCriteria: [],
    },
    validationSchema: null, // Add validation schema if needed
    onSubmit: () => submit(),
  });

  const submit = async () => {
    try {
      await postData(`peer`, {
        ...values,
        gradingCriteria,
        course: cohort?.course._id,
      });
    } finally {
      resetForm();
      dispatch(setReload(true));
      hideModal(modalId);
    }
  };

  const addGradingCriteria = () => {
    setGradingCriteria([
      ...gradingCriteria,
      {
        criteria: "",
        maxPoint: 0,
        description: "",
        gradingFields: [
          {
            fieldName: "",
            grade: 0,
          },
        ],
      },
    ]);
  };

  const updateGradingCriteria = (index: number, field: string, value: any) => {
    const updatedCriteria = [...gradingCriteria];
    updatedCriteria[index] = { ...updatedCriteria[index], [field]: value };
    setGradingCriteria(updatedCriteria);
    setFieldValue("gradingCriteria", updatedCriteria);
  };

  const updateGradingField = (
    criteriaIndex: number,
    fieldIndex: number,
    field: string,
    value: any
  ) => {
    const updatedCriteria = [...gradingCriteria];
    updatedCriteria[criteriaIndex].gradingFields[fieldIndex] = {
      ...updatedCriteria[criteriaIndex].gradingFields[fieldIndex],
      [field]: value,
    };
    setGradingCriteria(updatedCriteria);
    setFieldValue("gradingCriteria", updatedCriteria);
  };

  // const removeGradingCriteria = (index: number) => {
  //   const updatedCriteria = gradingCriteria.filter((_, i) => i !== index);
  //   setGradingCriteria(updatedCriteria);
  //   setFieldValue("gradingCriteria", updatedCriteria);
  // };

  const addGradingField = (criteriaIndex: number) => {
    const updatedCriteria = [...gradingCriteria];
    updatedCriteria[criteriaIndex].gradingFields.push({
      fieldName: "",
      grade: 0,
    });
    setGradingCriteria(updatedCriteria);
    setFieldValue("gradingCriteria", updatedCriteria);
  };

  return (
    <Modal modalId={modalId}>
      <ModalHeader modalId={modalId}>
        <Typography variant="subheading">Create Peer Assignment</Typography>
      </ModalHeader>
      <div className="w-full h-[550px] px-5 md:px-10 mt-10 overflow-visible md:w-[800px]">
        <form onSubmit={handleSubmit}>
          <div className="py-2">
            <Input
              value={values.topic}
              name="topic"
              handleBlur={handleBlur}
              error={errors.topic}
              onChange={handleChange}
              label="Topic"
              touched={touched.topic}
              placeholder="Enter topic"
              type="text"
            />
          </div>

          <div className="py-2">
            <Editor
              value={values.description}
              name="description"
              error={errors.description}
              onChange={handleChange}
              label="Description"
              touched={touched.description}
              placeholder="Enter description"
              onBlur={handleBlur}
            />
          </div>

          <div className="py-2">
            <Editor
              value={values.instructions}
              name="instructions"
              error={errors.instructions}
              onChange={handleChange}
              label="Instructions"
              touched={touched.instructions}
              placeholder="Enter instructions"
              onBlur={handleBlur}
            />
          </div>

          {/* Grading Criteria Section */}
          <div className="py-2">
            {gradingCriteria.map((criteria, index) => (
              <div key={index} className="flex my-2 space-x-2 items-center">
                <div className="w-[50%]">
                  <Input
                    value={criteria.criteria}
                    name={`gradingCriteria[${index}].criteria`}
                    onChange={(e) =>
                      updateGradingCriteria(index, "criteria", e.target.value)
                    }
                    label="Grading Criteria"
                    placeholder="Enter criteria"
                    type="text"
                  />
                </div>
                <div>
                  <Input
                    value={criteria.maxPoint}
                    name={`gradingCriteria[${index}].maxPoint`}
                    onChange={(e) =>
                      updateGradingCriteria(index, "maxPoint", +e.target.value)
                    }
                    label="Max Point"
                    placeholder="Enter max points"
                    type="number"
                  />
                </div>
                <div>
                  <Input
                    value={criteria.description}
                    name={`gradingCriteria[${index}].description`}
                    onChange={(e) =>
                      updateGradingCriteria(
                        index,
                        "description",
                        e.target.value
                      )
                    }
                    label="Criteria Description"
                    placeholder="Enter description"
                    type="text"
                  />
                </div>

                {/* Grading Fields */}
                <div>
                  {criteria.gradingFields.map((field, fieldIndex) => (
                    <div
                      key={fieldIndex}
                      className="flex items-center space-x-2 my-2"
                    >
                      <div className="w-[50%]">
                        <Input
                          value={field.fieldName}
                          name={`gradingCriteria[${index}].gradingFields[${fieldIndex}].fieldName`}
                          onChange={(e) =>
                            updateGradingField(
                              index,
                              fieldIndex,
                              "fieldName",
                              e.target.value
                            )
                          }
                          label="Field Name"
                          placeholder="Enter field name"
                          type="text"
                        />
                      </div>

                      <div>
                        <Input
                          value={field.grade}
                          name={`gradingCriteria[${index}].gradingFields[${fieldIndex}].grade`}
                          onChange={(e) =>
                            updateGradingField(
                              index,
                              fieldIndex,
                              "grade",
                              +e.target.value
                            )
                          }
                          label={`Grade for ${field.fieldName}`}
                          type="number"
                          placeholder="Grade (0-10)"
                        />
                      </div>
                    </div>
                  ))}
                  <button type="button" onClick={() => addGradingField(index)}>
                    Add Field
                  </button>
                </div>
              </div>
            ))}
            <div className="w-[200px] mt-5">
              <Button type="button" onClick={addGradingCriteria}>
                Add Criteria
              </Button>
            </div>
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

export default CreateNewPeerModal;
