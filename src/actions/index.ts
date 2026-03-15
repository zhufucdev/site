import { ActionError, defineAction } from "astro:actions";
import { z } from "astro/zod";
import * as pow from "../utils/proof-of-work";
import { incrementViews, shouldIncrementViews } from "../utils/page-views";
import { ipTtlSeconds } from "../sessions";

export const server = {
  getRequireChallenge: defineAction({
    handler: async (_, context) => {
      if (!context.session) {
        return false;
      }
      const selfClaimedFingerprint = context.cookies.get("fingerprint")?.value;
      if (selfClaimedFingerprint) {
        const { env } = context.locals.runtime;
        const existingSessionId = await env.SESSION_ID_BY_FINGERPRINT.get(
          selfClaimedFingerprint,
        );
        if (existingSessionId) {
          await context.session.load(existingSessionId);
        }
      }
      return (await context.session.has("fingerprint")) === false;
    },
  }),
  getChallenge: defineAction({
    handler: async (_, context) => {
      if (!context.session) {
        throw new ActionError({
          message: "Challenge serivce is not available",
          code: "SERVICE_UNAVAILABLE",
        });
      }
      const info = pow.newPoW(3);
      context.session?.set("pow", info);
      return await pow.getChallenge(info);
    },
  }),
  verifyChallenge: defineAction({
    input: z.array(z.string()),
    handler: async (input, context) => {
      const info = await context.session?.get("pow");
      if (!info) {
        throw new ActionError({
          message: "Call getChallenge first",
          code: "TOO_EARLY",
        });
      }
      if (pow.verifyChallenge(info, input)) {
        const fingerprint = context.cookies.get("fingerprint")?.value;
        if (!fingerprint || !/^[\da-f]{32}$/g.test(fingerprint)) {
          throw new ActionError({
            message: "Missing or using invalid fingerprint cookie",
            code: "BAD_REQUEST",
          });
        }
        const { env } = context.locals.runtime;
        if (context.session) {
          context.session.set("fingerprint", fingerprint);
          const sessionId = context.session.sessionID;
          if (sessionId) {
            await env.SESSION_ID_BY_FINGERPRINT.put(fingerprint, sessionId);
          } else {
            console.warn(
              "Session not available after challenge was resolved. This might be a bug.",
            );
          }
        }
        await env.FINGERPRINT_BY_IP.put(context.clientAddress, fingerprint, {
          expirationTtl: ipTtlSeconds,
        });
        return { success: true };
      } else {
        return { success: false };
      }
    },
  }),
  incrementPageView: defineAction({
    input: z.object({ pageId: z.string() }),
    handler: async ({ pageId }, context) => {
      const session = context.session;
      if (!session) {
        throw new ActionError({
          message: "Session not available",
          code: "SERVICE_UNAVAILABLE",
        });
      }
      const { env } = context.locals.runtime;
      if (
        await shouldIncrementViews(
          pageId,
          session,
          env.FINGERPRINT_BY_IP,
          context.clientAddress,
        )
      ) {
        return await incrementViews(pageId, session);
      }
    },
  }),
};
