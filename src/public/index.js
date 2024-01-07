
const socket = io();

deleteProduct = (id) => {
    fetch(`/api/products/${id}`,{
        method: 'delete',
    })
    .then(result => result.json())
    .then(result =>{
        if(result.status === 'error') throw new Error(result.error);
        socket.emit('productList', result.payload);
        window.location.reload()
        alert(`Producto Eliminado`);
        window.location.reload()
    })
    .catch(err => alert(`Producto Eliminado`));
    window.location.reload()
};


