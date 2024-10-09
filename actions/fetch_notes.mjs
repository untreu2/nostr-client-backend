// Import necessary packages from NDK
import NDK from "@nostr-dev-kit/ndk";
import "websocket-polyfill";

const userNpub = "npub1mmfakwg4s36235wlav6qpe03cgr038gujn2hnsvwk2ne49gzqslqc6xvtp";

const ndk = new NDK({
    explicitRelayUrls: [
        "wss://relay.damus.io", 
        "wss://nos.lol", 
        "wss://relay.snort.social",
    ],
});

function formatDate(unixTimestamp) {
    const date = new Date(unixTimestamp * 1000);
    return date.toLocaleString();
}

async function fetchDisplayName(pubkey) {
    try {
        const user = ndk.getUser({ pubkey });
        await user.fetchProfile();
        return user.profile?.name || pubkey; 
    } catch (error) {
        return pubkey;
    }
}

async function fetchFollowsAndRecentNotes(npub) {
    try {
        await ndk.connect();

        const user = ndk.getUser({ npub });

        await user.fetchProfile();
        console.log(`User profile fetched for npub: ${npub}`);

        const filter = {
            kinds: [3],
            authors: [user.hexpubkey],
        };

        const followEvents = await ndk.fetchEvents(filter);
        if (followEvents.length === 0) {
            console.log("No follows found.");
            return;
        }

        const followedNpups = [];
        followEvents.forEach(event => {
            const follows = event.tags.filter(tag => tag[0] === 'p');
            follows.forEach(tag => {
                followedNpups.push(tag[1]);
            });
        });

        if (followedNpups.length > 0) {
            const noteFilter = {
                kinds: [1], 
                authors: followedNpups, 
                limit: 50,
            };

            const notes = await ndk.fetchEvents(noteFilter, { timeout: 10000 });
            
            const notesArray = Array.isArray(notes) ? notes : Array.from(notes.values());

            if (notesArray.length === 0) {
                console.log("No recent notes found.");
            } else {
                const sortedNotes = notesArray.sort((a, b) => b.created_at - a.created_at);

                console.log("\nMost recent notes from followed users:\n");

                for (const note of sortedNotes) {
                    const displayName = await fetchDisplayName(note.pubkey);

                    console.log(`Note from ${displayName}: ${note.content}`);
                    console.log(`Date and time: ${formatDate(note.created_at)}\n`);
                }
            }
        }

    } catch (error) {
        console.error("Error fetching data: ", error);
    }
}

fetchFollowsAndRecentNotes(userNpub);
