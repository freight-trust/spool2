pragma solidity >=0.4.24 <0.6.0;

import "../state/StorageState.sol";

contract TestEDIContract is StorageState {
    
    function register(string memory pooloperator) public {
        userStorage.setUser(pooloperator, msg.sender);   
    }
}