/*
 * Copyright (c) 2020 FreightTrust and Clearing Corporation
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

var Spool2 = artifacts.require("./Spool2.sol");
var TestRPC = require("ethereumjs-testrpc");
// update ganache-cli
// import { Spool2 } from "artifacts.require('./Spool2.sol')";

// unit of account are in ether but winings are paid out in EDI/ETH, this makes it so that we dont have to use `WETH`
var val = web3.toWei(1, "ether");
console.log(val);

// @dev
contract("Spool2", function (accounts) {
  var Spol2 = Spool2.deployed();
  var account_arr = accounts;
  // @dev console.log(web3.eth.getBalance(account_arr[0]).valueOf());

  it("should correctly start a new round when the time is up", function (accounts) {
    Spol2.then(function (instance) {
      return instance.back("A", {
        from: account_arr[1],
        value: web3.toWei(0.5, "ether"),
      });
    }).then(function (tx) {
      printSides(Spol2, 0);
      printMyAmts(Spol2, account_arr[1], 1);
      Spol2.then(function (instance) {
        return instance.back("A", {
          from: account_arr[2],
          value: web3.toWei(0.3, "ether"),
        });
      }).then(function (tx) {
        printSides(Spol2, 0);
        printMyAmts(Spol2, account_arr[2], 2);
        Spol2.then(function (instance) {
          return instance.back("B", {
            from: account_arr[3],
            value: web3.toWei(0.7, "ether"),
          });
        }).then(function (tx) {
          printSides(Spol2, 0);
          printMyAmts(Spol2, account_arr[3], 3);
          Spol2.then(function (instance) {
            return instance.back("B", {
              from: account_arr[4],
              value: web3.toWei(0.05, "ether"),
            });
          }).then(function (tx) {
            printSides(Spol2, 0);
            printMyAmts(Spol2, account_arr[4], 4);
            console.log(1);
            /*
             *  Layer of Abstraction can be added here
             *  This is where `OPTIONS` can be placed so that users
             *  can `HEDGE` there `POSITIONS`.
             *   @dev TODO
             *  START NEXT ROUND
             */
            Spol2.then(function (instance) {
              console.log(2);
              return instance.isRoundRunning.call(0);
            }).then(function (running) {
              console.log("ROUND RUNNING: " + running);
              console.log("WAITING.....");
            });
            setTimeout(function () {
              Spol2.then(function (instance) {
                return instance.getRoundWinner.call(0);
              }).then(function (winner) {
                console.log("WINNER: " + winner);
              });
              printBal(account_arr[1], 1);
              printBal(account_arr[2], 2);
              printBal(account_arr[3], 3);
              printBal(account_arr[4], 4);
              Spol2.then(function (instance) {
                return instance.startRound({ from: account_arr[4] });
              }).then(function (tx) {
                console.log("New Round Has Started");
                Spol2.then(function (instance) {
                  return instance.getCurRoundId.call();
                }).then(function (id) {
                  console.log("ROUND ID: " + id);
                });
                Spol2.then(function (instance) {
                  return instance.getRoundWinner.call(0);
                }).then(function (winner) {
                  console.log("WINNER: " + winner);
                  assert.equal(winner, "Pool A", "winner not correct");
                });
                printBal(account_arr[1], 1);
                printBal(account_arr[2], 2);
                printBal(account_arr[3], 3);
                printBal(account_arr[4], 4);
                //See the treasury bal:
                Spol2.then(function (instance) {
                  return instance.getTreasury.call();
                }).then(function (val) {
                  console.log(
                    "Treasury contains: " + web3.fromWei(val, "ether")
                  );
                });
                //See how much the bounty was:
                printValFlagsEth(Spol2);
                //See if the bounty sent:
                printBoolFlags(Spol2);
                /*
                 * Now try some withdrawals
                 */
                Spol2.then(function (instance) {
                  return instance.withdrawWinnings(0, { from: account_arr[1] });
                  // @dev value never read, this is a `void`
                }).then(function (tx) {
                  printBoolFlags(Spol2);
                  printValFlagsEth(Spol2);
                  printBal(account_arr[1], 1);
                });
              });
            }, 80000);
          });
        });
      });
    });
  });
});

function printBal(account, index) {
  console.log(
    "ACC " +
      index +
      ": " +
      web3.fromWei(web3.eth.getBalance(account).valueOf(), "ether")
  );
}

function printSides(contract, index) {
  contract
    .then(function (instance) {
      return instance.getTotalInA.call(index);
    })
    .then(function (tot) {
      console.log("SIDE A TOT: " + tot);
    });
  contract
    .then(function (instance) {
      return instance.getTotalInB.call(index);
    })
    .then(function (tot) {
      console.log("SIDE B TOT: " + tot);
    });
}

function printMyAmts(contract, account, index) {
  contract
    .then(function (instance) {
      return instance.getMyAmtInA.call(0, { from: account });
    })
    .then(function (tot) {
      console.log(index + " A TOT: " + tot.valueOf());
    });
  contract
    .then(function (instance) {
      return instance.getMyAmtInB.call(0, { from: account });
    })
    .then(function (tot) {
      console.log(index + " B TOT: " + tot.valueOf());
    });
}

function printBoolFlags(contract) {
  contract
    .then(function (instance) {
      return instance.flagA.call();
    })
    .then(function (flag) {
      console.log("FLAG A: " + flag);
    });

  contract
    .then(function (instance) {
      return instance.flagB.call();
    })
    .then(function (flag) {
      console.log("FLAG B: " + flag);
    });

  contract
    .then(function (instance) {
      return instance.flagC.call();
    })
    .then(function (flag) {
      console.log("FLAG C: " + flag);
    });
}

function printValFlags(contract) {
  contract
    .then(function (instance) {
      return instance.valFlagA.call();
    })
    .then(function (flag) {
      console.log("VAL FLAG A: " + flag);
    });

  contract
    .then(function (instance) {
      return instance.valFlagB.call();
    })
    .then(function (flag) {
      console.log("VAL FLAG B: " + flag);
    });

  contract
    .then(function (instance) {
      return instance.valFlagC.call();
    })
    .then(function (flag) {
      console.log("VAL FLAG C: " + flag);
    });
}

function printValFlagsEth(contract) {
  contract
    .then(function (instance) {
      return instance.valFlagA.call();
    })
    .then(function (flag) {
      console.log("VAL FLAG A: " + web3.fromWei(flag, "ether"));
    });

  contract
    .then(function (instance) {
      return instance.valFlagB.call();
    })
    .then(function (flag) {
      console.log("VAL FLAG B: " + web3.fromWei(flag, "ether"));
    });

  contract
    .then(function (instance) {
      return instance.valFlagC.call();
    })
    .then(function (flag) {
      console.log("VAL FLAG C: " + web3.fromWei(flag, "ether"));
    });
}
