pragma solidity >=0.4.24 <0.6.0;

import "../storage/PoolStorage.sol";
import "../storage/ProductStorage.sol";

contract StorageState {
    PoolStorage public userStorage;
    ProductStorage public productStorage;
}