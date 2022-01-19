import { getHandleAndRegistryKey } from "@bonfida/spl-name-service";
import { PublicKey, Connection } from "@solana/web3.js";
export default async function SolanaTwitterVerify(req, res) {
  const connection = new Connection(
    "https://ssc-dao.genesysgo.net/",
    "confirmed"
  );
  const { address } = req.body;
  const pubkey = new PublicKey(address);
  if (connection) {
    try {
      const [handle, registryKey] = await getHandleAndRegistryKey(
        connection,
        pubkey
      );
      res.send({
        verified: true,
        twitterHandle: handle,
      });
    } catch (e) {
      res.send({
        verified: false,
      });
    }
  }
}
