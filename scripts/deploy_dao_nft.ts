import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying DAO and NFT contracts with account:", deployer.address);

  // Deploy DonationCertificate NFT contract
  const DonationCertificate = await ethers.getContractFactory("DonationCertificate");
  const donationCertificate = await DonationCertificate.deploy();
  await donationCertificate.waitForDeployment();
  const donationCertificateAddress = await donationCertificate.getAddress();
  console.log("DonationCertificate deployed at", donationCertificateAddress);

  // Deploy EunDAO contract (requires ERC20Votes token address, use EunCoin)
  // Read existing addresses
  const frontendDir = path.join(__dirname, "..", "frontend");
  const contractsPath = path.join(frontendDir, "src", "contracts.json");
  const addresses = fs.existsSync(contractsPath)
    ? JSON.parse(fs.readFileSync(contractsPath, "utf8"))
    : {};
  const eunCoinAddress = addresses.EunCoin;
  if (!eunCoinAddress) {
    throw new Error("EunCoin address not found in contracts.json");
  }
  const EunDAO = await ethers.getContractFactory("EunDAO");
  const eunDAO = await EunDAO.deploy(eunCoinAddress);
  await eunDAO.waitForDeployment();
  const eunDAOAddress = await eunDAO.getAddress();
  console.log("EunDAO deployed at", eunDAOAddress);

  // Update addresses
  const newAddresses = {
    ...addresses,
    EunDAO: eunDAOAddress,
    DonationCertificate: donationCertificateAddress,
  };
  fs.writeFileSync(contractsPath, JSON.stringify(newAddresses, null, 2));
  console.log("Updated frontend/src/contracts.json with new contract addresses");

  // Save ABIs
  const abisDir = path.join(frontendDir, "src", "abis");
  if (!fs.existsSync(abisDir)) fs.mkdirSync(abisDir);
  const EunDAO_ABI = await ethers.getContractFactory("EunDAO");
  fs.writeFileSync(
    path.join(abisDir, "EunDAO.json"),
    JSON.stringify(EunDAO_ABI.interface.formatJson(), null, 2)
  );
  const DonationCertificate_ABI = await ethers.getContractFactory("DonationCertificate");
  fs.writeFileSync(
    path.join(abisDir, "DonationCertificate.json"),
    JSON.stringify(DonationCertificate_ABI.interface.formatJson(), null, 2)
  );
  console.log("Saved new ABIs to frontend/src/abis/");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
}); 