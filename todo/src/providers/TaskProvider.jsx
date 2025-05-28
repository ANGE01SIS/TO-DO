import { useReducer } from "react";
import TasksContext from "../contexts/taskContext";
import { v4 as uuidv4 } from "uuid";
function reducer(state, action) {
  switch (action.type) {
    case "ADD_TASK": {
      action.payload.id = uuidv4();
      const newState = [...state, action.payload];
      localStorage.setItem("tasks", JSON.stringify(newState));
      return newState;
    }
    case "DELETE_TASK": {
      const newState = state.filter((task) => task.id !== action.payload.id);
      localStorage.setItem("tasks", JSON.stringify(newState));
      return newState;
    }
    case "EDIT_TASK": {
      const newState = state.map((task) =>
        task.id === action.payload.id
          ? {
              ...task,
              title: action.payload.newTitle || task.title,
              status: action.payload.newStatus,
            }
          : task
      );
      localStorage.setItem("tasks", JSON.stringify(newState));
      return newState;
    }

    default:
      return state;
  }
}
function getInitialState() {
  const tasks = localStorage.getItem("tasks");
  return tasks ? JSON.parse(tasks) : [];
}

export default function TaskProvider({ children }) {
  const [tasks, dispatchTasks] = useReducer(reducer, [], getInitialState);
  return (
    <TasksContext.Provider value={{ tasks, dispatchTasks }}>
      {children}
    </TasksContext.Provider>
  );
}
