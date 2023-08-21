import axios from 'axios';

import * as Kilt from '@kiltprotocol/sdk-js';

export async function queryPublishedCredentials() {
  const api = await Kilt.connect('wss://peregrine.kilt.io/');
  const encodedJohnDoeDetails = await api.call.did.queryByWeb3Name('john_doe');

  // This function will throw if johnDoeOwner does not exist
  const {
    document: { uri },
  } = Kilt.Did.linkedInfoFromChain(encodedJohnDoeDetails);
  console.log(`My name is john_doe and this is my DID: "${uri}"`);

  const johnDoeDidDocument = await Kilt.Did.resolve(uri);
  console.log(`John Doe's DID Document:`);
  console.log(JSON.stringify(johnDoeDidDocument, null, 2));

  const endpoints = johnDoeDidDocument?.document?.service;
  if (!endpoints) {
    console.log('No endpoints for the DID.');
    return [];
  }

  console.log('Endpoints:');
  console.log(JSON.stringify(endpoints, null, 2));

  const {
    data: [{ credential }],
  } = await axios.get<Kilt.KiltPublishedCredentialCollectionV1>(endpoints[0].serviceEndpoint[0]);
  try {
    const { attester, revoked } = await Kilt.Credential.verifyCredential(credential);

    // Verify that the credential is not revoked. Exception caught by the catch {} block below.
    if (revoked) {
      throw new Error('The credential has been revoked, hence it is not valid.');
    }
    console.log(
      `John Doe's credential is valid and has been attested by ${attester}!`,
      JSON.stringify(credential, null, 2),
    );
  } catch {
    console.log("John Doe's credential is not valid.");
  }

  await Kilt.disconnect();
}
export default queryPublishedCredentials;
