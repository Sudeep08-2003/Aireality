import React, { useState } from 'react';
import axios from 'axios';

const OnboardingForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    email: '',
    city: '',
    propertyType: '',
    budget: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));

    // Clear error when typing
    setErrors(prev => ({
      ...prev,
      [e.target.name]: ''
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    const mobileRegex = /^[6-9]\d{9}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required.";
    if (!formData.mobile.trim()) newErrors.mobile = "Mobile number is required.";
    else if (!mobileRegex.test(formData.mobile)) newErrors.mobile = "Enter a valid 10-digit Indian mobile number.";

    if (!formData.email.trim()) newErrors.email = "Email is required.";
    else if (!emailRegex.test(formData.email)) newErrors.email = "Enter a valid email address.";

    if (!formData.city.trim()) newErrors.city = "City is required.";
    if (!formData.propertyType.trim()) newErrors.propertyType = "Please select a property type.";
    if (!formData.budget.trim()) newErrors.budget = "Budget is required.";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    try {
      await axios.post('http://localhost:3001/api/onboarding', formData);

      setSubmitted(true);
    } catch (err) {
      console.error(err);
      alert("Submission failed. Try again.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-lg">
        <div className="card-body">
          <h2 className="card-title text-center mb-4 text-primary">Customer Onboarding</h2>

          {submitted ? (
            <div className="alert alert-success text-center">
              Thank you! We’ve received your details.
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-3">
                <input
                  type="text"
                  name="fullName"
                  className={`form-control ${errors.fullName && 'is-invalid'}`}
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={handleChange}
                />
                {errors.fullName && <div className="invalid-feedback">{errors.fullName}</div>}
              </div>

              <div className="mb-3">
                <input
                  type="text"
                  name="mobile"
                  className={`form-control ${errors.mobile && 'is-invalid'}`}
                  placeholder="Mobile Number"
                  value={formData.mobile}
                  onChange={handleChange}
                />
                {errors.mobile && <div className="invalid-feedback">{errors.mobile}</div>}
              </div>

              <div className="mb-3">
                <input
                  type="email"
                  name="email"
                  className={`form-control ${errors.email && 'is-invalid'}`}
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
              </div>

              <div className="mb-3">
                <input
                  type="text"
                  name="city"
                  className={`form-control ${errors.city && 'is-invalid'}`}
                  placeholder="City of Interest"
                  value={formData.city}
                  onChange={handleChange}
                />
                {errors.city && <div className="invalid-feedback">{errors.city}</div>}
              </div>

              <div className="mb-3">
                <select
                  name="propertyType"
                  className={`form-select ${errors.propertyType && 'is-invalid'}`}
                  value={formData.propertyType}
                  onChange={handleChange}
                >
                  <option value="">Type of Property</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Plot">Plot</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Villa">Villa</option>
                  <option value="Farmhouse">Farmhouse</option>
                </select>
                {errors.propertyType && <div className="invalid-feedback">{errors.propertyType}</div>}
              </div>

              <div className="mb-3">
                <input
                  type="text"
                  name="budget"
                  className={`form-control ${errors.budget && 'is-invalid'}`}
                  placeholder="Budget Range (INR)"
                  value={formData.budget}
                  onChange={handleChange}
                />
                {errors.budget && <div className="invalid-feedback">{errors.budget}</div>}
              </div>

              <div className="mb-3">
                <textarea
                  name="message"
                  className="form-control"
                  rows="4"
                  placeholder="Message / Comments"
                  value={formData.message}
                  onChange={handleChange}
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary w-100">Submit</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingForm;
