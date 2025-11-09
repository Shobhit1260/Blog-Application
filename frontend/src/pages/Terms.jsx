// @ts-nocheck
import React from 'react'
import { motion } from 'framer-motion'

export default function Terms() {
  const lastUpdated = "January 15, 2024"

  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: "By accessing and using Blogger, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, please do not use our service."
    },
    {
      title: "2. User Accounts",
      content: "You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account."
    },
    {
      title: "3. Content Guidelines",
      content: "Users are solely responsible for the content they post. You agree not to post content that is illegal, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, or otherwise objectionable. We reserve the right to remove any content that violates these guidelines."
    },
    {
      title: "4. Intellectual Property",
      content: "You retain ownership of content you post on Blogger. By posting content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and distribute your content in connection with our service. You must respect the intellectual property rights of others."
    },
    {
      title: "5. Prohibited Activities",
      content: "You may not use our service to: (a) violate any laws or regulations, (b) infringe on intellectual property rights, (c) transmit viruses or malicious code, (d) spam or harass other users, (e) attempt to gain unauthorized access to our systems, or (f) interfere with the proper functioning of the service."
    },
    {
      title: "6. Privacy and Data",
      content: "Your use of Blogger is also governed by our Privacy Policy. We collect and use information as described in that policy. By using our service, you consent to our collection and use of your information."
    },
    {
      title: "7. Termination",
      content: "We reserve the right to suspend or terminate your account at any time, with or without notice, for conduct that we believe violates these terms or is harmful to other users, us, or third parties, or for any other reason."
    },
    {
      title: "8. Disclaimers",
      content: "Blogger is provided 'as is' without warranties of any kind. We do not guarantee that the service will be uninterrupted, secure, or error-free. We are not responsible for the content posted by users."
    },
    {
      title: "9. Limitation of Liability",
      content: "To the fullest extent permitted by law, Blogger shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly."
    },
    {
      title: "10. Changes to Terms",
      content: "We reserve the right to modify these terms at any time. We will notify users of significant changes via email or through the service. Your continued use of Blogger after changes constitutes acceptance of the modified terms."
    },
    {
      title: "11. Governing Law",
      content: "These terms shall be governed by and construed in accordance with the laws of the State of California, United States, without regard to its conflict of law provisions."
    },
    {
      title: "12. Contact",
      content: "If you have any questions about these Terms of Service, please contact us at legal@blogger.com or through our contact page."
    }
  ]

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Terms of Service
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Last Updated: <span className="font-semibold">{lastUpdated}</span>
          </p>
        </motion.div>

        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-8 mb-8"
        >
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            Welcome to Blogger! These Terms of Service ("Terms") govern your access to and use of our blogging platform. 
            Please read these terms carefully before using our service. By creating an account or using Blogger, you agree 
            to be bound by these Terms and our Privacy Policy.
          </p>
        </motion.div>

        {/* Terms Sections */}
        <div className="space-y-6">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                {section.title}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {section.content}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 p-6 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 rounded-r-xl"
        >
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <strong className="text-yellow-700 dark:text-yellow-400">Important:</strong> These terms constitute a legally 
            binding agreement between you and Blogger. If you do not agree with any part of these terms, you must 
            discontinue use of our service immediately.
          </p>
        </motion.div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-8 text-center"
        >
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Questions about our terms?
          </p>
          <a
            href="/contact"
            className="inline-block px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-bold hover:shadow-lg transition-all hover:scale-105"
          >
            Contact Us
          </a>
        </motion.div>
      </div>
    </div>
  )
}
