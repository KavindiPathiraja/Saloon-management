import express from 'express';
import { Pkg } from '../Models/Pkg.js';
import mongoose from 'mongoose';

const router = express.Router();

// Middleware for validating required fields
const validateFields = (req, res, next) => {
    const requiredFields = [
        "description",
        "base_price",
        "discount_rate",
        "final_price",
        "start_date",
        "end_date",
        "conditions",
        "image_url",
        "package_type",
        "service_ID",
        "p_name",
    ];

    for (const field of requiredFields) {
        if (!req.body[field]) {
            return res.status(400).send({ message: `Field '${field}' cannot be empty` });
        }
    }
    next();
};

 /* // Route for retrieving a specific package by ID
router.get('/:identifier', async (req, res) => {
    try {
        const { identifier } = req.params;

        let p;
        
        // Check if the identifier is a valid MongoDB ObjectId
        if (mongoose.Types.ObjectId.isValid(identifier)) {
            // Fetch by MongoDB ObjectId
            p = await Package.findById(identifier);
        } else {
            // Fetch by custom string identifier
            p = await Package.findOne({ service_ID: identifier });
        }

        if (p) {
            return res.status(200).json(service);
        } else {
            return res.status(404).send({ message: 'Service not found' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Error fetching service: ' + error.message });
    }
}); */

// Route to create a new package
router.post('/', validateFields, async (req, res) => {
    try {
        const newPackage = {
            description: req.body.description,
            base_price: req.body.base_price,
            discount_rate: req.body.discount_rate,
            final_price: req.body.final_price,
            start_date: req.body.start_date,
            end_date: req.body.end_date,
            conditions: req.body.conditions,
            image_url: req.body.image_url,
            package_type: req.body.package_type,
            service_ID: req.body.service_ID,
            p_name: req.body.p_name,
        };

        const createdPkg = await Pkg.create(newPackage);
        return res.status(201).send(createdPkg);
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message });
    }
});


// Route to get all packages
router.get('/', async (req, res) => {
    try {
        const getPackages = await Pkg.find({});
        return res.status(200).json(getPackages);
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message });
    }
});

// Route to get a package by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const foundPackage = await Pkg.findById(id);

        if (!foundPackage) {
            return res.status(404).json({ message: 'Package not found' });
        }

        return res.status(200).json(foundPackage);
    } catch (error) {
        console.log(error.message); // Debugging: Log the error
        res.status(500).send({ message: error.message });
    }
});

// Route to update a package
router.put('/:id', validateFields, async (req, res) => {
    try {
        const { id } = req.params;

        const updatedPackage = await Pkg.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedPackage) {
            return res.status(404).json({ message: 'Package not found' });
        }

        return res.status(200).send({ message: 'Package updated successfully', updatedPackage });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message });
    }
});

// Route to delete a package
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const deletedPackage = await Pkg.findByIdAndDelete(id);

        if (!deletedPackage) {
            return res.status(404).json({ message: 'Package not found' });
        }

        return res.status(200).send({ message: 'Package deleted successfully' });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message });
    }
});

export default router;
