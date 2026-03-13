import { Base64 } from "js-base64";
import { sha1 } from "js-sha1";

export interface PoW {
  /** Base64 encoded, uniquely generated for each challenge for security **/
  salt: string;
  /** Base64 encoded, expected response to the challenge from client **/
  expectedResponses: string[];
}

export function newPoW(
  count: number,
  saltLength: number = 2,
  hashLength: number = 1,
): PoW {
  const salt = Base64.fromUint8Array(
    crypto.getRandomValues(new Uint8Array(saltLength)),
  );
  const expectedResponses = Array.from({ length: count }, () =>
    Base64.fromUint8Array(crypto.getRandomValues(new Uint8Array(hashLength))),
  );
  return { salt, expectedResponses };
}

export async function getChallenge(pow: PoW) {
  const salt = Base64.toUint8Array(pow.salt);
  const hashes = pow.expectedResponses.map(Base64.toUint8Array);
  return {
    hashes: await Promise.all(
      hashes.map((hash) =>
        crypto.subtle
          .digest("SHA-1", new Uint8Array([...salt, ...hash]))
          .then((ba) => Base64.fromUint8Array(new Uint8Array(ba))),
      ),
    ),
    saltLength: salt.length,
    searchSpace: salt.length + hashes[0].length,
  };
}

export function verifyChallenge(pow: PoW, response: string[]): boolean {
  const salt = Base64.toUint8Array(pow.salt);
  const hashes = pow.expectedResponses.map(Base64.toUint8Array);
  for (const [index, actual] of response.entries()) {
    const expected = Base64.fromUint8Array(hashes[index]);
    if (actual !== expected) {
      return false;
    }
  }
  return true;
}

async function solveSingle(
  hash: Uint8Array,
  length: number,
  continuation: Uint8Array | undefined = undefined,
) {
  const buf = continuation
    ? new Uint8Array(continuation)
    : new Uint8Array(length);
  const bufView = new DataView(buf.buffer);
  function collide() {
    const maybe = new Uint8Array(sha1.arrayBuffer(buf));
    if (maybe.length !== hash.length) {
      throw new Error("SHA-1 hash length mismatch");
    }
    return mostCommonPrefix(maybe, hash).length == hash.length;
  }
  while (true) {
    if (collide()) {
      return buf;
    }
    // Increment buf as a little-endian counter
    let offset = 0;
    while (offset < buf.length) {
      const byte = bufView.getUint8(offset);
      if (byte < 255) {
        bufView.setUint8(offset, byte + 1);
        break;
      } else {
        bufView.setUint8(offset, 0);
        offset++;
      }
    }
    if (offset >= buf.length) {
      return null; // exhausted search space
    }
  }
}

function mostCommonPrefix(a: Uint8Array, b: Uint8Array) {
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) {
    i++;
  }
  return a.slice(0, i);
}

export async function solveChallenge(
  hashesBase64: string[],
  saltLength: number = 2,
  searchSpace: number = 3,
) {
  const hashes = hashesBase64.map(Base64.toUint8Array);
  const solutions = [];
  const saltMask = new Uint8Array(searchSpace);
  let completed = 0;
  while (completed < hashes.length) {
    const start = Date.now();
    const s = await solveSingle(hashes[completed], searchSpace, saltMask);
    if (s === null) {
      return null;
    }
    if (completed > 0) {
      const mcp = mostCommonPrefix(s, solutions[completed - 1]);
      if (mcp.length < saltLength) {
        // TODO: calculate other solutions and choose the best one
        console.warn("most common prefix length", mcp.length, "<", saltLength);
        return null;
      }
    }
    if (!saltMask.find((b, i) => b === s[i] && b !== 0)) {
      saltMask.set(s.slice(0, saltLength), 0);
    }
    solutions.push(s);
    completed++;
    console.debug("solved hash", completed, "in", Date.now() - start, "ms");
  }
  return solutions.map((s) => Base64.fromUint8Array(s.slice(saltLength)));
}
