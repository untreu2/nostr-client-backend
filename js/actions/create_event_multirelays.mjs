// Import necessary packages from nostr-tools
import { generateSecretKey, getPublicKey, finalizeEvent } from 'nostr-tools/pure';
import { SimplePool } from 'nostr-tools/pool';
import WebSocket from 'ws';
import { useWebSocketImplementation } from 'nostr-tools/pool';
import { bytesToHex, hexToBytes } from '@noble/hashes/utils';

useWebSocketImplementation(WebSocket);

const privateKeyHex = '...'; 
const privateKeyBytes = hexToBytes(privateKeyHex);

const createAndSignEvent = (content) => {
  const eventTemplate = {
    kind: 1,
    created_at: Math.floor(Date.now() / 1000),
    tags: [],
    content
  };

  const signedEvent = finalizeEvent(eventTemplate, privateKeyBytes);
  return signedEvent;
};

const publishEventToRelays = async (event, relays) => {
  const pool = new SimplePool();
  let published = false;

  try {
    const publishPromises = relays.map((relayUrl) => pool.publish([relayUrl], event));
    
    await Promise.any(publishPromises);
    published = true;
    console.log('Published!');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    try {
      pool.close();
    } catch (closeError) {
      console.error('Error:', closeError);
    }
  }
  return published;
};

const main = async () => {
  const content = 'hello hello hello';

  const event = createAndSignEvent(content);

  const relays = [
    'wss://nos.lol/',
    'wss://...'
  ];

  await publishEventToRelays(event, relays);
};

main().catch(console.error);
