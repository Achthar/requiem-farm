import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';
import {writeFileSync} from 'fs';
import {parseEther} from 'ethers/lib/utils';
import {artifacts} from 'hardhat';

// npx hardhat deploy --network bsc-testnet --tags deploy_BSCT --reset

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployments, getNamedAccounts} = hre;
  const {deploy, execute} = deployments;

  const {deployer} = await getNamedAccounts();

  const cakeToken = await deploy('CakeToken', {
    from: deployer,
    args: [],
    log: true,
  });

  const syrupBar = await deploy('SyrupBar',
  {
    from: deployer,
    args: [
      cakeToken.address, // cake token address
    ],
    log: true,

  });

  const masterChef = await deploy('MasterChef',
  {
    from: deployer,
    args: [
      cakeToken.address,
      syrupBar.address, //syrup address
      deployer, // dev addr
      5, // cake per block
      10000, //start block
    ],
    log: true,

  });




  const sousChef = await deploy('SousChef',
  {
    from: deployer,
    args: [
      syrupBar.address, //syrup address
      5, // reward per block
      10000, // start block
      100000, // end block
    ],
    log: true,

  });
/*
  const timelock = await deploy('Timelock',{
    from: deployer,
    args: [
      deployer, //admin
      5, // delay
    ],
    log: true,
  }) */


  const contracts = {
    "CakeToken":  cakeToken.address,
    "SyrupBar":   syrupBar.address,
    "masterChef": masterChef.address,
    "SousChef":   sousChef.address,
    // "Timlock":    timelock.address
  }

  writeFileSync('contractData.json', JSON.stringify(contracts));
};

export default func;
func.tags = ['deploy_BSCT'];
