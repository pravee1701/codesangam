import React from 'react';
import { motion } from 'framer-motion';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] text-white py-12 px-4 flex items-center justify-center">
      <motion.div
        className="max-w-6xl w-full bg-[#1f2937]/80 backdrop-blur-lg rounded-3xl shadow-2xl p-10"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex items-center justify-center mb-8">
          <img
            src="https://img.icons8.com/ios-filled/100/ffffff/source-code.png"
            alt="Logo"
            className="h-14 w-14 mr-4"
          />
          <h1 className="text-4xl font-extrabold tracking-wide">
            Coding Contest Hub
          </h1>
        </div>

        <motion.blockquote
          className="text-center text-gray-300 italic text-lg mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          "Unlock your competitive coding potential, one contest at a time."
        </motion.blockquote>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: 'Codeforces',
              color: 'bg-blue-800',
              desc: 'Dominate the leaderboards on Codeforces.',
              icon: 'https://img.icons8.com/ios-filled/50/ffffff/code.png'
            },
            {
              title: 'LeetCode',
              color: 'bg-green-800',
              desc: 'Sharpen your skills with LeetCode challenges.',
              icon: 'https://img.icons8.com/ios-filled/50/ffffff/laptop-coding.png'
            },
            {
              title: 'CodeChef',
              color: 'bg-yellow-800',
              desc: 'Master the art of coding on CodeChef.',
              icon: 'https://img.icons8.com/ios-filled/50/ffffff/source-code.png'
            },
            {
              title: 'More Platforms',
              color: 'bg-red-800',
              desc: 'Explore a universe of coding opportunities.',
              icon: 'https://img.icons8.com/ios-filled/50/ffffff/network.png'
            },
          ].map((platform, index) => (
            <motion.div
              key={platform.title}
              className="flex items-center space-x-4 bg-gray-800 rounded-xl p-4 hover:scale-105 transition-transform duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 + 0.3 }}
            >
              <div className={`h-14 w-14 ${platform.color} rounded-full flex items-center justify-center`}>
                <img src={platform.icon} alt={platform.title} className="h-8 w-8" />
              </div>
              <div>
                <h2 className="text-lg font-bold">{platform.title}</h2>
                <p className="text-sm text-gray-400">{platform.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <p className="text-gray-300 text-lg">
            Your ultimate hub for coding contest mastery!
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
