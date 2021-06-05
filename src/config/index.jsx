const dev = process.env.NODE_ENV !== "production";

export const server = dev
  ? "http://localhost:3000"
  : "https://blog-zhyph.vercel.app/";
//Production
// : "https://blog-git-artur-zhyph.vercel.app";
//Preview
