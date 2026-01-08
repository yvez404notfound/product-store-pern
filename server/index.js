import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import { sql } from "./config/db.js";
import { aj } from "./lib/arcjet.js";
import productRoutes from "./routes/productRoutes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

// region Middlewares
app.use(express.json()); // For parsing JSON data sent to the server
app.use(cors()); // Configures API response header to allow access
app.use(helmet()); // For protecting the app by setting various HTTP headers
app.use(morgan("combined")); // Logs request to console

// Arc Jet API rate limiting
app.use(async (req, res, next) => {
	try {
		const decision = await aj.protect(req, {
			requested: 1,
		});

		if (decision.isDenied()) {
			if (decision.reason.isRateLimit()) {
				return res.status(429).json({
					status: "Too Many Requests",
					message: "Too many requests, please try again later.",
				});
			} else if (decision.reason.isBot()) {
				res.status(403).json({
					status: "Forbidden",
					message: "Bot access is denied.",
				});
			} else {
				res.status(500).send("Internal Server Error");
			}
			return;
		}

		// Check spoofed bots
		if (
			decision.results.some(
				(result) => result.reason.isBot() && result.reason.isSpoofed()
			)
		) {
			res.status(403).json({
				status: "Forbidden",
				message: "Spoofed bot detected.",
			});
			return;
		}

		next();
	} catch (error) {
		console.error("Arcjet Error: ", error);
		next(error);
	}
});

// endregion

// region API Routes
app.get("/api/v1/test", (res, req) => {
	return req.status(200).json({
		status: "Success",
		message: "API endpoint is working",
	});
});
app.use("/api/v1/products", productRoutes);
// endregion

const initDB = async () => {
	try {
		console.log("Initializing database...");

		await sql`
			CREATE TABLE IF NOT EXISTS products (
				id SERIAL PRIMARY KEY,
				name VARCHAR(255) NOT NULL,
				image VARCHAR(255) NOT NULL,
				price DECIMAL(10, 2) NOT NULL,
				createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
			)
		`;

		console.log("Database initialization completed.");
	} catch (error) {
		console.error(error);
	}
};

initDB().then(() => {
	app.listen(PORT, () => {
		console.log("Server is UP and RUNNING at PORT " + PORT);
	});
});
