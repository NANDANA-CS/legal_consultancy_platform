import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';




const Contact = () => {

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState(''); 
  

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(''); // Clear previous status
    try {
      const response = await fetch('http://localhost:3000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: user ? `Bearer ${localStorage.getItem('token')}` : '',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        setStatus('Message sent successfully!');
        setFormData({ name: user?.name || '', email: user?.email || '', message: '' });
      } else {
        setStatus(data.message || 'Error sending message');
      }
    } catch (err) {
      setStatus('Server error. Please try again later.');
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      {/* Header Section */}
      <section className="py-20 px-4 bg-cyan-900">
        <div className="max-w-3xl mx-auto text-center">
          <img
            src="/images/leadlead-logo.png"
            alt="LegaLead Logo"
            className="h-12 mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
          <p className="text-lg text-gray-300">
            {user
              ? `Hi, ${user.name}! Reach out with any questions or feedback.`
              : 'Get in touch with LegaLead for support or inquiries.'}
          </p>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Send Us a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-gray-300 mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-600"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-600"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-gray-300 mb-1">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="5"
                className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-600"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded font-medium"
            >
              Send Message
            </button>
          </form>
          {status && (
            <p className={`text-center mt-4 ${status.includes('success') ? 'text-green-500' : 'text-red-500'}`}>
              {status}
            </p>
          )}
        </div>
      </section>


      <Footer />
    </div>
  );
};

export default Contact;