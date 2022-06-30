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

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleProjectApply = async (project_id) => {
    setLoading(true);
    if (localStorage.getItem("role") === "contractor") {
      const account = localStorage.getItem("wallet_address");
      const respond = await contractFA.methods
        .applyForProject(project_id)
        .send({ from: account });
      console.log("status :>> ", respond.status);
    }
    setLoading(false);
  };

  return (
    <>
      <BlockUi tag="div" blocking={loading}>
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg p-16">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Project Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Province
                </th>
                <th scope="col" className="px-6 py-3">
                  Status
                </th>
                {role === "contractor" && (
                  <th scope="col" className="px-6 py-3">
                    Action
                  </th>
                )}
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
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap"
                  >
                    {item[1]}
                  </th>
                  <td className="px-6 py-4 flex">
                    {item[4] ? (
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
                  {role === "contractor" &&
                    (!item[4] ? (
                      <td className=" py-4">
                        <button
                          className="border-2 border-teal-500 text-teal-500 rounded-full px-4 py-2 mr-2 hover:bg-teal-500 hover:text-white"
                          onClick={() => handleProjectApply(index)}
                        >
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
                    ))}
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
