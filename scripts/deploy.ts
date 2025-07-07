import { ethers } from "hardhat";
import { parseEther, ZeroAddress } from "ethers";
import * as fs from "fs";
import * as path from "path";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  // Deploy EunCoin with initial supply 10M tokens to deployer
  const EunCoin = await ethers.getContractFactory("EunCoin");
  const eunCoin = await EunCoin.deploy(deployer.address, parseEther("10000000"));
  await eunCoin.waitForDeployment();
  const eunCoinAddress = await eunCoin.getAddress();
  console.log("EunCoin deployed at", eunCoinAddress);

  // DonationConverter and NanumCoin
  const NanumCoin = await ethers.getContractFactory("NanumCoin");
  // Temporary zero address for converter, will update after DonationConverter is deployed
  const nanumCoin = await NanumCoin.deploy(ZeroAddress, deployer.address);
  await nanumCoin.waitForDeployment();
  const nanumCoinAddress = await nanumCoin.getAddress();
  console.log("NanumCoin deployed at", nanumCoinAddress);

  const DonationConverter = await ethers.getContractFactory("DonationConverter");
  const converter = await DonationConverter.deploy(eunCoinAddress, nanumCoinAddress);
  await converter.waitForDeployment();
  const converterAddress = await converter.getAddress();
  console.log("DonationConverter deployed at", converterAddress);

  // Set converter in NanumCoin
  const txSetConverter = await nanumCoin.setConverter(converterAddress);
  await txSetConverter.wait();

  // Deploy Staking
  const EunStaking = await ethers.getContractFactory("EunStaking");
  const staking = await EunStaking.deploy(eunCoinAddress);
  await staking.waitForDeployment();
  const stakingAddress = await staking.getAddress();
  console.log("EunStaking deployed at", stakingAddress);

  // Save addresses to frontend
  const addresses = {
    EunCoin: eunCoinAddress,
    NanumCoin: nanumCoinAddress,
    DonationConverter: converterAddress,
    EunStaking: stakingAddress,
  };

  const frontendDir = path.join(__dirname, "..", "frontend");
  if (fs.existsSync(frontendDir)) {
    fs.writeFileSync(
      path.join(frontendDir, "src", "contracts.json"),
      JSON.stringify(addresses, null, 2)
    );
    console.log("Saved addresses to frontend/src/contracts.json");
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
}); 