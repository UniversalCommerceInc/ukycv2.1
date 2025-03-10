import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, CalendarToday, Badge, Public } from "@mui/icons-material";
import Select from "react-select";
import { Typography, Box } from "@mui/material";

const countryOptions = [
  { label: "India", value: "India" },
  { label: "United States", value: "United States" },
  { label: "United Kingdom", value: "United Kingdom" },
  { label: "Australia", value: "Australia" },
  { label: "Canada", value: "Canada" },
  { label: "Germany", value: "Germany" },
  { label: "France", value: "France" },
  // Add more countries as needed
];

// Enhanced premium styles for React Select
const customSelectStyles = {
  control: (provided, state) => ({
    ...provided,
    borderColor: state.isFocused ? '#3b82f6' : '#e5e7eb',
    boxShadow: state.isFocused ? '0 0 0 3px rgba(59, 130, 246, 0.25)' : null,
    borderRadius: '0.75rem',
    padding: '0.5rem',
    paddingLeft: '2.5rem', // Add left padding to make room for the icon
    backgroundColor: '#f9fafb',
    transition: 'all 0.3s ease',
    '&:hover': {
      borderColor: state.isFocused ? '#3b82f6' : '#d1d5db',
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
    },
    minHeight: '50px'
  }),
  placeholder: (provided) => ({
    ...provided,
    color: '#9ca3af',
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected 
      ? '#3b82f6' 
      : state.isFocused 
        ? '#e5e7eb' 
        : null,
    color: state.isSelected ? 'white' : '#374151',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    padding: '10px 15px',
    ':active': {
      backgroundColor: '#3b82f6',
      color: 'white'
    }
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: '0.5rem',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    zIndex: 9999,
    position: 'absolute'
  }),
  menuPortal: base => ({ ...base, zIndex: 9999 }),
  dropdownIndicator: (provided) => ({
    ...provided,
    color: '#6b7280',
    ':hover': {
      color: '#3b82f6',
    },
  }),
  input: (provided) => ({
    ...provided,
    padding: '2px',
  }),
  singleValue: (provided) => ({
    ...provided,
    color: '#1f2937',
  }),
};

