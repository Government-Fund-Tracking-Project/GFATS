// SPDX-License-Identifier:MIT

pragma solidity ^0.8.1;

contract FundAllocation {
    uint256 public provinceIndex = 0;
    uint256 public contractorIndex = 0;
    uint256 public projectIndex = 0;
    address private admin;

    struct Province {
        uint256 id;
        string name;
        uint256 stateNo;
        string capital;
        address wallet;
        bool isApproved;
        bool isRegistered;
    }

    struct Contractor {
        uint256 id;
        string name;
        bool isApproved;
        bool isRegistered;
    }

    struct Project {
        string name;
        string province;
        address projectOwner;
        address projectAssignedTo;
        bool isAssigned;
        bool isCompleted;
    }

    //mapping(address=>uint256) public projectIndex;
    mapping(uint256 => Project) projects;
    mapping(uint256 => address[]) projectApplications;

    address[] public provinceList;
    address[] public contractorList;

    mapping(address => Province) provinces;
    mapping(address => Contractor) contractors;
    mapping(address => bool) isProvince;
    mapping(address => bool) isContractor;

    constructor() {
        admin = msg.sender;
    }

    //events
    event provinceRegistered(address _address,string _provincename);
    event provinceVerified(address _of,address _by);
    event contractorRegistered(address _address,string _contractorname);
    event contractorVerified(address _of,address _by);
    event provinceProjectCreated(address _address,string _projectname);
    event appliedForProject(address _address,uint256 _id);
    event assignedProject(address _to,address _by,uint256 _id);

    modifier excludeAdmin(address _address) {
        require(_address != admin, "Admin cannot be registered as Province");
        _;
    }

    modifier verifierAdmin(address _address) {
        require(_address == admin, "Only Admin can verify.");
        _;
    }

    modifier verifierProvince(address _address) {
        require(
            (isProvince[_address] && provinces[_address].isApproved),
            "Only approved Province can verify."
        );
        _;
    }

    modifier registeredAndApprovedProvince(address _address) {
        require(
            (provinces[_address].isRegistered &&
                provinces[_address].isApproved),
            " Not registered or approved province"
        );
        _;
    }

    modifier registeredAndApprovedContractor(address _address) {
        require(
            (contractors[_address].isRegistered &&
                contractors[_address].isApproved),
            "Not registered or approved contractor"
        );
        _;
    }

    function findUserRole(address _address)
        public
        view
        returns (string memory user)
    {
        if (_address == admin) {
            return "admin";
        } else if (isProvince[_address] == true) {
            return "province";
        } else if (isContractor[_address] == true) {
            return "contractor";
        } else {
            return "unAuthorized";
        }
    }

    function registerProvince(
        string memory _name,
        uint256 _stateNo,
        string memory _capital
    ) public excludeAdmin(msg.sender) returns (bool) {
        require(bytes(_name).length > 0);
        require(_stateNo > 0);
        require(bytes(_capital).length > 0);
        address _address = msg.sender;

        provinceList.push(_address);
        provinceIndex += 1;

        provinces[_address].name = _name;
        provinces[_address].stateNo = _stateNo;
        provinces[_address].capital = _capital;
        provinces[_address].wallet = _address;
        provinces[_address].isRegistered = true;
        isProvince[_address] = true;
        emit provinceRegistered(_address, _name);
        return true;
    }

    function verifyProvince(address _address)
        public
        verifierAdmin(msg.sender)
        returns (bool)
    {
        require(
            !provinces[_address].isApproved,
            "The province is already approved"
        );
        provinces[_address].isApproved = true;
        emit provinceVerified(_address,msg.sender);
        return true;
    }

    function allProvince(uint256 _id)
        public
        view
        returns (
            string memory,
            uint256,
            string memory,
            address,
            bool,
            bool
        )
    {
        address _address = provinceList[_id];
        Province memory currentProvince = provinces[_address];
        return (
            currentProvince.name,
            currentProvince.stateNo,
            currentProvince.capital,
            currentProvince.wallet,
            currentProvince.isRegistered,
            currentProvince.isApproved
        );
    }

    function myProvince()
        public
        view
        registeredAndApprovedProvince(msg.sender)
        returns (
            uint256,
            string memory,
            uint256,
            string memory
        )
    {
        Province memory currentProvince = provinces[msg.sender];
        return (
            currentProvince.id,
            currentProvince.name,
            currentProvince.stateNo,
            currentProvince.capital
        );
    }

    function registerContractor(string memory _name)
        public
        excludeAdmin(msg.sender)
    {
        require(bytes(_name).length > 0);
        address _address = msg.sender;

        contractorList.push(_address);
        contractorIndex += 1;

        contractors[_address].name = _name;
        contractors[_address].isRegistered = true;
        isContractor[_address] = true;
        emit contractorRegistered(_address, _name);
    }

    function verifyContractor(address _address)
        public
        verifierProvince(msg.sender)
        returns (bool)
    {
        require(
            !contractors[_address].isApproved,
            "The Contractor is already approved"
        );
        contractors[_address].isApproved = true;
        emit contractorVerified(_address, msg.sender);
        return true;
    }

    function allContractor(uint256 _id)
        public
        view
        returns (
            string memory,
            bool,
            bool
        )
    {
        address _address = contractorList[_id];
        Contractor memory currentContractor = contractors[_address];
        return (
            currentContractor.name,
            currentContractor.isRegistered,
            currentContractor.isApproved
        );
    }

    function myContractor()
        public
        view
        registeredAndApprovedContractor(msg.sender)
        returns (uint256 id, string memory name)
    {
        Contractor memory currentContractor = contractors[msg.sender];
        return (currentContractor.id, currentContractor.name);
    }

    function createProvinceProject(string memory _name)
        public
        registeredAndApprovedProvince(msg.sender)
        returns (bool)
    {
        Project memory currentProject = Project(
            _name,
            provinces[msg.sender].name,
            msg.sender,
            msg.sender,
            false,
            false
        );
        projects[projectIndex] = currentProject;
        projectIndex = projectIndex + 1;
        emit provinceProjectCreated(msg.sender,_name);
        return true;
    }

    function allProject(uint256 _id)
        public
        view
        returns (
            string memory,
            string memory,
            address,
            address,
            bool,
            bool
        )
    {
        require(_id >= 0 && _id < projectIndex, "Project doesn't exist");
        Project memory currentProject = projects[_id];
        return (
            currentProject.name,
            currentProject.province,
            currentProject.projectOwner,
            currentProject.projectAssignedTo,
            currentProject.isAssigned,
            currentProject.isCompleted
        );
    }

    function applyForProject(uint256 _id)
        public
        registeredAndApprovedContractor(msg.sender)
        returns (bool)
    {
        require(
            projects[_id].isAssigned == false,
            "Project is already assigned. You cannot apply for this project"
        );
        require(
            !_checkIfContractorApplied(_id, msg.sender),
            "Project already applied for by contractor"
        );
        projectApplications[_id].push(msg.sender);
        emit appliedForProject(msg.sender, _id);
        return true;
    }

    function getProjectApplications(uint256 _id)
        public
        view
        returns (address[] memory)
    {
        require(_id >= 0 && _id < projectIndex, "Project doesn't exist");
        return projectApplications[_id];
    }

    function assignProject(uint256 _id, address _address)
        public
        registeredAndApprovedProvince(msg.sender)
        registeredAndApprovedContractor(_address)
        returns (bool)
    {
        require(
            _checkIfContractorApplied(_id, _address),
            "Project is not applied for by contractor"
        );
        require(
            projects[_id].projectOwner == msg.sender,
            "Project not created by this province"
        );
        projects[_id].isAssigned = true;
        projects[_id].projectAssignedTo = _address;
        emit assignedProject(_address, msg.sender, _id);
        return true;
    }

    function _checkIfContractorApplied(uint256 _id, address _address)
        internal
        view
        returns (bool)
    {
        bool hasApplied = false;
        for (uint256 i = 0; i < projectApplications[_id].length; i++) {
            if (_address == projectApplications[_id][i]) {
                hasApplied = true;
            }
        }
        return hasApplied;
    }
}
