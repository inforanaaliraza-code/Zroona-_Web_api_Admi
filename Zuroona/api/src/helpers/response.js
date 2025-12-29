const Response = {
    ok: (res, data = {}, statusCode = 200, message = "success",total_count=0,status=1) => {
        return res.status(statusCode).json({ status,message, data,total_count });
    },

    notFoundResponse: (res, message = "not found") => {
        return res.status(404).json({ status: 0, message, data : {}  ,total_count:0});
    },

    badRequestResponse: (res, message = "bad request",total_count=0) => {
        return res.status(400).json({ status: 0, message, data:{} ,total_count});
    },

    conflictResponse: (res, data = {}, statusCode = 409, message = "conflict",total_count=0) => {
        return res.status(statusCode).json({ status: 0, message, data ,total_count});
    },

    serverErrorResponse: (res,message = "internal server error", data = {}, statusCode = 500, total_count=0) => {
        return res.status(statusCode).json({ status: 0, message, data , total_count});
    },

    forbiddenResponse: (res, data = {}, statusCode = 403, message = "forbidden",total_count=0) => {
        return res.status(statusCode).json({ status: 0, message, data , total_count});
    },

    unauthorizedResponse: (res, data = {}, statusCode = 401, message = "unauthorized",total_count=0) => {
        return res.status(statusCode).json({ status: 0, message, data, total_count });
    },

    unprocessableEntityResponse: (res, data = {}, statusCode = 422, message = "unprocessable entity",total_count=0) => {
        return res.status(statusCode).json({ status: 0, message, data , total_count});
    },

    createdResponse: (res, data = {}, statusCode = 201, message = "resource created successfully",total_count=0) => {
        return res.status(statusCode).json({ status: 1, message, data , total_count});
    },

    validationErrorResponse: (res, message = "validation error", data = {}, statusCode = 422, total_count=0) => {
        return res.status(statusCode).json({ status: 0, message, data, total_count });
    }
};

module.exports = Response;
