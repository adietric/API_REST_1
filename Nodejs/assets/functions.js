
const success = (result) => {
	return	{
		status: 'success',
		result: result
	}
}

const error = (message) => {
	return	{
		status: 'error',
		result: message
	}
}

const isErr = (err) => {
	return (err instanceof Error)
}

const checkAndChange = (object) => {
	if (this.isErr(object))
		return this.error(object.message)
	else
		return this.success(object)
}


exports.checkAndChange 	= checkAndChange
exports.isErr	 		= isErr
exports.success 		= success
exports.error 			= error