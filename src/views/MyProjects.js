import { useState, useEffect } from "react";
import { initializeContract } from "../utils/web3";
import BlockUi from "react-block-ui";
import "react-block-ui/style.css";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import AllApplicants from "./modals/AllApplicants";
import { useNavigate } from "react-router-dom";

const MyProjects = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [allProject, setAllProject] = useState([]);
  const [role, setRole] = useState("");
  const [contractFA, setContractFA] = useState({});
  const [fetchStatus, setFetchStatus] = useState(false);
  const [currentAddress, setCurrentAddress] = useState("");
  const [viewStatus, setViewStatus] = useState(false);
  const [applicantsList, setApplicantsList] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [currentProject, setCurrentProject] = useState();

  const fetchProjects = async () => {
    setLoading(true);
    const contract = await initializeContract();
    setContractFA({ ...contract });
    const myAddress = localStorage.getItem("wallet_address");
    setCurrentAddress(myAddress);
    const myRole = localStorage.getItem("role");
    const projectList = [];
    const totalProjects = await contract.methods.projectIndex().call();

    for (let i = 0; i < totalProjects; i++) {
      const project = await contract.methods.allProject(i).call();
      if (project[3] === myAddress || project[4] === myAddress)
        projectList.push(project);
    }

    setAllProject(projectList);
    setRole(myRole);
    setLoading(false);
  };

  const addProject = async () => {
    await Swal.fire({
      title: "Add a project",
      input: "text",
      inputPlaceholder: "Enter the title of Project",
      confirmButtonText: "Confirm",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await contractFA.methods
            .createProvinceProject(result.value)
            .send({ from: currentAddress });
          setFetchStatus(!fetchStatus);
          toast.success("Project added successfully");
        } catch (error) {
          toast.error("Error while adding project");
        }
      }
    });
  };

  const viewApplications = async (project_id) => {
    const list = [];
    const applicants = await contractFA.methods
      .getProjectApplications(project_id)
      .call({ from: currentAddress });
    setApplicants(applicants);
    for (let i = 0; i < applicants.length; i++) {
      const contractor = await contractFA.methods
        .myContractor()
        .call({ from: applicants[i] });
      list.push(contractor);
    }
    setApplicantsList(list);
    setViewStatus(true);
  };

  const handleAssignProject = async (id) => {
    try {
      await contractFA.methods
        .assignProject(currentProject, applicants[id])
        .send({ from: currentAddress });
      toast.success(`Successfully project assign to ${applicants[id]}`);
    } catch (error) {
      toast.error("Something went wrong");
    }
    setViewStatus(false);
    setFetchStatus(!fetchStatus);
  };

  const contractorDetail = async (contractorAddress) => {
    const item = await contractFA.methods
      .myContractor()
      .call({ from: contractorAddress });
    navigate(`/contractors/${contractorAddress}`, {
      state: {
        contractorAddress: contractorAddress,
        contractor: item,
      },
    });
  };

  useEffect(() => {
    fetchProjects();
  }, [fetchStatus]);

  return (
    <>
      <BlockUi tag="div" blocking={loading}>
        {viewStatus && (
          <AllApplicants
            setViewStatus={setViewStatus}
            applicantsList={applicantsList}
            handleAssignProject={handleAssignProject}
          />
        )}
        <div
          className={
            !viewStatus
              ? "relative overflow-x-auto shadow-md sm:rounded-lg p-16"
              : "relative overflow-x-auto shadow-md sm:rounded-lg p-16 blur"
          }
        >
          {role === "province" && (
            <div>
              <p
                className="inline-block text-sm px-4 mb-2 py-2 cursor-pointer leading-none border rounded text-blue-500 font-bold border-blue-600 hover:border-transparent hover:text-white hover:bg-red-600 mt-4 lg:mt-0"
                onClick={addProject}
              >
                + Add Project
              </p>
            </div>
          )}
          {allProject.length > 0 && (
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

                  {role !== "contractor" && (
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
                      {item[1]}
                    </th>
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap"
                    >
                      {item[2]}
                    </th>
                    <th className="px-6 py-4 ">
                      {item[5] ? (
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
                    </th>
                    {role !== "contractor" && (
                      <th className="px-6 py-4 ">
                        {item[5] ? (
                          <>
                            <button
                              className="border-2 border-teal-500 text-teal-500 rounded-full px-4 py-2 mr-2 hover:bg-teal-500 hover:text-white"
                              onClick={() => contractorDetail(item[4])}
                            >
                              View Contractor
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              className="border-2 border-teal-500 text-teal-500 rounded-full px-4 py-2 mr-2 hover:bg-teal-500 hover:text-white"
                              onClick={() => {
                                setCurrentProject(item[0]);
                                viewApplications(item[0]);
                              }}
                            >
                              View Applications
                            </button>
                          </>
                        )}
                      </th>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </BlockUi>
    </>
  );
};

export default MyProjects;
