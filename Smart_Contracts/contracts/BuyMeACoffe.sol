// SPDX-License-Identifier: MIT
/// @title BuyMeACoffe
/// @author Maikel Ordaz

pragma solidity ^0.8.0;

/*** IMPORTS CONTRACTS ***/
import "@openzeppelin/contracts/access/Ownable.sol";

/*** IMPORTS INTERFACES ***/

/*** IMPORTS LIBRARIES ***/

/*** ERRORS ***/
error BuyMeACoffe__NotEnoughETH();
error BuyMeACoffe__CallFailed();

/*** CONTRACT ***/
contract BuyMeACoffe is Ownable {
    /*** LIBRARIES USED ***/
    /*** STATE VARIABLES ***/
    uint private s_coffeId;

    struct Coffe {
        address from;
        uint256 timestamp;
        string name;
        string message;
    }

    Coffe[] s_coffes;

    /*** EVENTS ***/
    event NewCoffe(address indexed from, uint256 timestamp, string name, string message);

    /*** MAPPINGS ***/
    mapping(uint256 => Coffe) private s_coffeById;

    /*** MODIFIERS ***/
    /*** CONSTRUCTOR ***/
    constructor() {
        s_coffeId = 0;
    }

    /*** RECEIVE / FALLBACK ***/
    receive() external payable {
        buyCoffe("Jhon", "Hi");
    }

    /*** MAIN FUNCTIONS ***/
    function buyCoffe(string memory name, string memory message) public payable {
        if (msg.value == 0) {
            revert BuyMeACoffe__NotEnoughETH();
        }

        s_coffeId++;

        Coffe storage coffe = s_coffeById[s_coffeId];

        coffe.from = msg.sender;
        coffe.timestamp = block.timestamp;
        coffe.name = name;
        coffe.message = message;

        emit NewCoffe(msg.sender, block.timestamp, name, message);
    }

    function withdraw() external onlyOwner {
        (bool success, ) = owner().call{value: address(this).balance}("");
        if (!success) {
            revert BuyMeACoffe__CallFailed();
        }
    }

    /*** VIEW / PURE FUNCTIONS ***/
    function getCoffeId() public view returns (uint256) {
        return s_coffeId;
    }

    function getCoffes() public view returns (Coffe[] memory) {
        return s_coffes;
    }
}
