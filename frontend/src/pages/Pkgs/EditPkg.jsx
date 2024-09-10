import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import DatePicker from "react-datepicker"; 
import "react-datepicker/dist/react-datepicker.css";

const EditPkg = () => {
    const [description, setDescription] = useState('');
    const [base_price, setBasePrice] = useState('');
    const [discount_rate, setDiscount] = useState('');
    const [final_price, setFinalPrice] = useState('');
    const [start_date, setStartDate] = useState('');
    const [end_date, setEndDate] = useState('');
    const [conditions, setCondition] = useState('');
    const [image_url, setImage] = useState('');
    const [package_type, setType] = useState('');
    const [p_name, setPName] = useState('');
    const [service_ID, setServiceID] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { id } = useParams();

    // Fetch the existing package details when the component mounts
    useEffect(() => {
        const fetchPkg = async () => {
            try {
                const { data } = await axios.get(`http://localhost:8076/pkg/${id}`);
                setDescription(data.description);
                setBasePrice(data.base_price);
                setDiscount(data.discount_rate);
                setFinalPrice(data.final_price);
                setStartDate(data.start_date);
                setEndDate(data.end_date);
                setCondition(data.conditions);
                setImage(data.image_url);
                setType(data.package_type);
                setPName(data.p_name);
                setServiceID(data.service_ID);
            } catch (error) {
                console.error(error);
                setError('Failed to fetch the package details.');
            }
        };

        fetchPkg();
    }, [id]);

    // Calculate final price based on base price and discount rate
    useEffect(() => {
        if (base_price && discount_rate) {
            const discount = parseFloat(discount_rate) / 100;
            const final = parseFloat(base_price) * (1 - discount);
            setFinalPrice(final.toFixed(2));
        }
    }, [base_price, discount_rate]);

    const handleSavePackage = async (e) => {
        e.preventDefault();
        try {
            const selectedTypes = Object.keys(package_type).filter(type => package_type[type]);

            await axios.put(`http://localhost:8076/pkg/${id}`, {
                description,
                base_price,
                discount_rate,
                final_price,
                start_date,
                end_date,
                conditions,
                image_url,
                package_type,
                p_name,
                service_ID,
            });
            navigate('/pkg/allPkg');
        } catch (error) {
            console.error(error);
            setError('An error happened. Please check console');
        }
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setType(prevType => ({
            ...prevType,
            [name]: checked
        }));
    };

    return (
        <div className="container mx-auto p-6" style={{ maxWidth: '600px' }}>
            <h1 className="text-3xl font-bold mb-6">Edit Package</h1>
            {error && <p className='text-red-600'>{error}</p>}
            <form
                onSubmit={handleSavePackage}
                className='space-y-4 border border-gray-300 p-4 rounded shadow-md'
            >
                {/* Service ID */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Service ID
                    </label>
                    <input
                        type="text"
                        name="service_ID"
                        value={service_ID}
                        onChange={(e) => setServiceID(e.target.value)}
                        required
                        className="border rounded w-full py-2 px-3 text-gray-700"
                    />
                </div>

                {/* Package Name */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Package Name
                    </label>
                    <input
                        type="text"
                        name="p_name"
                        value={p_name}
                        onChange={(e) => setPName(e.target.value)}
                        required
                        className="border rounded w-full py-2 px-3 text-gray-700"
                    />
                </div>

                {/* Package Type */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Package Type
                    </label>
                    <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={package_type === 'Standard'}
                onChange={() => setType('Standard')}
                className="mr-2"
              />
              Standard
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={package_type === 'Promotional'}
                onChange={() => setType('Promotional')}
                className="mr-2"
              />
              Promotional
            </label>
          </div>
                </div>

                {/* Description */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Description
                    </label>
                    <input
                        type="text"
                        name="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        className="border rounded w-full py-2 px-3 text-gray-700"
                    />
                </div>

                {/* Base Price */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Base Price
                    </label>
                    <input
                        type="number"
                        name="base_price"
                        value={base_price}
                        onChange={(e) => setBasePrice(e.target.value)}
                        required
                        className="border rounded w-full py-2 px-3 text-gray-700"
                    />
                </div>

                {/* Discount Rate */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Discount Rate (%)
                    </label>
                    <input
                        type="number"
                        name="discount_rate"
                        value={discount_rate}
                        onChange={(e) => setDiscount(e.target.value)}
                        required
                        className="border rounded w-full py-2 px-3 text-gray-700"
                    />
                </div>

                {/* Final Price (Auto-calculated) */}
                <div className="mb-4">
                    <label className="block text-gray-700">Final Price (Rs):</label>
                    <input
                        type="number"
                        name="final_price"
                        value={final_price}
                        required
                        readOnly
                        className="border rounded w-full py-2 px-3 bg-gray-200"
                    />
                </div>

                {/* Start Date */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Start Date
                    </label>
                    <DatePicker
                        selected={start_date}
                        onChange={(date) => setStartDate(date)}
                        required
                        dateFormat="yyyy-MM-dd"
                        className="border rounded w-full py-2 px-3 text-gray-700"
                    />
                </div>

                {/* End Date */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        End Date
                    </label>
                    <DatePicker
                        selected={end_date}
                        onChange={(date) => setEndDate(date)}
                        required
                        dateFormat="yyyy-MM-dd"
                        className="border rounded w-full py-2 px-3 text-gray-700"
                    />
                </div>

                {/* Conditions */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Conditions
                    </label>
                    <textarea
                        name="conditions"
                        value={conditions}
                        onChange={(e) => setCondition(e.target.value)}
                        required
                        className="border rounded w-full py-2 px-3 text-gray-700"
                    />
                </div>

                {/* Image URL */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Image URL
                    </label>
                    <input
                        type="text"
                        name="image_url"
                        value={image_url}
                        onChange={(e) => setImage(e.target.value)}
                        required
                        className="border rounded w-full py-2 px-3 text-gray-700"
                    />
                </div>

                <button
                    type='submit'
                    className='p-2 bg-sky-300 rounded text-white'
                >
                    Update Package
                </button>
            </form>
        </div>
    );
};

export default EditPkg;
