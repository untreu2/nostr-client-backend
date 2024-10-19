import { generateSecretKey, getPublicKey, finalizeEvent } from 'nostr-tools/pure';
import { Relay } from 'nostr-tools/relay';
import { hexToBytes } from '@noble/hashes/utils';
import WebSocket from 'ws';

import { useWebSocketImplementation } from 'nostr-tools/relay';
useWebSocketImplementation(WebSocket); 

const skHex = '...';
const sk = hexToBytes(skHex);

const newProfileName = 'Hallo';
const newProfilePictureUrl = '';

const relay = await Relay.connect('wss://nos.lol');
console.log(`Connected to ${relay.url}`);

const profileEvent = {
  kind: 0,
  created_at: Math.floor(Date.now() / 1000),
  tags: [],
  content: JSON.stringify({
    name: newProfileName,
    picture: newProfilePictureUrl,
  }),
};

const signedEvent = finalizeEvent(profileEvent, sk);

await relay.publish(signedEvent);
console.log('Profile update event published.');

relay.close();
console.log('Relay connection closed.');