const ResponseMsg = {
    Success: "Successfully processed the request.",
    Errror: "An error occurred. Please try again.",
    AccessDenied: "So sorry! Access Denied!"
};

const ResponseStatus = {
    Success: 1,
    Errror: 2,
    AccessDenied: 3
};

const ResponseSuccess = {
    Status: ResponseStatus.Success,
    Message: ResponseMsg.Success,
    Data: ""
};

const ResponseError = {
    Status: ResponseStatus.Errror,
    Message: ResponseMsg.Errror,
    Data: ""
};

const ResponseAccessDenied = {
    Status: ResponseStatus.AccessDenied,
    Message: ResponseMsg.AccessDenied,
    Data: ""
};

module.exports.Success = ResponseSuccess;
module.exports.Errror = ResponseError;
module.exports.AccessDenied = ResponseAccessDenied;
