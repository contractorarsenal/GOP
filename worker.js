export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.hostname === "goldenoakpainting.com") {
      url.hostname = "www.goldenoakpainting.com";
      return Response.redirect(url.toString(), 301);
    }

    return env.ASSETS.fetch(request);
  },
};
