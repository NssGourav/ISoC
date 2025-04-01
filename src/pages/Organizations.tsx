import React, { useState } from 'react';
import { Users, Calendar, CheckCircle, Shield } from 'lucide-react';
import { signUpOrganization } from '../lib/auth';

export default function Organizations() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await signUpOrganization(name, email, password, description)
      alert('Registration successful! Please check your email to verify your account.')
      // Clear form
      setName('')
      setEmail('')
      setPassword('')
      setDescription('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pt-16">
      {/* Registration Form */}
      <section className="py-16 bg-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8 text-center">Register Your Organization</h2>
          <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-md">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Organization Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                  minLength={6}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 border rounded"
                  rows={4}
                />
              </div>
              {error && <p className="text-red-500 mb-4">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-600 text-white py-2 px-4 rounded hover:bg-orange-700 disabled:bg-orange-300"
              >
                {loading ? 'Registering...' : 'Register Organization'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12">Benefits for Organizations</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-orange-50 p-6 rounded-xl">
              <Users className="h-12 w-12 text-orange-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Access to Talent</h3>
              <p className="text-gray-600">Connect with motivated student developers ready to contribute to your projects</p>
            </div>
            <div className="bg-orange-50 p-6 rounded-xl">
              <Calendar className="h-12 w-12 text-orange-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Project Growth</h3>
              <p className="text-gray-600">Accelerate development with dedicated contributors during the program</p>
            </div>
            <div className="bg-orange-50 p-6 rounded-xl">
              <Shield className="h-12 w-12 text-orange-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Community Building</h3>
              <p className="text-gray-600">Expand your project's community and increase long-term sustainability</p>
            </div>
            <div className="bg-orange-50 p-6 rounded-xl">
              <CheckCircle className="h-12 w-12 text-orange-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Brand Recognition</h3>
              <p className="text-gray-600">Enhance visibility within the Indian developer community</p>
            </div>
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8">Organization Application Process</h2>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold mb-4">1. Submit Organization Profile</h3>
              <p className="text-gray-600">Provide details about your organization, project ideas, and mentorship capacity</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold mb-4">2. Project Proposal Review</h3>
              <p className="text-gray-600">Our team reviews your project proposals for suitability and impact</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold mb-4">3. Mentor Assignment</h3>
              <p className="text-gray-600">Assign mentors to guide students throughout the program</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold mb-4">4. Student Selection</h3>
              <p className="text-gray-600">Review student proposals and select the best fits for your projects</p>
            </div>
          </div>
        </div>
      </section>

      {/* Responsibilities */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8">Organization Responsibilities</h2>
          <div className="bg-orange-50 p-8 rounded-xl">
            <ul className="space-y-4">
              <li className="flex items-start">
                <CheckCircle className="h-6 w-6 text-orange-600 mr-3 flex-shrink-0" />
                <span>Maintain regular communication with students</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-6 w-6 text-orange-600 mr-3 flex-shrink-0" />
                <span>Ensure project originality and scope</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-6 w-6 text-orange-600 mr-3 flex-shrink-0" />
                <span>Provide fair and unbiased evaluation</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-6 w-6 text-orange-600 mr-3 flex-shrink-0" />
                <span>Support student development throughout the program</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12">Organization Timeline</h2>
          <div className="space-y-6">
            {[
              { date: 'March 1, 2025', title: 'Organization Applications Open' },
              { date: 'March 31, 2025', title: 'Organization Applications Close' },
              { date: 'April 15, 2025', title: 'Selected Organizations Announced' },
              { date: 'April 20, 2025', title: 'Student Proposal Period Begins' },
              { date: 'May 15, 2025', title: 'Student Selection Period' },
              { date: 'June 1, 2025', title: 'Coding Period Starts' }
            ].map((item, i) => (
              <div key={i} className="flex gap-4 items-center bg-white p-4 rounded-lg shadow-sm">
                <div className="w-32 flex-shrink-0 font-semibold text-orange-600">{item.date}</div>
                <div>{item.title}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}