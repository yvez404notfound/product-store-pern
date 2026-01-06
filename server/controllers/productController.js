import { sql } from "../config/db.js";

// region GET
const getProducts = async (res, req) => {
	try {
		const products = await sql`
			SELECT * FROM products 
			ORDER BY createdAt DESC
		`;

		return res.status(200).json({
			status: "Success",
			data: products,
			message: "All products fetched successfully.",
		});
	} catch (error) {
		console.log("getProduct Error: ", error);
		return res.status(500).json({
			status: "Failed",
			message: "Internal Server Error",
		});
	}
};

const getProduct = async (res, req) => {
	const id = req.id;

	try {
		const product = await sql`
			SELECT * FROM products WHERE id=${id}

		`;

		return res.status(200).json({
			status: "Success",
			data: product,
			message: "Product fetched successfully.",
		});
	} catch (error) {
		console.log("getProduct Error: ", error);
		return res.status(500).json({
			status: "Failed",
			message: "Internal Server Error",
		});
	}
};
// endregion

//region POST
const createProduct = async (res, req) => {
	const { name, price, image } = req.body;

	if (!name || !price || !image) {
		return res.status(400).json({
			status: "Not Found",
			message: "Please fill all the input fields.",
		});
	}

	try {
		const response = await sql`
			INSERT INTO products (name, price, image)
			VALUES (${name}, ${price}, ${image})
			RETURNING *
		`;

		return res.status(201).json({
			status: "Created",
			data: response,
			message: "New product created.",
		});
	} catch (error) {
		console.log("createProduct Error: ", error);
		return res.status(500).json({
			status: "Failed",
			message: "Internal Server Error",
		});
	}
};
//endregion

//region PUT
const updateProduct = async (res, req) => {
	return res.status(200).json({
		status: "Success",
		message: "API endpoint is working",
	});
};
//endregion

//region DELETE
const deleteProduct = async (res, req) => {
	return res.status(200).json({
		status: "Success",
		message: "API endpoint is working",
	});
};
//endregion

export { createProduct, deleteProduct, getProduct, getProducts, updateProduct };
