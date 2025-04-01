import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Calendar, Users, Code2, Building2, Award } from 'lucide-react';
import { useAuth } from '../components/AuthContext';

interface HomeProps {
  onStudentClick: () => void;
  onOrgClick: () => void;
}

export default function Home({ onStudentClick, onOrgClick }: HomeProps) {
  const { user } = useAuth();

  const handleStudentClick = () => {
    if (user) {
      onStudentClick();
    } else {
      onStudentClick();
    }
  };

  const handleOrgClick = () => {
    if (user) {
      onOrgClick();
    } else {
      onOrgClick();
    }
  };

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Indian Summer of Code 2025
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Join India's premier open source program. Work on real projects, learn from mentors, and make a difference in the open source community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/students"
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 transition-colors"
              >
                <Users className="w-5 h-5 mr-2" />
                Apply as Student
              </Link>
              <Link
                to="/organizations"
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 transition-colors"
              >
                <Building2 className="w-5 h-5 mr-2" />
                Register Organization
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Vision & Mission</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Our vision is to empower students across India to become active contributors to the open-source community,
              fostering innovation and collaboration while building valuable skills for their future careers.
            </p>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <Calendar className="h-12 w-12 text-orange-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">2-Month Program</h3>
              <p className="text-gray-600">Intensive coding period with expert mentorship and real-world project experience</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <Users className="h-12 w-12 text-orange-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Expert Mentorship</h3>
              <p className="text-gray-600">Learn from industry professionals and experienced open-source contributors</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <Code2 className="h-12 w-12 text-orange-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Impact Projects</h3>
              <p className="text-gray-600">Work on meaningful projects that benefit the developer community</p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Program Timeline</h2>
          <div className="space-y-8">
            {[
              { date: 'March', title: 'Program Announcement', desc: 'Organization applications open' },
              { date: 'Early April', title: 'Organization Selection', desc: 'Project listing begins' },
              { date: 'Mid April', title: 'Student Applications', desc: 'Proposal workshops start' },
              { date: 'June - July', title: 'Coding Period', desc: 'Main development phase with evaluations' },
              { date: 'August', title: 'Final Submissions', desc: 'Project completion and evaluations' }
            ].map((item, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="w-24 flex-shrink-0 text-orange-600 font-semibold">{item.date}</div>
                <div className="flex-grow bg-gray-50 p-4 rounded-lg shadow-sm">
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
