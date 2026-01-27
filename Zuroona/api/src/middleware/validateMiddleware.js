const Response = require("../helpers/response");

const Validator = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: true });
        if (error) {
            const formatErrorMessage = (error) => {
                const detail = error.details[0];
                let message = detail.message;
                
                const key = detail.context.key;
                if (key) {
                    const label = key.replace(/"/g, '');
                    message = message.replace(`"${key}"`, label);
                }
                return message;
            };
            const message = formatErrorMessage(error);
           
            return Response.badRequestResponse(res,  message);
        }
        next();
    };
};

module.exports = Validator;
