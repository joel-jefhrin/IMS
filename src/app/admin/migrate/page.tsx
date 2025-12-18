'use client';

import { useState } from 'react';
import { migrateLocalStorageToDatabase } from '@/lib/migrateToDatabase';
import { ArrowPathIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

export default function MigratePage() {
  const [migrating, setMigrating] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleMigrate = async () => {
    setMigrating(true);
    setResult(null);
    
    const migrationResult = await migrateLocalStorageToDatabase();
    setResult(migrationResult);
    setMigrating(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="card">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Migrate to Database</h1>
          <p className="text-gray-600 mt-2">
            Move your data from localStorage to the database for persistent, multi-device access.
          </p>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-blue-900 mb-2">What will be migrated?</h2>
            <ul className="list-disc list-inside text-blue-800 space-y-1">
              <li>All departments</li>
              <li>All questions</li>
              <li>All campaigns</li>
              <li>All candidates</li>
            </ul>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-yellow-900 mb-2">⚠️ Important</h2>
            <ul className="list-disc list-inside text-yellow-800 space-y-1">
              <li>This will copy data from localStorage to the database</li>
              <li>Existing database data will not be deleted</li>
              <li>You only need to run this once</li>
              <li>After migration, the app will use the database</li>
            </ul>
          </div>

          <button
            onClick={handleMigrate}
            disabled={migrating}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {migrating ? (
              <>
                <ArrowPathIcon className="w-5 h-5 animate-spin" />
                Migrating...
              </>
            ) : (
              <>
                <ArrowPathIcon className="w-5 h-5" />
                Start Migration
              </>
            )}
          </button>

          {result && (
            <div className={`border rounded-lg p-4 ${
              result.success 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-start gap-3">
                {result.success ? (
                  <CheckCircleIcon className="w-6 h-6 text-green-600 flex-shrink-0" />
                ) : (
                  <XCircleIcon className="w-6 h-6 text-red-600 flex-shrink-0" />
                )}
                <div>
                  <h3 className={`font-semibold ${
                    result.success ? 'text-green-900' : 'text-red-900'
                  }`}>
                    {result.success ? 'Migration Successful!' : 'Migration Failed'}
                  </h3>
                  <p className={`mt-1 ${
                    result.success ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {result.message}
                  </p>
                  {result.migrated && (
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <div className="text-sm">
                        <span className="font-medium">Departments:</span> {result.migrated.departments}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Questions:</span> {result.migrated.questions}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Campaigns:</span> {result.migrated.campaigns}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Candidates:</span> {result.migrated.candidates}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

