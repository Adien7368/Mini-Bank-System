
// to validate email
const isEmailValid = (email) => {
	let status = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.trim());
	return status;
};

module.exports = { isEmailValid };