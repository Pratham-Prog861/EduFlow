import { ConvexHttpClient } from "convex/browser";

/**
 * Global Convex Client
 * High-speed HTTP interface for the browser to communicate with the Convex state server.
 */
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export default convex;
