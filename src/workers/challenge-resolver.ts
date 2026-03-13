import { solveChallenge } from "../utils/proof-of-work";

onmessage = async (event) => {
  const { hashes, saltLength, searchSpace } = event.data;
  const solutions = await solveChallenge(hashes, saltLength, searchSpace);
  postMessage({ solutions });
};
