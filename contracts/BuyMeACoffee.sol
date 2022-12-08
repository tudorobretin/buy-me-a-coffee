// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// import "hardhat/console.sol";

contract BuyMeACoffee {
    event NewEntry(
        address indexed from,
        uint256 timestamp,
        string name,
        string message
    );

    struct Entry {
        address from;
        uint256 timestamp;
        string name;
        string message;
    }

    Entry[] entries;

    address payable owner;

    // The constructor only runs at deploy.
    constructor() {
        // Define who the owner is by looking at who deployed the code.
        owner = payable(msg.sender);
    }

    /**
     * @dev buy coffee for contract owner
     * @param _name name of the coffee buyer
     * @param _message message left by buyer
     */
     // The memory keyword gets rid of the variables afer they've been used.
     // You have to allow this function to be payable.
     // Public means anyone can call this function.
    function buyCoffee(string memory _name, string memory _message) public payable{
        // Check if value payed is greater than 0, if not returns the string response and nothing passes beyond this line.
        require(msg.value > 0, "Man and I thought I'm cheap." );

        // Add entry to storage.
        entries.push(Entry(
            msg.sender,
            block.timestamp,
            _name,
            _message
        ));

        emit NewEntry(
            msg.sender,
            block.timestamp,
            _name,
            _message
        );
    }

    /**
     * @dev send the entire balance stored in this contract to the owner
     */
    function withdrawMoney() public {

    }

    /**
     * @dev retrieve all the entries received and stored on the blockchain
     */
    function getEntries() public {

    }

}
