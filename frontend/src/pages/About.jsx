// @ts-nocheck
import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function About() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-indigo-600 via-purple-600 to-cyan-600 text-white py-20 px-6"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
            About Blogger
          </h1>
          <p className="text-xl md:text-2xl text-indigo-100 leading-relaxed">
            Empowering writers and readers to share stories, spark conversations, and build meaningful connections.
          </p>
        </div>
      </motion.section>

      {/* Mission Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">Our Mission</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                We believe everyone has a story worth sharing. Blogger was created to democratize content creation and give every writer a platform to reach their audience.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                Whether you're a professional journalist, aspiring novelist, or someone with unique insights to share, Blogger provides the tools and community to amplify your voice.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-indigo-100 to-cyan-100 dark:from-indigo-900/30 dark:to-cyan-900/30 rounded-2xl p-12 text-center">
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <div className="text-5xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">10K+</div>
                    <div className="text-gray-600 dark:text-gray-400 font-medium">Writers</div>
                  </div>
                  <div>
                    <div className="text-5xl font-bold text-purple-600 dark:text-purple-400 mb-2">50K+</div>
                    <div className="text-gray-600 dark:text-gray-400 font-medium">Stories</div>
                  </div>
                  <div>
                    <div className="text-5xl font-bold text-cyan-600 dark:text-cyan-400 mb-2">100K+</div>
                    <div className="text-gray-600 dark:text-gray-400 font-medium">Readers</div>
                  </div>
                  <div>
                    <div className="text-5xl font-bold text-pink-600 dark:text-pink-400 mb-2">1M+</div>
                    <div className="text-gray-600 dark:text-gray-400 font-medium">Engagements</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-6 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Our Values</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">The principles that guide everything we do</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '✨',
                title: 'Authenticity',
                desc: 'We celebrate genuine voices and original perspectives. Every story matters, and every writer deserves to be heard.'
              },
              {
                icon: '🤝',
                title: 'Community',
                desc: 'Building connections between writers and readers. We foster a supportive environment for growth and collaboration.'
              },
              {
                icon: '🚀',
                title: 'Innovation',
                desc: 'Continuously improving our platform with cutting-edge features to enhance the writing and reading experience.'
              },
              {
                icon: '🔒',
                title: 'Privacy',
                desc: 'Your data and content are protected. We prioritize security and give you control over your information.'
              },
              {
                icon: '🌍',
                title: 'Inclusivity',
                desc: 'Welcoming diverse voices from around the world. We believe in equality and representation for all.'
              },
              {
                icon: '📚',
                title: 'Quality',
                desc: 'Promoting well-crafted content and meaningful conversations. Excellence in storytelling is our standard.'
              }
            ].map((value, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="text-5xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{value.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Meet Our Team</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">Passionate individuals dedicated to empowering writers</p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { name: 'Sarah Johnson', role: 'CEO & Founder', avatar: 'SJ' },
              { name: 'Michael Chen', role: 'CTO', avatar: 'MC' },
              { name: 'Emily Rodriguez', role: 'Head of Content', avatar: 'ER' },
              { name: 'David Kim', role: 'Lead Designer', avatar: 'DK' }
            ].map((member, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="text-center"
              >
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
                  {member.avatar}
                </div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">{member.name}</h3>
                <p className="text-gray-600 dark:text-gray-400">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-indigo-600 to-cyan-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">Join Our Community</h2>
            <p className="text-xl text-indigo-100 mb-8 leading-relaxed">
              Start sharing your stories today. Whether you're here to write, read, or connect, there's a place for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/login"
                className="px-8 py-4 bg-white text-indigo-600 rounded-lg font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                Get Started
              </Link>
              <Link
                to="/contact"
                className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-bold hover:bg-white hover:text-indigo-600 transition-all"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
