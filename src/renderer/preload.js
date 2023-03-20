const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('myApi', {
    newProduct: (product) => ipcRenderer.send('product:new', product),
    getProducts: () => ipcRenderer.invoke('products:get'),
    deleteProduct: (id) => ipcRenderer.send('product:delete', id),
    editProduct: (id) => ipcRenderer.invoke('product:edit', id),
    updateProduct: (product, id) => ipcRenderer.send('product:update', product, id)
})