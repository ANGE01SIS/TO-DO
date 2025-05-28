import { useContext, useRef, useState } from "react";
import TasksContext from "./contexts/taskContext";
import { useAutoAnimate } from "@formkit/auto-animate/react";

export default function App() {
  const { tasks, dispatchTasks } = useContext(TasksContext);
  const [taskWantDelete, setTaskWantDelete] = useState(null);
  const [taskWantEdit, setTaskWantEdit] = useState(null);

  const [animationParent] = useAutoAnimate();
  const modalDelete = useRef(null);
  const modalEdit = useRef(null);

  const posibleStates = {
    pending: (
      <div className="bg-orange-500/30 w-fit border-orange-400 border-1 rounded-full px-2 py-1 flex items-center justify-center gap-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="17px"
          viewBox="0 -960 960 960"
          width="17px"
          fill="#fb923c"
        >
          <path d="M280-420q25 0 42.5-17.5T340-480q0-25-17.5-42.5T280-540q-25 0-42.5 17.5T220-480q0 25 17.5 42.5T280-420Zm200 0q25 0 42.5-17.5T540-480q0-25-17.5-42.5T480-540q-25 0-42.5 17.5T420-480q0 25 17.5 42.5T480-420Zm200 0q25 0 42.5-17.5T740-480q0-25-17.5-42.5T680-540q-25 0-42.5 17.5T620-480q0 25 17.5 42.5T680-420ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
        </svg>
        <span className="text-white text-xs">Pending</span>
      </div>
    ),
    failed: (
      <div className="bg-red-500/30 w-fit border-red-400 border-1 rounded-full px-2 py-1 flex items-center justify-center gap-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="17px"
          viewBox="0 -960 960 960"
          width="17px"
          fill="#f87171"
        >
          <path d="m336-280 144-144 144 144 56-56-144-144 144-144-56-56-144 144-144-144-56 56 144 144-144 144 56 56ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
        </svg>
        <span className="text-white text-xs">Failed</span>
      </div>
    ),
    success: (
      <div className="bg-green-500/30 w-fit border-green-400 border-1 rounded-full px-2 py-1 flex items-center justify-center gap-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="17px"
          viewBox="0 -960 960 960"
          width="17px"
          fill="#4ade80"
        >
          <path d="m424-296 282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
        </svg>
        <span className="text-white text-xs">Succes!</span>
      </div>
    ),
  };

  function handleCreate(e) {
    e.preventDefault();
    const form = new FormData(e.target);
    const taskTitle = form.get("name-task").trim();
    if (taskTitle === "") return;
    dispatchTasks({
      type: "ADD_TASK",
      payload: {
        title: taskTitle,
        status: "pending",
      },
    });
    e.target.reset();
  }
  function handleDelete(id) {
    dispatchTasks({
      type: "DELETE_TASK",
      payload: {
        id: id,
      },
    });
    modalDelete.current.close();
  }
  function openModalDelete(id) {
    modalDelete.current.showModal();
    setTaskWantDelete(id);
  }
  function openModalEdit(id) {
    modalEdit.current.showModal();
    setTaskWantEdit(id);
  }
  function handleEdit(e) {
    e.preventDefault();
    const form = new FormData(e.target);
    let newTitle = form.get("name-task-edit-module").trim() || null;
    const newStatus = form.get("status-task-edit-module");
    dispatchTasks({
      type: "EDIT_TASK",
      payload: {
        id: taskWantEdit,
        newTitle: newTitle,
        newStatus: newStatus,
      },
    });
    e.target.reset();
    modalEdit.current.close();
  }

  return (
    <main>
      <section className="flex justify-center my-15">
        <form className="flex gap-7" onSubmit={handleCreate}>
          <input
            className="bg-gray-900 shadow-inner shadow-gray-700/50 text-white rounded-full min-w-[50vw] px-5 py-3 outline-solid outline-sky-400/0 outline-1 focus:outline-sky-400 focus:shadow-sky-700/60 transition-colors lg:min-w-[35vw]"
            type="text"
            placeholder="Drink water...."
            name="name-task"
          />
          <button className="bg-sky-400 shadow-inner shadow-gray-700/50  text-white p-2 px-3 rounded-full hover:bg-sky-600 active:scale-90 transition cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#FFFFFF"
            >
              <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
            </svg>
          </button>
        </form>
      </section>
      <section className="overflow-scroll max-h-[75vh] mask-t-from-95% mask-b-from-95% ">
        <ul className="flex flex-col gap-3 items-center" ref={animationParent}>
          {tasks.map((task) => {
            return (
              <li
                className="bg-gray-900 min-w-[75vw] rounded-lg p-5 flex justify-between shadow-inner shadow-gray-700/50 md:min-w-[35vw]"
                key={task.id}
              >
                <section className="flex gap-3 flex-col">
                  <div>{posibleStates[task.status]}</div>
                  <h2 className="text-white text-3xl">{task.title}</h2>
                </section>

                <section className="min-h-full flex flex-col justify-between">
                  <div
                    className="cursor-pointer p-1 rounded-sm hover:bg-gray-800 active:scale-90 transition"
                    onClick={() => openModalEdit(task.id)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24px"
                      viewBox="0 -960 960 960"
                      width="24px"
                      fill="#FFFFFF"
                    >
                      <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z" />
                    </svg>
                  </div>
                  <div
                    className="cursor-pointer p-1 rounded-sm hover:bg-red-400/20 hover:outline-1 hover:outline-red-500  active:bg-red-400/20 active:outline-1 active:outline-red-500  active:scale-90 transition-transform group"
                    onClick={() => openModalDelete(task.id)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24px"
                      viewBox="0 -960 960 960"
                      width="24px"
                      fill="#FFFFFF"
                      className="group-hover:fill-red-500"
                    >
                      <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                    </svg>
                  </div>
                </section>
              </li>
            );
          })}
        </ul>
      </section>
      <dialog
        id="delete-modal"
        className="absolute -translate-1/2 top-1/2 left-1/2 py-10 px-20 rounded-xl bg-gray-900 shadow-inner shadow-gray-700/50  animate-zoom-in animate-duration-300 "
        ref={modalDelete}
      >
        <h2 className="text-white text-center text-3xl">¿Are you sure?</h2>
        <p className="text-gray-500/50 text-center mt-2">
          This action cannot be undone!
        </p>
        <div className="flex justify-center gap-5 mt-10 mb-5">
          <button
            className="cursor-pointer bg-red-400 p-2.5 rounded-lg outline outilne-2 outline-red-400/0 hover:bg-transparent  hover:outline-red-400/100 hover:text-white transition"
            onClick={() => handleDelete(taskWantDelete)}
          >
            Yes, Delete it!
          </button>
          <button
            className="cursor-pointer bg-green-400 p-2.5 rounded-lg outline outilne-2 outline-green-400/0 hover:bg-transparent  hover:outline-green-400/100 hover:text-white transition"
            onClick={() => modalDelete.current.close()}
          >
            No, Cancel!
          </button>
        </div>
      </dialog>
      <dialog
        id="delete-modal"
        className="absolute -translate-1/2 top-1/2 left-1/2 py-10 px-20 rounded-xl bg-gray-900 shadow-inner shadow-gray-700/50  animate-zoom-in animate-duration-300 "
        ref={modalEdit}
      >
        <h2 className="text-white text-center text-3xl">
          What do you want edit?
        </h2>
        <form
          className="flex flex-col items-start gap-5 mt-10 mb-5 w-full relative"
          onSubmit={handleEdit}
        >
          <label
            className="text-gray-500/50 text-center"
            htmlFor="name-task-edit-module"
          >
            Title
          </label>
          <input
            type="text"
            placeholder="Drink water...."
            name="name-task-edit-module"
            id="name-task-edit-module"
            className="bg-gray-900 shadow-inner shadow-gray-700/50 text-white rounded-full py-2 px-3 outline-solid outline-sky-400/0 outline-1 focus:outline-sky-400 focus:shadow-sky-700/60 transition-colors w-full"
          />
          <label
            className="text-gray-500/50 text-center"
            htmlFor="state-task-edit-module"
          >
            State
          </label>
          <select
            className="bg-sky-400/50 text-white rounded-full py-2 px-3 w-full"
            name="status-task-edit-module"
            id="state-task-edit-module"
          >
            <option value="pending">Pending</option>
            <option value="success">Success</option>
            <option value="failed">Failed</option>
          </select>
          <div className="flex justify-between w-full mt-10">
            <button
              type="submit"
              className="cursor-pointer bg-green-400 p-2.5 rounded-lg outline outilne-2 outline-green-400/0 hover:bg-transparent  hover:outline-green-400/100 hover:text-white transition"
            >
              Edit It!
            </button>
            <button
              type="submit"
              className="cursor-pointer bg-red-400 p-2.5 rounded-lg outline outilne-2 outline-red-400/0 hover:bg-transparent  hover:outline-red-400/100 hover:text-white transition"
              onClick={(e) => {
                e.preventDefault();
                modalEdit.current.close();
              }}
            >
              Cancel it!
            </button>
          </div>
        </form>
      </dialog>
    </main>
  );
}
