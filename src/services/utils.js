
const {faker} = require('@faker-js/faker');

const generateUser = () => {
    return {
        title: faker.commerce.productMaterial(),
        description: faker.commerce.productDescription(),
        price:faker.commerce.price({ min: 100, max: 200 }),
        category:faker.commerce.productMaterial(),
        stock: faker.datatype.number({ max: 100 }),
        code: faker.finance.currencyCode(),
    }
}
module.exports = {generateUser};