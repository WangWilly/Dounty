import type { NextConfig } from "next";

////////////////////////////////////////////////////////////////////////////////

export const basePath =
  process.env.IN_GITHUB_WORKER === "true" ? "/Dounty" : "";

const nextConfig: NextConfig = {
  /**
   * Enable static exports for the App Router.
   *
   * @see https://nextjs.org/docs/app/building-your-application/deploying/static-exports
   */
  output: "export",

  // /**
  //  * Set base path. This is the slug of your GitHub repository.
  //  *
  //  * @see https://nextjs.org/docs/app/api-reference/next-config-js/basePath
  //  */
  // basePath: "/nextjs-github-pages",
  // https://stackoverflow.com/questions/61117865/how-to-set-environment-variable-in-node-js-process-when-deploying-with-github-ac
  basePath,

  /**
   * Disable server-based image optimization. Next.js does not support
   * dynamic features with static exports.
   *
   * @see https://nextjs.org/docs/app/api-reference/components/image#unoptimized
   */
  images: {
    unoptimized: true,
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
