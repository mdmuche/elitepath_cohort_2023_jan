const express = require("express");
const { product } = require("../model/prodModel");
const { cloudinary } = require("../utils/cloudinary");
const upload = require("../utils/multer");
let router = express.Router();

router.get('/', (req, res)=> {
    // res.json({allproduct: "Homepage"});
    product.find()
    .then(ans=>{
        res.json(ans);
    })
    .catch(err=>{
        res.json(err.message);
    })
})
router.post('/createproduct', upload.single('prodImg'), async(req, res)=> {
    // console.log(req.file)
    // if (req.file) {
    //     console.log("this request has a file");
    //     console.log(req.file)
    //     console.log(req.body)
    // } else {
    //    console.log("this request does not have a file"); 
    // }
    // res.json({create: "new product created"});

    //>upload the image to cloudinary
    let result = await cloudinary.uploader.upload(req.file.path, 
        {folder: 'New_cohort8_product'});
    // console.log(result);
    // res.json(result);

    //>extract the public_url and public_id from cloudinary success response
    let prodImg_id = result.public_id;
    let prodImg_url = result.secure_url;
    let {prodName, prodPrice, prodSnippet, prodDetails} = req.body;

    //>add public_url and public_id to meet productschema requirement
    let toDb = {
        prodDetails,
        prodName,
        prodPrice,
        prodSnippet,
        prodImg_id,
        prodImg_url
    }

    //> save to mongoDB and send a json response
    let db = new product(toDb);
    db.save()
    .then(ans=>{
        res.json(ans);
    })
    .catch(err=>{
        res.json(err.message);
    })
})
router.post('/deleteproduct', async(req, res, next)=> {
    //get id
    let {id} = req.body;
    try {
        // res.json(req.body);
        // get product to delete
        let toDel = await product.findById(id);
        // res.json(toDel.prodImg_id);
        //remove from cloudinary
        let remImg = await cloudinary.uploader.destroy(toDel.prodImg_id);
        //now delete from db
        product.findByIdAndDelete(id)
        .then(ans=>{
            res.json(ans);
        })
        .catch(err=>{
            res.json(err.message);
                
        });
        } catch (error) {
            next(error);
            
        }
        // res.json({delete: "product deleted"});
    
});

router.patch('/updateproduct', upload.single('prodImg'), async(req, res)=> {
    let {prodName, prodPrice, prodDetails, prodSnippet, id} = req.body;
    // console.log(upd);
    // res.json({update: upd, id});
    //put all the defined key from req.body to upd
    let upd = {};
    if(prodName) {
        upd['prodName'] = prodName;
    }
    if(prodPrice) {
        upd['prodPrice'] = prodPrice;
    }
    if(prodDetails) {
        upd['prodDetails'] = prodDetails;
    }
    if(prodSnippet) {
        upd['prodSnippet'] = prodSnippet;
    }
    console.log(upd)
    if (req.file) {
        // res.json({res: "this request has a file", id, upd});
        //get product from db using id
        let toUpd = await product.findById(id);
        //delete img from cloudinary using prodImg_id from toUpd
        let remImg = await cloudinary.uploader.destroy(toUpd.prodImg_id);
        //upload new img to cloudinary
        let newImg = await cloudinary.uploader.upload(req.file.path,
            {folder: "New_cohort8_product"});
            //add prodImg_id and prodImg_url to upd
            upd['prodImg_id'] = newImg.public_id;
            upd['prodImg_url'] = newImg.secure_url;
            //update db
            product.findByIdAndUpdate(id, {$set: upd})
            .then(ans=>{
                res.json({status: true});
            })
            .catch(err=>{
                res.json({status: false});
            })
    } else {
        // res.json({res: "this request doesn't have a file", upd});
        product.findByIdAndUpdate(id, {$set: upd})
        .then(ans=>{
            res.json({status: true});
        })
        .catch(err=>{
            res.json({status: false});
        })
    }
    // res.json({update: "product updated"});
})
router.get('/single/:id', (req, res)=> {
    let {id} = req.params;
    // res.json({single: ` single product with id: ${id} `});
    product.findById(id)
    .then(ans=>{
        res.json(ans);
    })
    .catch(err=>{
        res.json({status: false});
    });
})

router.post("/like", (req, res)=>{
    let {id, like} = req.body;
    product.findByIdAndUpdate(id, {$inc: {'prodLikes': like}})
    .then(ans=>{
        res.json({status: true});
    })
    .catch(err=>{
        res.json({status: false});
    })
    // res.json({id, like});
})

//create/ upload test route with front end  ui
router.patch('/updateproduct', upload.single('prodImg'), (req, res)=>{
    if (req.file) {
      res.json({status: 'this axios post has a file',
        body: req.body,
        file: req.file});
    } else {
        res.json({
            status: 'this axios post does not have a file',
            body: req.body});
        }
});

router.get('*', (req, res)=> {
    res.json({error: "unknown url. please recheck..."});
})



module.exports = {
    router,
}