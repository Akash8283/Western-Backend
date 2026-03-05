const products = require('../models/productModel')

// add product
exports.addProduct = async (req, res) => {
    console.log("Inside addProduct controller");
    const { name, category, price, stock, description, image } = req.body

    try {
        const existingProduct = await products.findOne({ name })
        if (existingProduct) {
            res.status(406).json("Product already exists!")
        } else {
            const newProduct = new products({
                name, category, price, stock, description, image
            })
            await newProduct.save()
            res.status(200).json(newProduct)
        }
    } catch (err) {
        res.status(401).json(err)
    }
}

// get all products
exports.getAllProducts = async (req, res) => {
    console.log("Inside getAllProducts controller");
    try {
        const allProducts = await products.find()
        res.status(200).json(allProducts)
    } catch (err) {
        res.status(401).json(err)
    }
}

// delete product
exports.deleteProduct = async (req, res) => {
    console.log("Inside deleteProduct controller");
    const { id } = req.params
    try {
        const result = await products.findByIdAndDelete(id)
        res.status(200).json(result)
    } catch (err) {
        res.status(401).json(err)
    }
}

// edit product
exports.editProduct = async (req, res) => {
    console.log("Inside editProduct controller");
    const { id } = req.params
    const { name, category, price, stock, description, image } = req.body
    try {
        const updatedProduct = await products.findByIdAndUpdate(id, {
            name, category, price, stock, description, image
        }, { new: true })
        res.status(200).json(updatedProduct)
    } catch (err) {
        res.status(401).json(err)
    }
}