function NationalityForm({ onBack, onNext, onIdTypeChange }) {
  const [formData, setFormData] = useState({
    nationality: "",
    dob: "",
    idType: "",
    idNumber: "",
    idIssueDate: "",
    idExpiryDate: "",
    idIssuingCountry: "",
    countryOfResidence: "",
  });
  
  const [focused, setFocused] = useState(null);
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  // Validate form on data change, but only for touched fields
  useEffect(() => {
    const newErrors = {};
    let isValid = true;

    // Validate fields that have been touched
    Object.keys(touched).forEach(field => {
      if (touched[field]) {
        const fieldError = validateField(field, formData[field]);
        if (fieldError) {
          newErrors[field] = fieldError;
          isValid = false;
        }
      }
    });

    // When all required fields have been filled and are valid, the form is valid
    if (Object.keys(touched).length >= 7) {
      // Check if fields are filled
      if (!formData.nationality || 
          !formData.dob || 
          !formData.idType || 
          !formData.idNumber || 
          !formData.idIssueDate || 
          !formData.idIssuingCountry || 
          !formData.countryOfResidence ||
          (formData.idType && formData.idType !== "aadhaar-card" && !formData.idExpiryDate)) {
        isValid = false;
      }
    } else {
      // Not all fields have been touched yet
      isValid = false;
    }

    setErrors(newErrors);
    setIsFormValid(isValid);
  }, [formData, touched]);

  // Validate individual field
  const validateField = (field, value) => {
    if (!value || value.trim() === "") {
      return `${field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1').toLowerCase()} is required`;
    }
    
    // Special validations
    if (field === "dob") {
      // Check if date is not in the future
      const dobDate = new Date(value);
      const currentDate = new Date();
      if (dobDate > currentDate) {
        return "Date of birth cannot be in the future";
      }
      
      // Check if person is at least 18 years old
      const age = currentDate.getFullYear() - dobDate.getFullYear();
      const monthDiff = currentDate.getMonth() - dobDate.getMonth();
      if (age < 18 || (age === 18 && monthDiff < 0)) {
        return "You must be at least 18 years old";
      }
    }
    
    if (field === "idExpiryDate" && formData.idIssueDate) {
      const issueDate = new Date(formData.idIssueDate);
      const expiryDate = new Date(value);
      
      if (expiryDate <= issueDate) {
        return "Expiry date must be after issue date";
      }
    }
    
    return null;
  };

  const handleSelectChange = (selectedOption, name) => {
    setFormData({ ...formData, [name]: selectedOption?.value || "" });
    setTouched({ ...touched, [name]: true });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setTouched({ ...touched, [name]: true });
    
    if (name === "idType" && typeof onIdTypeChange === "function") {
      onIdTypeChange(value);
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });
    setFocused(null);
  };
  
  const handleNext = () => {
    // Mark all fields as touched
    const allTouched = {};
    Object.keys(formData).forEach(key => {
      allTouched[key] = true;
    });
    setTouched(allTouched);
    
    // Validate all fields
    const newErrors = {};
    Object.keys(formData).forEach(field => {
      // Skip validation for expiry date if ID type is Aadhaar
      if (field === "idExpiryDate" && formData.idType === "aadhaar-card") {
        return;
      }
      
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      const updatedFormData = { ...formData };
  
      // Remove `idExpiryDate` if ID type is Aadhaar Card
      // if (updatedFormData.idType === "aadhaar-card") {
      //   delete updatedFormData.idExpiryDate;
      // }
  
      onNext(updatedFormData);
      console.log("Form data:", updatedFormData);
    } else {
      // Scroll to first error
      const firstErrorField = Object.keys(newErrors)[0];
      const element = document.querySelector(`[name="${firstErrorField}"]`) ||
                      document.querySelector(`[id="react-select-${firstErrorField}-input"]`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  return (
    <div className="w-full">
      {/* Title Section */}
      <div className="px-6 pt-6 pb-6 sm:px-10">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Nationality Information</h2>
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            Please provide your nationality and identification details
          </p>
        </div>
        <div className="flex justify-center mt-4">
          <div className="h-1.5 w-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></div>
        </div>
      </div>
      
      <form className="px-6 sm:px-10 pb-8 space-y-6">
        {/* Nationality Field */}
        <div className="relative">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Nationality
          </label>
          <div className={`relative transition-all duration-300 ${
            focused === "nationality" 
              ? "transform -translate-y-1 shadow-md" 
              : ""
          }`}>
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none z-10">
              <Public className="h-5 w-5 text-gray-400" />
            </div>
            <Select
              options={countryOptions}
              value={countryOptions.find(
                (option) => option.value === formData.nationality
              )}
              onChange={(selectedOption) =>
                handleSelectChange(selectedOption, "nationality")
              }
              placeholder="Select your nationality"
              isSearchable
              onFocus={() => setFocused("nationality")}
              onBlur={() => {
                setFocused(null);
                setTouched({ ...touched, nationality: true });
              }}
              styles={customSelectStyles}
              classNamePrefix="select"
              menuPortalTarget={document.body}
              menuPosition={'fixed'}
            />
          </div>
          {touched.nationality && errors.nationality && (
            <p className="mt-1.5 text-sm text-red-600 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.nationality}
            </p>
          )}
        </div>

        {/* Date of Birth */}
        <div className="relative">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Date of Birth
          </label>
          <div className={`relative transition-all duration-300 ${
            focused === "dob" 
              ? "transform -translate-y-1" 
              : ""
          }`}>
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <CalendarToday className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              onFocus={() => setFocused("dob")}
              onBlur={handleBlur}
              className={`w-full pl-10 pr-4 py-3.5 bg-gray-50 border rounded-xl focus:outline-none text-gray-800 transition-all duration-300 ${
                focused === "dob"
                  ? "border-blue-500 ring-2 ring-blue-100 shadow-lg"
                  : "border-gray-200 shadow-sm hover:border-gray-300"
              }`}
            />
          </div>
          {touched.dob && errors.dob && (
            <p className="mt-1.5 text-sm text-red-600 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.dob}
            </p>
          )}
        </div>

        {/* ID Type */}
        <div className="relative">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            ID Type
          </label>
          <div className={`relative transition-all duration-300 ${
            focused === "idType" 
              ? "transform -translate-y-1" 
              : ""
          }`}>
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Badge className="h-5 w-5 text-gray-400" />
            </div>
            <select
              name="idType"
              value={formData.idType}
              onChange={handleChange}
              onFocus={() => setFocused("idType")}
              onBlur={handleBlur}
              className={`w-full pl-10 pr-4 py-3.5 bg-gray-50 border rounded-xl focus:outline-none text-gray-800 transition-all duration-300 appearance-none ${
                focused === "idType"
                  ? "border-blue-500 ring-2 ring-blue-100 shadow-lg"
                  : "border-gray-200 shadow-sm hover:border-gray-300"
              } ${!formData.idType ? "text-gray-500" : ""}`}
            >
              <option value="" disabled>
                Select ID Type
              </option>
              <option value="passport">Passport</option>
              <option value="pan-card">PAN Card</option>
              <option value="dl">Driving License</option>
              <option value="voter-id">Voter ID</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          {touched.idType && errors.idType && (
            <p className="mt-1.5 text-sm text-red-600 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.idType}
            </p>
          )}
        </div>

        {/* ID Number */}
        <div className="relative">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            ID Number
          </label>
          <div className={`relative transition-all duration-300 ${
            focused === "idNumber" 
              ? "transform -translate-y-1" 
              : ""
          }`}>
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
              </svg>
            </div>
            <input
              type="text"
              name="idNumber"
              value={formData.idNumber}
              onChange={handleChange}
              onFocus={() => setFocused("idNumber")}
              onBlur={handleBlur}
              className={`w-full pl-10 pr-4 py-3.5 bg-gray-50 border rounded-xl focus:outline-none text-gray-800 transition-all duration-300 ${
                focused === "idNumber"
                  ? "border-blue-500 ring-2 ring-blue-100 shadow-lg"
                  : "border-gray-200 shadow-sm hover:border-gray-300"
              }`}
              placeholder="Enter ID Number"
            />
          </div>
          {touched.idNumber && errors.idNumber && (
            <p className="mt-1.5 text-sm text-red-600 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.idNumber}
            </p>
          )}
        </div>

        {/* Issue Date */}
        <div className="relative">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Issue Date
          </label>
          <div className={`relative transition-all duration-300 ${
            focused === "idIssueDate" 
              ? "transform -translate-y-1" 
              : ""
          }`}>
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <CalendarToday className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="date"
              name="idIssueDate"
              value={formData.idIssueDate}
              onChange={handleChange}
              onFocus={() => setFocused("idIssueDate")}
              onBlur={handleBlur}
              className={`w-full pl-10 pr-4 py-3.5 bg-gray-50 border rounded-xl focus:outline-none text-gray-800 transition-all duration-300 ${
                focused === "idIssueDate"
                  ? "border-blue-500 ring-2 ring-blue-100 shadow-lg"
                  : "border-gray-200 shadow-sm hover:border-gray-300"
              }`}
            />
          </div>
          {touched.idIssueDate && errors.idIssueDate && (
            <p className="mt-1.5 text-sm text-red-600 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.idIssueDate}
            </p>
          )}
        </div>

        {/* Conditional Expiry Date - Only show for non-Aadhaar ID types */}
        <div className="relative">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Expiry Date
          </label>
          <div className={`relative transition-all duration-300 ${
            focused === "idExpiryDate" 
              ? "transform -translate-y-1" 
              : ""
          }`}>
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <CalendarToday className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="date"
              name="idExpiryDate"
              value={formData.idExpiryDate}
              onChange={handleChange}
              onFocus={() => setFocused("idExpiryDate")}
              onBlur={handleBlur}
              className={`w-full pl-10 pr-4 py-3.5 bg-gray-50 border rounded-xl focus:outline-none text-gray-800 transition-all duration-300 ${
                focused === "idExpiryDate"
                  ? "border-blue-500 ring-2 ring-blue-100 shadow-lg"
                  : "border-gray-200 shadow-sm hover:border-gray-300"
              }`}
            />
          </div>
          {touched.idExpiryDate && errors.idExpiryDate && (
            <p className="mt-1.5 text-sm text-red-600 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.idExpiryDate}
            </p>
          )}
        </div>

        {/* ID Issue Country */}
        <div className="relative">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            ID Issue Country
          </label>
          <div className={`relative transition-all duration-300 ${
            focused === "idIssuingCountry" 
              ? "transform -translate-y-1 shadow-md" 
              : ""
          }`}>
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none z-10">
              <Public className="h-5 w-5 text-gray-400" />
            </div>
            <Select
              options={countryOptions}
              value={countryOptions.find(
                (option) => option.value === formData.idIssuingCountry
              )}
              onChange={(selectedOption) =>
                handleSelectChange(selectedOption, "idIssuingCountry")
              }
              placeholder="Select Issue Country"
              isSearchable
              onFocus={() => setFocused("idIssuingCountry")}
              onBlur={() => {
                setFocused(null);
                setTouched({ ...touched, idIssuingCountry: true });
              }}
              styles={customSelectStyles}
              classNamePrefix="select"
              menuPortalTarget={document.body}
              menuPosition={'fixed'}
            />
          </div>
          {touched.idIssuingCountry && errors.idIssuingCountry && (
            <p className="mt-1.5 text-sm text-red-600 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.idIssuingCountry}
            </p>
          )}
        </div>

        {/* Country of Residence */}
        <div className="relative">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Country of Residence
          </label>
          <div className={`relative transition-all duration-300 ${
            focused === "countryOfResidence" 
              ? "transform -translate-y-1 shadow-md" 
              : ""
          }`}>
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none z-10">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <Select
              options={countryOptions}
              value={countryOptions.find(
                (option) => option.value === formData.countryOfResidence
              )}
              onChange={(selectedOption) =>
                handleSelectChange(selectedOption, "countryOfResidence")
              }
              placeholder="Select Residence Country"
              isSearchable
              onFocus={() => setFocused("countryOfResidence")}
              onBlur={() => {
                setFocused(null);
                setTouched({ ...touched, countryOfResidence: true });
              }}
              styles={customSelectStyles}
              classNamePrefix="select"
              menuPortalTarget={document.body}
              menuPosition={'fixed'}
            />
          </div>
          {touched.countryOfResidence && errors.countryOfResidence && (
            <p className="mt-1.5 text-sm text-red-600 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.countryOfResidence}
            </p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-between gap-3 mt-8">
          <button
            type="button"
            onClick={onBack}
            className="order-2 sm:order-1 inline-flex justify-center items-center py-3.5 px-6 text-sm font-semibold text-blue-600 bg-white border border-blue-600 rounded-xl hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 ease-in-out"
          >
            <ChevronLeft fontSize="small" className="mr-1.5" />
            Back
          </button>
          
          <button
            type="button"
            onClick={handleNext}
            className="order-1 sm:order-2 inline-flex justify-center items-center py-3.5 px-6 text-sm font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 ease-in-out text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg focus:ring-blue-500"
          >
            Next
            <ChevronRight fontSize="small" className="ml-1.5" />
          </button>
        </div>
      </form>
    </div>
  );
}

export default NationalityForm;