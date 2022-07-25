import { useState } from "react";
import { initializeContract } from "../utils/web3";

const AddProject = () => {
  const [contractFA, setContractFA] = useState({});
  const handleProjectAddition = async (e) => {
    e.preventDefault();

    const contract = await initializeContract();
    setContractFA({ ...contract });
    const formData = new FormData(e.target);
    const myAddress = localStorage.getItem("wallet_address");
    try {
      await contractFA.methods
        .createProvinceProject(formData.get("projname"))
        .send({ from: myAddress });
      e.target.reset();
    } catch (error) {
      console.log("error occured", error);
    }
  };

  return (
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
  );
};

export default AddProject;
