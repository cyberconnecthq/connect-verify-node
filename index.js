const express = require("express");
const app = express();
const { CeramicClient } = require("@ceramicnetwork/http-client");
const bodyParser = require("body-parser");
const { Caip10Link } = require("@ceramicnetwork/stream-caip10-link");
const { DID } = require("dids");
const ThreeIdResolver = require("@ceramicnetwork/3id-did-resolver");
const did_jwt_1 = require("did-jwt");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const API_URL = {
  ceramic:
    process.env.NODE_ENV === "dev"
      ? "https://ceramic.stg.cybertino.io"
      : "https://ceramic.cybertino.io",
};

app.post("/verify", async (req, res) => {
  try {
    const { address, jws } = req.body;
    const ceramic = new CeramicClient(API_URL.ceramic);
    const accountLink = await Caip10Link.fromAccount(
      ceramic,
      `${address}@eip155:1`
    );
    const threeIdResolver = ThreeIdResolver.getResolver(ceramic);
    const resolver = {
      ...threeIdResolver,
    };
    const did = new DID({ resolver });
    const resolvedDoc = await did.resolve(accountLink.did);
    if (
      !resolvedDoc.didDocument ||
      !resolvedDoc.didDocument.verificationMethod
    ) {
      res.send(false);
    }
    const matchedPub = did_jwt_1.verifyJWS(
      jws,
      resolvedDoc.didDocument.verificationMethod
    );

    res.send({
      verified: true,
      pubkey: matchedPub.publicKeyBase58,
      type: matchedPub.type,
      did: matchedPub.id,
    });
  } catch (e) {
    res.send({ verified: false });
  }
});

app.listen(8000, () => {
  console.log("port 8000");
});
