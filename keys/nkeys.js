const { generateSecretKey, getPublicKey } = require('nostr-tools/pure');
const nip19 = require('nostr-tools/nip19');
const { bytesToHex, hexToBytes } = require('@noble/hashes/utils');

let sk = generateSecretKey();
let pk = getPublicKey(sk);

let skHex = bytesToHex(sk);
let pkHex = pk;

let nsecKey = nip19.nsecEncode(sk);
let npubKey = nip19.npubEncode(pk);

console.log('Generated secret key (hex):', skHex);
console.log('Generated public key (hex):', pkHex);
console.log('Generated nsec key:', nsecKey);
console.log('Generated npub key:', npubKey);