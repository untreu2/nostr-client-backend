import { hexToBytes, bytesToHex } from '@noble/hashes/utils';
import { finalizeEvent, generateSecretKey, getPublicKey } from 'nostr-tools/pure';
import { Relay } from 'nostr-tools/relay';
import WebSocket from 'ws';
import { useWebSocketImplementation } from 'nostr-tools/relay';

useWebSocketImplementation(WebSocket);

(async () => {
  try {
    const nsec = '...';
    const sk = hexToBytes(nsec);
    
    const pk = getPublicKey(sk);

    console.log('Public Key:', pk);

    const eventTemplate = {
      kind: 1,
      created_at: Math.floor(Date.now() / 1000),
      tags: [],
      content: 'hello hello hello'
    };

    const signedEvent = finalizeEvent(eventTemplate, sk);
    console.log('Signed Event:', signedEvent);

    const relayUrl = 'wss://nos.lol';
    const relay = await Relay.connect(relayUrl);
    console.log(`Connected to ${relay.url}`);

    await relay.publish(signedEvent);
    console.log('Event published successfully!');

    relay.close();
  } catch (error) {
    console.error('An error occurred:', error);
  }
})();
