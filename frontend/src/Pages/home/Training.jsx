import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const Training = () => {
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const countdownDate = new Date("2025-02-14T00:00:00").getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = countdownDate - now;

      setDays(Math.floor(distance / (1000 * 60 * 60 * 24)));
      setHours(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
      setMinutes(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)));
      setSeconds(Math.floor((distance % (1000 * 60)) / 1000));

      if (distance < 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleNotifyClick = () => {
    alert("🌟 Your waiting is almost over! Stay motivated and keep pushing forward! 🚀");
  };

  return (
    <div className="lg:h-[140vh] h-[100vh] rounded-md bg-gradient-to-br from-blue-900 via-purple-800 to-indigo-700 flex items-center justify-center">
      <div className="text-center text-white px-6">
        {/* Heading Section */}
        <motion.h1
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 mt-6 tracking-wide"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          🚀 Something Big is Coming Soon!
        </motion.h1>

        <p className="text-base sm:text-lg md:text-xl mb-8 text-gray-300">
          Prepare for an incredible learning experience! Stay tuned for updates.
        </p>

        {/* GIF Section */}
        <motion.div
          className="w-full flex justify-center mb-10"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2 }}
        >
          <video
            className="rounded-lg h-[150px] sm:h-[200px] w-auto"
            src="https://cdnl.iconscout.com/lottie/premium/thumb/science-education-animated-icon-download-in-lottie-json-gif-static-svg-file-formats--research-laboratory-lab-experiment-pack-school-icons-5541935.mp4"
            autoPlay
            loop
            muted
            playsInline
          />
        </motion.div>

        {/* Countdown Timer */}
        <div className="flex flex-wrap justify-center gap-4 text-xl sm:text-2xl md:text-4xl font-bold mb-8">
          <div className="bg-purple-600 bg-opacity-50 px-4 py-2 rounded-lg shadow-md">
            <span className="block text-white">{days}</span>
            <span className="text-sm text-gray-200">Days</span>
          </div>
          <div className="bg-purple-600 bg-opacity-50 px-4 py-2 rounded-lg shadow-md">
            <span className="block text-white">{hours}</span>
            <span className="text-sm text-gray-200">Hours</span>
          </div>
          <div className="bg-purple-600 bg-opacity-50 px-4 py-2 rounded-lg shadow-md">
            <span className="block text-white">{minutes}</span>
            <span className="text-sm text-gray-200">Minutes</span>
          </div>
          <div className="bg-purple-600 bg-opacity-50 px-4 py-2 rounded-lg shadow-md">
            <span className="block text-white">{seconds}</span>
            <span className="text-sm text-gray-200">Seconds</span>
          </div>
        </div>

        {/* Notify Me Button */}
        <motion.button
          className="px-8 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full text-lg font-medium shadow-lg hover:shadow-xl transition-all"
          whileHover={{ scale: 1.1 }}
          onClick={handleNotifyClick} // Add the click handler here
        >
          Notify Me
        </motion.button>
      </div>
    </div>
  );
};

export default Training;