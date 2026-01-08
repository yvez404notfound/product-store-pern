import arcjet, { detectBot, shield, tokenBucket } from "@arcjet/node";
import dotenv from "dotenv";

dotenv.config();
const API_KEY = process.env.ARCJET_KEY;
const ENV = process.env.ARCJET_ENV;

export const aj = arcjet({
	key: API_KEY,
	characteristics: ["ip.src"],
	rules: [
		// Protect app from common attacks (SQL injection, XSS, CSRF)
		shield({ mode: "LIVE" }),

		detectBot({
			mode: "LIVE",
			allow: ["CATEGORY:SEARCH_ENGINE"], // Block bots except search engines
		}),

		// API rate limiting
		tokenBucket({
			mode: "LIVE",
			refillRate: 5,
			interval: 10,
			capacity: 10,
		}),
	],
});
