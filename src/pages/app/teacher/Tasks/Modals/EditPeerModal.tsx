import { useFormik } from "formik";
import Modal from "../../../../../components/Modal/Modal";
import { useModal } from "../../../../../components/Modal/ModalProvider";
import { Input } from "../../../../../components/Inputs/TextInput";
import { Button } from "../../../../../components/Buttons";
import { Editor } from "../../../../../components/Inputs/Editor";
import { useDispatch, useSelector } from "react-redux";
import { setReload } from "../../../../../redux/slices/uiActions.slice";
import { fetchData, updateData } from "../../../../../Utils/fetch";
import { useEffect, useState } from "react";
import { GradingCriteria, PeerType } from "../../../../../types";
import ModalHeader from "../../../../../components/Modal/ModalHeader";
import { Typography } from "../../../../../components/Typography";
import EditContentSkeleton from "../../Content/Components/EditContentSkeleton";
import { RootState } from "../../../../../redux/store";

interface ModalComponentProps {
  modalId: string;
}

function EditPeerModal({ modalId }: ModalComponentProps) {
  const { hideModal, modalStates } = useModal();
  const peerId = modalStates[modalId]?.props?.peerId;
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [gradingCriteria, setGradingCriteria] = useState<GradingCriteria[]>([]);
  const { cohort } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const getPeerData = async () => {
      try {
        setLoading(true);
        const response = await fetchData<PeerType>(`/peer/${peerId}`);

        const peerData = response.data;

        setGradingCriteria(peerData?.gradingCriteria || []);

        setValues({
          topic: peerData?.topic || "",
          description: peerData?.description || "",
          instructions: peerData?.instructions || "",
        });
      } finally {
        setLoading(false);
      }
    };

    if (modalStates[modalId]?.isOpen) getPeerData();
  }, [peerId, modalStates[modalId]?.isOpen]);

  const {
    handleSubmit,
    isSubmitting,
    touched,
    values,
    resetForm,
    handleBlur,
    handleChange,
    setValues,
    errors,
  } = useFormik({
    initialValues: {
      topic: "",
      description: "",
      instructions: "",
    },
    validationSchema: null, // Add validation schema if needed
    onSubmit: () => submit(),
  });

  const submit = async () => {
    try {
      await updateData(`peer/${peerId}`, {
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
      { criteria: "", description: "", maxPoint: 0, gradingFields: [] },
    ]);
  };

  const updateGradingCriteria = (index: number, field: string, value: any) => {
    const updatedCriteria = [...gradingCriteria];
    updatedCriteria[index] = { ...updatedCriteria[index], [field]: value };
    setGradingCriteria(updatedCriteria);
  };

  const removeGradingCriteria = (index: number) => {
    const updatedCriteria = gradingCriteria.filter((_, i) => i !== index);
    setGradingCriteria(updatedCriteria);
  };

  const addGradingField = (criteriaIndex: number) => {
    const updatedCriteria = [...gradingCriteria];
    updatedCriteria[criteriaIndex].gradingFields.push({
      fieldName: "",
      grade: 0,
    });
    setGradingCriteria(updatedCriteria);
  };

  return (
    <Modal modalId={modalId}>
      <ModalHeader modalId={modalId}>
        <Typography variant="subheading">Edit Peer Assignment</Typography>
      </ModalHeader>
      <div className="w-full h-[550px] px-5 md:px-10 mt-10 overflow-visible md:w-[800px]">
        {loading ? (
          <EditContentSkeleton />
        ) : (
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
                        updateGradingCriteria(
                          index,
                          "maxPoint",
                          +e.target.value
                        )
                      }
                      label="Max Point"
                      placeholder="Enter max points"
                      type="number"
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
                              updateGradingCriteria(index, "gradingFields", [
                                ...criteria.gradingFields.slice(0, fieldIndex),
                                {
                                  ...field,
                                  fieldName: e.target.value,
                                },
                                ...criteria.gradingFields.slice(fieldIndex + 1),
                              ])
                            }
                            label="Grading Field"
                            type="text"
                          />
                        </div>
                        <div>
                          <Input
                            value={field.grade}
                            name={`gradingCriteria[${index}].gradingFields[${fieldIndex}].grade`}
                            onChange={(e) =>
                              updateGradingCriteria(index, "gradingFields", [
                                ...criteria.gradingFields.slice(0, fieldIndex),
                                {
                                  ...field,
                                  grade: +e.target.value,
                                },
                                ...criteria.gradingFields.slice(fieldIndex + 1),
                              ])
                            }
                            label="Grade"
                            type="number"
                          />
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addGradingField(index)}
                    >
                      Add Grading Field
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeGradingCriteria(index)}
                  >
                    Remove Grading Criteria
                  </button>
                </div>
              ))}
              <div className="w-[200px] mt-5">
                <Button type="button" onClick={addGradingCriteria}>
                  Add Grading Criteria
                </Button>
              </div>
            </div>

            <div className="pb-20 mt-10 w-full">
              <Button type="submit" disabled={isSubmitting} className="w-full">
                Save Changes
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
}

export default EditPeerModal;
