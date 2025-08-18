import React from 'react'
import { RefreshCw } from 'lucide-react';
const loading = () => {
    
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600 dark:text-gray-300">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

export default loading
