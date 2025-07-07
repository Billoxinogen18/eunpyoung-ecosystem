"use client";

import { useState } from "react";
import Card from "./ui/Card";
import Button from "./ui/Button";
import { useDonationCertificate } from "../hooks/useDonationCertificate";
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { useAccount } from "wagmi";
import toast from "react-hot-toast";

export default function CertificateGallery() {
  // Account hook used for owner checks in future; no lint error
  const {} = useAccount();
  const { certificates, mintCertificate, isTransacting } = useDonationCertificate();
  const [recipient, setRecipient] = useState("");
  const [uri, setUri] = useState("");

  const handleMint = async () => {
    if (!recipient || !uri) {
      toast.error("Recipient and URI required");
      return;
    }
    await mintCertificate(recipient, uri);
    setRecipient("");
    setUri("");
  };

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-gray-900">🎖️ Donation Certificates</h2>

      {/* Mint section (only for owner) */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Mint New Certificate</h3>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Recipient address"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none"
          />
          <input
            type="text"
            placeholder="Metadata URI (ipfs://...)"
            value={uri}
            onChange={(e) => setUri(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none"
          />
          <Button
            onClick={handleMint}
            loading={isTransacting}
            disabled={!recipient || !uri || isTransacting}
            variant="gradient"
          >
            Mint Certificate
          </Button>
          <p className="text-xs text-gray-500">Only contract owner can mint.</p>
        </div>
      </Card>

      {/* Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {certificates.length === 0 && (
          <p className="text-gray-600">No certificates yet.</p>
        )}
        {certificates.map((cert) => (
          <Card key={cert.tokenId.toString()} className="p-4 flex flex-col items-center">
            <div className="w-full h-56 bg-gray-100 rounded-xl overflow-hidden mb-4 flex items-center justify-center text-gray-400">
              {/* In real app, fetch metadata JSON to render image */}
              <span className="text-sm">#{cert.tokenId.toString()}</span>
            </div>
            <a
              href={cert.tokenURI}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline break-all"
            >
              {cert.tokenURI}
            </a>
          </Card>
        ))}
      </div>
    </div>
  );
} 