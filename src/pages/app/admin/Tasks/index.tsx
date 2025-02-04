import { useState } from "react";
import Container from "../../../../components/Container";
import { TASK_TYPES } from "../../../../constants";
import TaskActions from "../../teacher/Tasks/Components/TaskActions";
import TaskDiv from "./Components/TaskDiv";
import AssignmentDiv from "./Components/AssignmnentDiv";
import QuizDiv from "./Components/QuizDiv";

function Tasks() {
  const [taskType, setTaskType] = useState(TASK_TYPES.TASK);

  return (
    <Container className="">
      <TaskActions
        setTask={(classType: TASK_TYPES) => setTaskType(classType)}
      />
      {taskType === TASK_TYPES.TASK ? <TaskDiv /> : null}
      {taskType === TASK_TYPES.QUIZ ? <QuizDiv /> : null}
      {taskType === TASK_TYPES.ASSIGNMENT ? <AssignmentDiv /> : null}
    </Container>
  );
}
export default Tasks;
