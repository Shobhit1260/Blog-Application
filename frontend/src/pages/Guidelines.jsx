// @ts-nocheck
import React from 'react'
import { motion } from 'framer-motion'

export default function Guidelines() {
  const lastUpdated = "January 15, 2024"

  const guidelines = [
    {
      title: "Be Respectful",
      icon: "🤝",
      description: "Treat all community members with respect and kindness. Harassment, bullying, hate speech, or discriminatory language will not be tolerated.",
      examples: [
        "Engage in constructive discussions",
        "Disagree respectfully without personal attacks",
        "Welcome diverse perspectives and backgrounds"
      ]
    },
    {
      title: "Create Quality Content",
      icon: "✨",
      description: "Share original, well-written, and meaningful content. Put effort into your posts to provide value to readers.",
      examples: [
        "Proofread your posts before publishing",
        "Use proper formatting and structure",
        "Add relevant images or media when appropriate",
        "Cite sources and give credit where due"
      ]
    },
    {
      title: "Stay On Topic",
      icon: "🎯",
      description: "Keep your content relevant to the blogging platform's purpose. Avoid spam, excessive self-promotion, or off-topic content.",
      examples: [
        "Focus on your area of expertise or interest",
        "Avoid repetitive or duplicate posts",
        "Don't use clickbait titles",
        "Keep promotional content to a minimum"
      ]
    },
    {
      title: "Respect Privacy",
      icon: "🔐",
      description: "Do not share others' personal information without consent. Respect confidentiality and privacy boundaries.",
      examples: [
        "Don't post private messages publicly",
        "Protect sensitive information",
        "Respect copyright and intellectual property",
        "Use permission before sharing others' work"
      ]
    },
    {
      title: "Engage Authentically",
      icon: "💬",
      description: "Participate in discussions genuinely and thoughtfully. Don't manipulate engagement or use fake accounts.",
      examples: [
        "Leave meaningful comments",
        "Don't create multiple accounts",
        "Avoid artificial engagement tactics",
        "Be transparent about affiliations"
      ]
    },
    {
      title: "Report Issues",
      icon: "🚨",
      description: "Help keep the community safe by reporting content that violates our guidelines. Use the report feature responsibly.",
      examples: [
        "Report harassment or abuse",
        "Flag spam or inappropriate content",
        "Don't abuse the reporting system",
        "Contact support for serious issues"
      ]
    }
  ]

  const prohibited = [
    "Hate speech, discrimination, or harassment",
    "Explicit sexual content or nudity",
    "Violence, gore, or graphic content",
    "Spam, scams, or phishing attempts",
    "Illegal activities or promotion thereof",
    "Misinformation or deliberately false content",
    "Impersonation or identity theft",
    "Copyright infringement or plagiarism",
    "Malware, viruses, or malicious links",
    "Excessive advertising or self-promotion"
  ]

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
            Community Guidelines
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-2">
            Building a respectful and creative community together
          </p>
          <p className="text-gray-500 dark:text-gray-400">
            Last Updated: <span className="font-semibold">{lastUpdated}</span>
          </p>
        </motion.div>

        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-2xl p-8 mb-12"
        >
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            Welcome to the Blogger community! These guidelines help create a positive, safe, and inspiring environment 
            for everyone. By following these principles, you contribute to making Blogger a place where writers can 
            share their voice and readers can discover amazing content.
          </p>
        </motion.div>

        {/* Guidelines Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {guidelines.map((guideline, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="text-5xl mb-4">{guideline.icon}</div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                {guideline.title}
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                {guideline.description}
              </p>
              <div className="space-y-2">
                {guideline.examples.map((example, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{example}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Prohibited Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-8 mb-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="text-4xl">🚫</span>
            <h2 className="text-3xl font-bold text-red-900 dark:text-red-300">
              Prohibited Content
            </h2>
          </div>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            The following types of content are strictly prohibited on Blogger:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {prohibited.map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <span className="text-red-500 text-xl flex-shrink-0">✗</span>
                <span className="text-gray-700 dark:text-gray-300">{item}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Enforcement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl p-8 mb-8"
        >
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
            ⚖️ Enforcement & Consequences
          </h2>
          <div className="space-y-3 text-gray-700 dark:text-gray-300">
            <p>
              <strong>Violations of these guidelines may result in:</strong>
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Content removal or editing</li>
              <li>Warnings and notifications</li>
              <li>Temporary account suspension</li>
              <li>Permanent account termination</li>
              <li>Legal action for severe violations</li>
            </ul>
            <p className="mt-4">
              We review reports promptly and take appropriate action. Appeals can be submitted through our contact page.
            </p>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center"
        >
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Questions about our community guidelines?
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="/contact"
              className="inline-block px-8 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg font-bold hover:shadow-lg transition-all hover:scale-105"
            >
              Contact Support
            </a>
            <a
              href="/terms"
              className="inline-block px-8 py-3 bg-white dark:bg-gray-800 text-green-600 dark:text-green-400 border-2 border-green-600 rounded-lg font-bold hover:shadow-lg transition-all hover:scale-105"
            >
              View Terms
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
