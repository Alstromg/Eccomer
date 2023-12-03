const EErros =  require("../services/errors/enums.js");

const errores = (error, req, res, next) => {
    console.log(error.cause)

    switch (error.code) {
        case EErros.INVALID_TYPES_ERROR:
            res.status(400).send({ status: 'error', error: error.name})
            break;
        default:
            res.send({ status: 'error', error: 'Unhandled error'})
            break;
    }
}
module.exports = errores