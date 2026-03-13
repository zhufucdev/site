import { test, expect } from "vitest";
import {
  getChallenge,
  newPoW,
  solveChallenge,
  verifyChallenge as verifySolutions,
} from "./proof-of-work";

test("generated challenges are solvable", async () => {
  const count = 3;
  const pow = newPoW(count);
  const challenge = await getChallenge(pow);
  const solutions = await solveChallenge(
    challenge.hashes,
    challenge.saltLength,
    challenge.searchSpace,
  );
  expect(solutions).toHaveLength(count);
  expect(verifySolutions(pow, solutions!)).toBeTruthy();
}, 300_000);
