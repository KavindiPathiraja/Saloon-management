import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import Spinner from "../../components/Spinner";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { app } from "../../config/firebase";
import backgroundImage from "../../images/logobg.jpg";
import Logo from '../../images/logo.png';

const EditCustomer = () => {
  const [customer, setCustomer] = useState({
    CusID: '',
    FirstName: '',
    LastName: '',
    Age: '',
    Gender: '',
    ContactNo: '',
    Email: '',
    Password: '',
    reEnteredPassword: '',
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState('');

  const storage = getStorage(app);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:8076/customers/${id}`)
      .then((response) => {
        setCustomer(response.data);
        setLoading(false);
        if (response.data.image) {
          setImagePreview(response.data.image);
        }
      })
      .catch((error) => {
        setLoading(false);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'An error occurred. Please try again later.',
        });
        console.log(error);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let error = "";

    // Validation logic
    if (name === 'ContactNo' && !/^(07\d{8})$/.test(value)) {
      error = "Phone number must start with '07' and be exactly 10 digits long.";
    }

    if (name === 'FirstName' && !/^[A-Z][a-z]*$/.test(value)) {
      error = "First name must start with a capital letter and contain only letters.";
    }

    if (name === 'LastName' && !/^[A-Z][a-z]*$/.test(value)) {
      error = "Last name must start with a capital letter and contain only letters.";
    }

    if (name === 'Age') {
      const ageValue = Number(value);
      if (isNaN(ageValue) || ageValue < 0 || ageValue > 120) {
        error = "Age must be a number between 0 and 120.";
      }
    }

    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: error
    }));

    setCustomer(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleImageChange = async (e) => {
    if (e.target.files[0]) {
      const imageFile = e.target.files[0];
      setCustomer(prevState => ({
        ...prevState,
        image: imageFile,
      }));
      setImagePreview(URL.createObjectURL(imageFile));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setLoading(true);
    
    // Check for errors before proceeding
    if (Object.values(errors).some(err => err !== "")) {
      setLoading(false);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please correct the errors in the form.',
      });
      return;
    }
    
    try {
      let imageUrl = customer.image ? await getDownloadURL(ref(storage, `customer_images/${id}`)) : '';

      if (customer.image && customer.image instanceof File) {
        const storageRef = ref(storage, `customer_images/${id}`);
        const uploadTask = uploadBytesResumable(storageRef, customer.image);

        await uploadTask;
        imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
      }

      const updatedCustomer = { ...customer, image: imageUrl };
      axios.patch(`http://localhost:8076/customers/${id}`, updatedCustomer)
        .then((response) => {
          setLoading(false);
          if (response.status === 200) {
            navigate(`/customers/`);
          } else {
            console.error('Unexpected response status:', response.status);
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Unexpected response status. Please try again later.',
            });
          }
        })
        .catch((error) => {
          setLoading(false);
          console.error('Error updating customer:', error);
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'An error occurred while updating the customer. Please try again later.',
          });
        });
    } catch (error) {
      setLoading(false);
      console.error('Error updating customer:', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'An error occurred while updating the customer. Please try again later.',
      });
    }
  };

  const containerStyle = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };

  return (
    <div style={containerStyle}>
      <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-4xl">
          <img className="mx-auto h-10 w-auto" src={Logo} alt="logo" style={{ width: '50px', height: '50px', marginRight: '400px'}} />
          <h2 className="mt-6 text-center text-3xl leading-9 font-extrabold text-gray-900">
            Edit Customer Information
          </h2>
          <p className="mt-2 text-center text-sm leading-5 text-gray-500 max-w">
            <a href="/cLogin" className="font-medium text-pink-600 hover:text-pink-500 focus:outline-none focus:underline transition ease-in-out duration-150">
              Login to your account
            </a>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* First Name */}
              <div>
                <label htmlFor="FirstName" className="block text-sm font-medium leading-5 text-gray-700">First Name</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    id="FirstName"
                    name="FirstName"
                    placeholder="John"
                    type="text"
                    value={customer.FirstName}
                    onChange={handleChange}
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                  />
                  {errors.FirstName && <p className="text-red-500 text-xs">{errors.FirstName}</p>}
                </div>
              </div>

              {/* Last Name */}
              <div>
                <label htmlFor="LastName" className="block text-sm font-medium leading-5 text-gray-700">Last Name</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    id="LastName"
                    name="LastName"
                    placeholder="Doe"
                    type="text"
                    value={customer.LastName}
                    onChange={handleChange}
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                  />
                  {errors.LastName && <p className="text-red-500 text-xs">{errors.LastName}</p>}
                </div>
              </div>

              {/* Age */}
              <div>
                <label htmlFor="Age" className="block text-sm font-medium leading-5 text-gray-700">Age</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    id="Age"
                    name="Age"
                    type="number"
                    value={customer.Age}
                    onChange={handleChange}
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                  />
                  {errors.Age && <p className="text-red-500 text-xs">{errors.Age}</p>}
                </div>
              </div>

              {/* Gender */}
              <div>
                <label htmlFor="Gender" className="block text-sm font-medium leading-5 text-gray-700">Gender</label>
                <select
                  id="Gender"
                  name="Gender"
                  value={customer.Gender}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Contact Number */}
              <div>
                <label htmlFor="ContactNo" className="block text-sm font-medium leading-5 text-gray-700">Contact Number</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    id="ContactNo"
                    name="ContactNo"
                    type="text"
                    value={customer.ContactNo}
                    onChange={handleChange}
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                  />
                  {errors.ContactNo && <p className="text-red-500 text-xs">{errors.ContactNo}</p>}
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="Email" className="block text-sm font-medium leading-5 text-gray-700">Email</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    id="Email"
                    name="Email"
                    type="email"
                    value={customer.Email}
                    onChange={handleChange}
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                  />
                  {errors.Email && <p className="text-red-500 text-xs">{errors.Email}</p>}
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="Password" className="block text-sm font-medium leading-5 text-gray-700">Password</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    id="Password"
                    name="Password"
                    type="password"
                    value={customer.Password}
                    onChange={handleChange}
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                  />
                </div>
              </div>

              {/* Re-Enter Password */}
              <div>
                <label htmlFor="reEnteredPassword" className="block text-sm font-medium leading-5 text-gray-700">Re-Enter Password</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    id="reEnteredPassword"
                    name="reEnteredPassword"
                    type="password"
                    value={customer.reEnteredPassword}
                    onChange={handleChange}
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                  />
                  {errors.reEnteredPassword && <p className="text-red-500 text-xs">{errors.reEnteredPassword}</p>}
                </div>
              </div>

              {/* Image Upload */}
              <div className="md:col-span-2">
                <label htmlFor="image" className="block text-sm font-medium leading-5 text-gray-700">Upload Image</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    id="image"
                    name="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                  />
                </div>
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="mt-2 h-32 w-32 object-cover rounded-full"
                  />
                )}
              </div>

              {/* Submit Button */}
              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-500 focus:outline-none focus:border-pink-700 focus:shadow-outline-pink active:bg-pink-700 transition duration-150 ease-in-out"
                >
                  {loading ? <Spinner /> : 'Update Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCustomer;
