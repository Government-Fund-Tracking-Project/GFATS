import { useState, useEffect } from "react";
import { initializeContract } from "../utils/web3";
import BlockUi from "react-block-ui";
import "react-block-ui/style.css";

const Projects = () => {
  const [loading, setLoading] = useState(false);
  const [allProject, setAllProject] = useState([]);
  const [role, setRole] = useState("");
  const [contractFA, setContractFA] = useState({});

  const fetchProjects = async () => {
    setLoading(true);
    const contract = await initializeContract();
    setContractFA({ ...contract });
    const myAddress = localStorage.getItem("wallet_address");
    const myRole = localStorage.getItem("role");
    console.log("My wallet addr :", myAddress);
    const projectList = [];
    const totalProjects = await contract.methods.projectIndex().call();

    for (let i = 0; i < totalProjects; i++) {
      const project = await contract.methods.allProject(i).call();
      console.log(`project ${i} : ${project}`);
      projectList.push(project);
    }

    console.log(projectList);
    setAllProject(projectList);
    setRole(myRole);
    setLoading(false);
  };

  const handleProjectAddition = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const myAddress = localStorage.getItem("wallet_address");
    try {
      const projectAddition = await contractFA.methods
        .createProvinceProject(formData.get("projname"))
        .send({ from: myAddress });
      console.log("project successfully added", projectAddition);
      e.target.reset();
    } catch (error) {
      console.log("error occured", error);
    }
    fetchProjects();
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <>
      {role === "province" && (
        <>
          <h3>Add a new Project</h3>
          <form class="space-y-6" action="#" onSubmit={handleProjectAddition}>
            <input
              type="text"
              name="projname"
              id="projname"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
            />
            <button
              type="submit"
              class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Add Project
            </button>
          </form>
        </>
      )}
      <BlockUi tag="div" blocking={loading}>
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg p-16">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Project Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Status
                </th>
                <th scope="col" className="px-6 py-3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {allProject.map((item, index) => (
                <tr
                  className="border-b dark:bg-gray-800 dark:border-gray-700 odd:bg-white even:bg-gray-50 odd:dark:bg-gray-800 even:dark:bg-gray-700"
                  key={index}
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap"
                  >
                    {item[0]}
                  </th>
                  <td className="px-6 py-4 flex">
                    {item[1] ? (
                      <>
                        <span>Assigned</span>
                        <div className="w-3 h-3 bg-green-500 rounded-full ml-2"></div>
                      </>
                    ) : (
                      <>
                        <span>Not Assigned</span>
                        <div className="w-3 h-3 bg-red-500 rounded-full ml-2"></div>
                      </>
                    )}
                  </td>
                  {role === "province" ? (
                    !item[1] ? (
                      <td className=" py-4">
                        <button className="border-2 border-teal-500 text-teal-500 rounded-full px-4 py-2 mr-2 hover:bg-teal-500 hover:text-white">
                          Assign
                        </button>
                      </td>
                    ) : (
                      <td className=" py-4">
                        <button
                          className="border-2 border-teal-500 text-teal-500 rounded-full px-4 py-2 mr-2 focus:outline-none"
                          disabled
                        >
                          Assign
                        </button>
                      </td>
                    )
                  ) : !item[1] ? (
                    <td className=" py-4">
                      <button className="border-2 border-teal-500 text-teal-500 rounded-full px-4 py-2 mr-2 hover:bg-teal-500 hover:text-white">
                        Apply
                      </button>
                    </td>
                  ) : (
                    <td className=" py-4">
                      <button
                        className="border-2 border-teal-500 text-teal-500 rounded-full px-4 py-2 mr-2 focus:outline-none"
                        disabled
                      >
                        Apply
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </BlockUi>
    </>
  );
};

export default Projects;
