import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const steps = [
  {
    title: 'Welcome to DataClean Pro',
    description: 'Optimize your data with ease and efficiency.',
  },
  {
    title: 'Tell us about yourself',
    description: 'Help us tailor your experience.',
  },
  {
    title: 'Ready to clean your data',
    description: 'Let's get started with your first project.',
  },
];

const Onboarding: React.FC = () => {
  const [step, setStep] = useState(0);
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    company: '',
  });
  const navigate = useNavigate();

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      navigate('/dashboard');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserDetails(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full"
      >
        <motion.h2
          key={step}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold mb-4 text-gray-800"
        >
          {steps[step].title}
        </motion.h2>
        <motion.p
          key={`desc-${step}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-gray-600 mb-6"
        >
          {steps[step].description}
        </motion.p>

        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 mb-6"
          >
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={userDetails.name}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={userDetails.email}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
            <input
              type="text"
              name="company"
              placeholder="Company Name"
              value={userDetails.company}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </motion.div>
        )}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleNext}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300 flex items-center justify-center"
        >
          {step < steps.length - 1 ? 'Next' : 'Get Started'}
          <ArrowRight className="ml-2" size={20} />
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Onboarding;