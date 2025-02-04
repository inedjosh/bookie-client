import { useState } from "react";
import Container from "../../../../components/Container";

import { TASK_TYPES } from "../../../../constants";
import TaskActions from "./Components/TaskActions";
import TaskDiv from "./Components/TaskDiv";
import QuizDiv from "./Components/QuizDiv";
import AssignmentDiv from "./Components/AssignmentDiv";
import PeerDiv from "./Components/PeerDiv";

function TeacherTasks() {
  const [taskType, setTaskType] = useState(TASK_TYPES.TASK);

  return (
    <Container>
      <TaskActions
        setTask={(classType: TASK_TYPES) => setTaskType(classType)}
      />
      {taskType === TASK_TYPES.TASK ? <TaskDiv /> : null}
      {taskType === TASK_TYPES.QUIZ ? <QuizDiv /> : null}
      {taskType === TASK_TYPES.ASSIGNMENT ? <AssignmentDiv /> : null}
      {taskType === TASK_TYPES.PEER ? <PeerDiv /> : null}
    </Container>
  );
}
export default TeacherTasks;
