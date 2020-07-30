pragma solidity >=0.4.24 <0.6.0;

contract StakingStorage {

    struct Staking {
        string name;
        uint amount;
    }

    Staking[] public products;

    function setStaking(string memory name, uint amount) public {
        products.push(Staking(name, amount));
    }

    function getStaking(uint index) public view returns (string memory name, uint amount) {
        return (products[index].name, products[index].amount);
    }

    function getCountStaking() public view returns (uint) {
        return products.length;
    }
}