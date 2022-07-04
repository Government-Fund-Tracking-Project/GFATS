import React from "react";
import { NavLink } from "react-router-dom";

const AllApplicants = ({
  setViewStatus,
  applicantsList = [],
  handleAssignProject = () => {},
}) => {
  return (
    <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
      <div className="relative p-4 w-full max-w-md h-full md:h-auto">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <button
            type="button"
            className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
            onClick={() => setViewStatus(false)}
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </button>
          <div className="py-4 px-6 rounded-t border-b dark:border-gray-600">
            <h3 className="text-base font-semibold text-gray-900 lg:text-xl dark:text-white">
              All Applicants
            </h3>
          </div>
          <div className="p-6">
            {/* <p className="text-sm font-normal text-gray-500 dark:text-gray-400">
              Connect with one of our available wallet providers or create a new
              one.
            </p> */}
            <ul className="my-4 space-y-3">
              {applicantsList.map((item, index) => (
                <li key={index}>
                  <p className="flex items-center p-3 font-bold text-gray-900 bg-gray-50 rounded-lg dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white">
                    <span className="flex-1 ml-3 whitespace-nowrap">
                      {item[1]}
                    </span>
                    <button onClick={() => handleAssignProject(index)}>
                      <span className="inline-flex items-center justify-center px-2 py-0.5 ml-3 text-xs font-medium text-gray-500 bg-gray-200 rounded dark:bg-gray-700 dark:text-gray-400">
                        Approve
                      </span>
                    </button>
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllApplicants;
