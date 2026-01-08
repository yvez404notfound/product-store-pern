import { sql } from "../config/db.js";

// region GET
const getProducts = async (req, res) => {
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

const getProduct = async (req, res) => {
	const { id } = req.params;

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
const createProduct = async (req, res) => {
	const { name, price, image } = req.body;

	if (!name || !price || !image) {
		return res.status(400).json({
			status: "Not Found",
			message: "Please fill all the input fields.",
		});
	}

	try {
		const product = await sql`
			INSERT INTO products (name, price, image)
			VALUES (${name}, ${price}, ${image})
			RETURNING *
		`;

		return res.status(201).json({
			status: "Created",
			data: product,
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
const updateProduct = async (req, res) => {
	const { id } = req.params;
	const { name, price, image } = req.body;

	try {
		const updatedProduct = await sql`
			UPDATE products
			SET name=${name}, price=${price}, image=${image}
			WHERE id=${id}
			RETURNING *
		`;

		if (updatedProduct.length === 0) {
			return res.status(404).json({
				status: "Not Found",
				message: "Product does not exists.",
			});
		}

		return res.status(200).json({
			status: "Success",
			message: "Product updated successfully.",
			data: updatedProduct,
		});
	} catch (error) {
		console.log("updateProduct Error: ", error);
		return res.status(500).json({
			status: "Failed",
			message: "Internal Server Error",
		});
	}
};
//endregion

//region DELETE
const deleteProduct = async (req, res) => {
	const { id } = req.params;

	try {
		const deletedProduct = await sql`
			DELETE FROM products
			WHERE id=${id}
			RETURNING *
		`;

		if (deletedProduct.length === 0) {
			return res.status(404).json({
				status: "Not Found",
				message: "Product does not exists.",
			});
		}

		return res.status(200).json({
			status: "Success",
			message: "Product deleted successfully.",
			data: deletedProduct,
		});
	} catch (error) {
		console.log("deleteProduct Error: ", error);
		return res.status(500).json({
			status: "Failed",
			message: "Internal Server Error",
		});
	}
};
//endregion

export { createProduct, deleteProduct, getProduct, getProducts, updateProduct };
