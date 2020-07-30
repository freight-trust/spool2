pragma solidity >=0.4.24 <0.6.0;

contract PoolStorage {

    struct User {
        string pooloperator;
        address myAddress;
    }

    User[] public users;

    function setUser(string memory pooloperator, address myAddress) public {
        users.push(User(pooloperator, myAddress));
    }

    function getUser(uint index) public view returns (string memory pooloperator, address myAddress) {
        return (users[index].pooloperator, users[index].myAddress);
    }

    function getCountUser() public view returns (uint) {
        return users.length;
    }
}