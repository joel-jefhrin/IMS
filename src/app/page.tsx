import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Interview Management System
        </h1>
        <p className="text-xl text-gray-600 mb-10">
          Comprehensive platform for managing technical and HR interviews
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/admin/login"
            className="btn-primary text-lg px-8 py-3 inline-flex items-center gap-2"
          >
            Admin Dashboard
            <ArrowRightIcon className="w-5 h-5" />
          </Link>
          <Link
            href="/candidate/login"
            className="btn-outline text-lg px-8 py-3"
          >
            Candidate Portal
          </Link>
        </div>
      </div>
    </div>
  );
}

