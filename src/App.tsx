import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./calendar.css"; // Custom CSS for dark mode calendar

const App: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [tasks, setTasks] = useState<Record<string, string[]>>(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : {};
  });

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const taskInput = (e.currentTarget.elements.namedItem("task") as HTMLInputElement).value;

    if (taskInput.trim() === "") return;

    const dateKey = selectedDate.toDateString();
    setTasks((prevTasks) => {
      const updatedTasks = { ...prevTasks };
      if (!updatedTasks[dateKey]) updatedTasks[dateKey] = [];
      if (!updatedTasks[dateKey].includes(taskInput)) {
        updatedTasks[dateKey].push(taskInput);
      }
      return updatedTasks;
    });

    (e.currentTarget.elements.namedItem("task") as HTMLInputElement).value = "";
  };

  const deleteTask = (taskToDelete: string) => {
    const dateKey = selectedDate.toDateString();
    setTasks((prevTasks) => {
      const updatedTasks = { ...prevTasks };
      if (updatedTasks[dateKey]) {
        updatedTasks[dateKey] = updatedTasks[dateKey].filter((task) => task !== taskToDelete);
        if (updatedTasks[dateKey].length === 0) {
          delete updatedTasks[dateKey];
        }
      }
      return updatedTasks;
    });
  };

  const getTasksForDate = (date: Date) => tasks[date.toDateString()] || [];

  const formattedDate = selectedDate.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const onChange = (date: Date) => {
    setSelectedDate(date);
    console.log(date); // Log the selected date
  };
  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 text-gray-100 p-4">
      <h2 className="text-2xl sm:text-3xl font-bold mb-4">Yet Another To-Do</h2>
      <div className="bg-gray-800 p-4 rounded shadow-md max-w-full sm:max-w-md">
        <Calendar
          className="react-calendar custom-calendar"
          onClickDay={onChange} 

          value={selectedDate}
          tileClassName={({ date, view }) => {
            if (view === "month") {
              if (date.toDateString() === new Date().toDateString()) {
                return "today-date";
              }
              if (tasks[date.toDateString()]) {
                return "task-date";
              }
            }
            return "";
          }}
        />
      </div>
      <h3 className="text-xl sm:text-2xl font-semibold mt-4">Tasks for: {formattedDate}</h3>
      <ul className="mt-2 space-y-2 max-h-80 overflow-y-auto">
        {getTasksForDate(selectedDate).map((task, index) => (
          <li
            key={index}
            className="bg-gray-700 px-4 py-2 rounded shadow flex justify-between items-center"
          >
            <span>{task}</span>
            <i
              onClick={() => deleteTask(task)}
              className="ml-4 ri-delete-bin-5-fill cursor-pointer text-gray-900 text-2xl hover:text-red-800"
            ></i>
          </li>
        ))}
      </ul>
      <form onSubmit={addTask} className="mt-4 items-center">
        <input
          type="text"
          name="task"
          placeholder="Add a task"
          required
          className="px-4 py-2 rounded shadow w-full sm:w-64 bg-gray-800 text-gray-100 focus:outline-none focus:ring focus:ring-blue-500"
        />
        <button
          type="submit"
          className="mt-2 px-4 py-2 w-full sm:w-auto bg-blue-600 text-white rounded shadow hover:bg-blue-500"
        >
          Add
        </button>
      </form>
    </div>
  );
};

export default App;
