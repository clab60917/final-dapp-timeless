import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployLuxuryWatch: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy("LuxuryWatch", {
    from: deployer,
    // Mettez à jour les arguments du constructeur si nécessaire
    args: [],
    log: true,
    autoMine: true,
  });

  // Vous pouvez ajouter ici des opérations supplémentaires si nécessaire
};

export default deployLuxuryWatch;
deployLuxuryWatch.tags = ["LuxuryWatch"];
