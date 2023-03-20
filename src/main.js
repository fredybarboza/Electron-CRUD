const { app, BrowserWindow, ipcMain, Notification } = require('electron')
const { getConnection } = require('./database')
const path = require('path')


const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'renderer/preload.js')
        }
    })

    win.loadFile('src/renderer/index.html')
}

async function newProduct (event, product) {
    try {
        const conn = await getConnection();
        product.price = parseFloat(product.price);

        await conn.query('INSERT INTO product SET ?', product);

        new Notification({
            title: 'My App',
            body: 'New product saved successfully'
        }).show();
        
    } catch (error) {
        console.log(error)
    }
}

async function deleteProduct (event, id) {
    try {
        const conn = await getConnection();
        await conn.query('DELETE FROM product WHERE id = ?', id);

        new Notification({
            title: 'My App',
            body: 'The product has been deleted'
        }).show();

    } catch (error) {
        console.log(error)
    }
}

async function getProducts () {
    try {

       const conn = await getConnection();
       const products = await conn.query('SELECT * FROM product');
       return products;
       
    } catch (error) {
        console.log(error)
    }
}

async function editProduct (event, id) {
    try {

        const conn = await getConnection();
        const product = await conn.query('SELECT * FROM product WHERE id = ?', id);
        return product[0];
        
     } catch (error) {
         console.log(error)
     }
}

async function updateProduct (event, product, id) {
    try {

        const conn = await getConnection();
        await conn.query('UPDATE product SET ? WHERE id = ?', [product, id]);

        new Notification({
            title: 'My App',
            body: 'The product has been updated'
        }).show();
        
     } catch (error) {
         console.log(error)
     }
}

app.whenReady().then(() => {
    ipcMain.on('product:new', newProduct),
    ipcMain.on('product:delete', deleteProduct),
    ipcMain.on('product:update', updateProduct),
    ipcMain.handle('product:edit', editProduct),
    ipcMain.handle('products:get', getProducts),
    createWindow()
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})