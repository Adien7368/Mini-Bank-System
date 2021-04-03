
const errorHandlers = (err, req, res, next) => {
    console.log("ErrorHandler....", err);
    res.status(CODE[err.code]);
    res.send(err);
}


const CODE = {
    RequestThrottled: 429,
	BandwidthLimitExceeded: 509,
	Locked: 423,
	RequestTimeout: 408,
	InsufficientStorage: 507,
	UnsupportedMediaType: 415,
	BadGateway: 502,
	VariantAlsoNegotiates: 506,
	BadRequest: 400,
	RequestEntityTooLarge: 413,
	HttpVersionNotSupported: 505,
    BadDigest: 400,
	ResourceNotFound: 404,
	FailedDependency: 424,
	Internal: 500,
	MethodNotAllowed: 405,
	UnprocessableEntity: 422,
	UpgradeRequired: 426,
	InvalidHeader: 400,
	InvalidVersion: 400,
	TooManyRequests: 429,
	UnorderedCollection: 425,
	BadMethod: 405,
	InvalidArgument: 409,
	NetworkAuthenticationRequired: 511,
	ProxyAuthenticationRequired: 407,
	LengthRequired: 411,
	RequestExpired: 400,
	NotFound: 404,
	MissingParameter: 409,
	ServiceUnavailable: 503,
	PreconditionFailed: 412,
	RequestedRangeNotSatisfiable: 416,
	PreconditionRequired: 428,
	ExpectationFailed: 417,
	NotAuthorized: 403,
	PaymentRequired: 402,
	RangeNotSatisfiable: 416,
	WrongAccept: 406,
	Unauthorized: 401,
	NotImplemented: 501,
	InvalidContent: 400,
	NotExtended: 510,
	NotAcceptable: 406,
	GatewayTimeout: 504,
	InvalidCredentials: 401,
	ImATeapot: 418,
	Gone: 410,
	RequestHeaderFieldsTooLarge: 431,
	Forbidden: 403,
	Conflict: 409,
	InternalServer: 500,
	RequesturiTooLarge: 414,
	success: 200
};


module.exports = {errorHandlers, CODE};