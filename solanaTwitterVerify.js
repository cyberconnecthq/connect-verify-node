const { getHandleAndRegistryKey } = require("@bonfida/spl-name-service");
const { PublicKey, Connection, clusterApiUrl } = require("@solana/web3.js");

let connection = new Connection(clusterApiUrl("mainnet-beta"));
module.exports = async function SolanaTwitterVerify(req, res) {
  const { address } = req.body;
  const pubkey = new PublicKey(address);
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
    console.log(e);
    res.send({
      verified: false,
    });
  }
};
