const generateInfo = product => {
    return `
    id invalido.(${product})  
`
}
const generateInfopost = product =>{
    return`
    producto con nombre(${product}) ya existe o no rellenas los campos correctamente verifica la informaccion `
}

module.exports = {generateInfo, generateInfopost}