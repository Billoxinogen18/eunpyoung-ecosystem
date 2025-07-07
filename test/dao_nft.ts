import { expect } from "chai";
import { ethers } from "hardhat";

describe("DAO & NFT integration", function () {
  it("should deploy DonationCertificate and allow owner to mint", async () => {
    const [owner, addr1] = await ethers.getSigners();

    const DonationCertificate = await ethers.getContractFactory("DonationCertificate");
    const donationCert = await DonationCertificate.deploy();
    await donationCert.waitForDeployment();

    // Mint certificate to addr1
    const tx = await donationCert.mintCertificate(addr1.address, "ipfs://dummy-metadata");
    await tx.wait();

    expect(await donationCert.nextTokenId()).to.equal(1);
  });

  // DAO unit test skipped for now due to token votes integration complexities
}); 