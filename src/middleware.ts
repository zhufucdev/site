import { sequence, defineMiddleware } from "astro:middleware";

const { POST_AUTH_KEY } = import.meta.env;
const interceptApiIfUnauthenticated = defineMiddleware(
  async (context, next) => {
    if (!context.url.pathname.startsWith("/api")) {
      return next();
    }
    if (process.env.NODE_ENV !== "development" && !POST_AUTH_KEY) {
      console.warn(
        "Post authorization key is not set in production. This request and future ones will failed.",
      );
      return context.redirect("/404");
    }
    if (
      POST_AUTH_KEY &&
      context.request.headers.get("x-post-auth-key") !== POST_AUTH_KEY
    ) {
      return context.redirect("/404");
    }
    return next();
  },
);

export const onRequest = sequence(
  interceptApiIfUnauthenticated,
);
