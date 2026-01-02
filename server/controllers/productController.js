// region GET
const getAllProducts = async (res, req) => {
	return req.status(200).json({
		status: "Success",
		message: "API endpoint is working",
	});
};
// endregion

//region POST
const createProduct = async (res, req) => {
	return req.status(200).json({
		status: "Success",
		message: "API endpoint is working",
	});
};
//endregion

export { createProduct, getAllProducts };
