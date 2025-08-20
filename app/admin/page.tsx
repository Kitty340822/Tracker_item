/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Settings, RefreshCw, Edit, Trash2, Eye, AlertCircle, CheckCircle } from 'lucide-react';
import {STATUS_CONFIG} from "@/contants"
import { EditClaimModal ,AddClaimModal } from "@/components"

const getStatusById = (status_id:number) => {
  return Object.values(STATUS_CONFIG).find(status => status.id === status_id) || STATUS_CONFIG.PENDING;
};


interface Claim {
  id: number;
  company: string;
  model: string;
  serial_number: string;
  status_id: number;
  action: string;
  time: string;
  date: string;
  last_update?: string;
}


const api = {
  fetchClaims: async (): Promise<Claim[]> => {
    const res = await fetch('/api/claim');
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return res.json();
  },

  createClaim: async (claim: Omit<Claim, 'id' | 'last_update'>): Promise<Claim> => {
    const res = await fetch('/api/claim', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(claim),
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
    }
    return res.json();
  },

  updateClaim: async (id: number, data: Partial<Claim>): Promise<Claim> => {
    const res = await fetch('/api/claim', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...data }),
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
    }
    return res.json();
  },

  deleteClaim: async (id: number): Promise<boolean> => {
    const res = await fetch('/api/claim', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
    }
    return true;
  },
};

export default function ClaimTracker() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newClaim, setNewClaim] = useState<Omit<Claim, 'id' | 'last_update'>>({
    company: '',
    model: '',
    serial_number: '',
    status_id: STATUS_CONFIG.PENDING.id,
    action: '',
    time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
    date: new Date().toISOString().split('T')[0]
  });
  
  const [editingClaim, setEditingClaim] = useState<Claim | null>(null);
  

  // Show notification function
  const showNotification = useCallback((type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  }, []);

  // โหลดข้อมูลเมื่อ component mount
  useEffect(() => {
    loadClaims();
  }, []);

  const loadClaims = async () => {
    setLoading(true);
    try {
      const data = await api.fetchClaims();
      setClaims(data);
      showNotification('success', `โหลดข้อมูลสำเร็จ (${data.length} รายการ)`);
    } catch (error) {
      showNotification('error', 'เกิดข้อผิดพลาดในการโหลดข้อมูล');
    } finally {
      setLoading(false);
    }
  };

  const handleAddClaim = async () => {
    if (!newClaim.company.trim() || !newClaim.model.trim() || !newClaim.serial_number.trim()) {
      showNotification('error', 'กรุณากรอกข้อมูลที่จำเป็น (บริษัท, รุ่นเครื่อง, หมายเลขเครื่อง)');
      return;
    }

    setIsSubmitting(true);
    try {
      const claimData = {
        ...newClaim,
        time: newClaim.time || new Date().toLocaleTimeString('th-TH', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        company: newClaim.company.trim(),
        model: newClaim.model.trim(),
        serial_number: newClaim.serial_number.trim(),
      };
      
      await api.createClaim(claimData);
      await loadClaims(); // รีโหลดข้อมูลใหม่
      
      // Reset form
      setNewClaim({
        company: '',
        model: '',
        serial_number: '',
        status_id: STATUS_CONFIG.PENDING.id,
        action: '',
        time: '',
        date: new Date().toISOString().split('T')[0]
      });
      
      setShowAddForm(false);
      showNotification('success', 'เพิ่มรายการสำเร็จ');
    } catch (error: any) {
      showNotification('error', error.message || 'เกิดข้อผิดพลาดในการเพิ่มข้อมูล');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClaim = (claim: Claim) => {
    setEditingClaim({ ...claim });
    setShowEditForm(true);
  };

  const handleUpdateClaim = async () => {
    if (!editingClaim?.company.trim() || !editingClaim.model.trim() || !editingClaim.serial_number.trim()) {
      showNotification('error', 'กรุณากรอกข้อมูลที่จำเป็น');
      return;
    }

    setIsSubmitting(true);
    try {
      const updateData = {
        ...editingClaim,
        company: editingClaim.company.trim(),
        model: editingClaim.model.trim(),
        serial_number: editingClaim.serial_number.trim(),
      };

      await api.updateClaim(editingClaim.id, updateData);
      await loadClaims(); // รีโหลดข้อมูลใหม่
      
      setEditingClaim(null);
      setShowEditForm(false);
      showNotification('success', 'อัปเดตข้อมูลสำเร็จ');
    } catch (error: any) {
      showNotification('error', error.message || 'เกิดข้อผิดพลาดในการอัปเดตข้อมูล');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingClaim(null);
    setShowEditForm(false);
  };

  const handleDeleteClaim = async (id: number, companyName: string) => {
    if (confirm(`คุณแน่ใจหรือไม่ที่จะลบรายการของ "${companyName}"?`)) {
      try {
        await api.deleteClaim(id);
        await loadClaims(); // รีโหลดข้อมูลใหม่
        showNotification('success', 'ลบรายการสำเร็จ');
      } catch (error: any) {
        showNotification('error', error.message || 'เกิดข้อผิดพลาดในการลบข้อมูล');
      }
    }
  };

  const handleStatusChange = async (claimId: number, newstatus_id: number) => {
    try {
      await api.updateClaim(claimId, { status_id: newstatus_id });
      await loadClaims(); // รีโหลดข้อมูลใหม่
      
      const statusName = getStatusById(newstatus_id).name;
      showNotification('success', `เปลี่ยนสถานะเป็น "${statusName}" สำเร็จ`);
    } catch (error: any) {
      showNotification('error', error.message || 'เกิดข้อผิดพลาดในการเปลี่ยนสถานะ');
    }
  };

  const getClaimsByStatus = (status_id: number) => {
    return claims.filter(claim => claim.status_id === status_id);
  };

  const handleRefresh = async () => {
    await loadClaims();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600 dark:text-gray-300">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Notification */}
        {notification && (
          <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg ${
            notification.type === 'success' 
              ? 'bg-green-500 text-white' 
              : 'bg-red-500 text-white'
          }`}>
            {notification.type === 'success' ? (
              <CheckCircle size={20} />
            ) : (
              <AlertCircle size={20} />
            )}
            <span>{notification.message}</span>
            <button
              onClick={() => setNotification(null)}
              className="ml-2 hover:bg-white hover:bg-opacity-20 rounded p-1"
            >
              ×
            </button>
          </div>
        )}

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-sky-500 text-white p-6 rounded-xl shadow-lg mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-center">Spare Part Claim Tracker</h1>
          <p className="text-center mt-2 text-blue-100">ระบบติดตามการเคลมอะไหล่</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
              disabled={isSubmitting}
            >
              <Plus size={20} />
              เพิ่มรายการ
            </button>
            <button className="flex items-center gap-2 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
              <Settings size={20} />
              ตั้งค่า
            </button>
            <button 
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
              รีเฟรช
            </button>
          </div>
        </div>
        {/* Add Claim Modal */}
{showAddForm && (
  <AddClaimModal
    claim={newClaim} // ใช้ newClaim แทน
    isSubmitting={isSubmitting}
    onClose={() => setShowAddForm(false)}
    onChange={(updated) => setNewClaim(updated)}
    onSubmit={handleAddClaim}
  />
)}

{/* Edit Claim Modal */}
{showEditForm && editingClaim && (
  <EditClaimModal
    claim={editingClaim}
    isSubmitting={isSubmitting}
    onClose={handleCancelEdit}
    onChange={(updated) => setEditingClaim({ ...(updated as Claim), id: updated.id ?? 0 })}
    onSubmit={handleUpdateClaim}
  />
)}

        {/* Data Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                รายการเคลม ({claims.length} รายการ)
              </h2>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                อัปเดตล่าสุด: {new Date().toLocaleString('th-TH')}
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">บริษัท/ลูกค้า</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">รุ่นเครื่อง</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">หมายเลขเครื่อง</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">สถานะ</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">การดำเนินการ</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">เวลา</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">วันที่</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">อัปเดตล่าสุด</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {claims.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                      <div className="flex flex-col items-center">
                        <AlertCircle className="w-12 h-12 mb-4 text-gray-300" />
                        <p>ไม่มีข้อมูลรายการเคลม</p>
                        <button
                          onClick={() => setShowAddForm(true)}
                          className="mt-2 text-blue-600 hover:text-blue-800 underline"
                        >
                          เพิ่มรายการแรกของคุณ
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  claims.map((claim) => {
                    const currentStatus = getStatusById(claim.status_id);
                    return (
                      <tr key={claim.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100 font-medium">{claim.company}</td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{claim.model}</td>
                        <td className="px-6 py-4 text-sm font-mono text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 rounded px-2 py-1">
                          {claim.serial_number}
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={claim.status_id}
                            onChange={(e) => handleStatusChange(claim.id, parseInt(e.target.value))}
                            className={`px-3 py-1 text-xs font-medium rounded-full border cursor-pointer ${currentStatus.color} hover:opacity-80 transition-opacity`}
                          >
                            {Object.values(STATUS_CONFIG).map(status => (
                              <option key={status.id} value={status.id}>{status.name}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100 max-w-xs truncate" title={claim.action}>
                          {claim.action || '-'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{claim.time || '-'}</td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{claim.date || '-'}</td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{claim.last_update || '-'}</td>
                        <td className="px-6 py-4">
                          <div className="flex gap-1">
                            <button 
                              className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                              title="ดูรายละเอียด"
                            >
                              <Eye size={16} />
                            </button>
                            <button 
                              onClick={() => handleEditClaim(claim)}
                              className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                              title="แก้ไข"
                            >
                              <Edit size={16} />
                            </button>
                            <button 
                              onClick={() => handleDeleteClaim(claim.id, claim.company)}
                              className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                              title="ลบ"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-6">
          {Object.values(STATUS_CONFIG).map(status => {
            const count = getClaimsByStatus(status.id).length;
            const percentage = claims.length > 0 ? ((count / claims.length) * 100).toFixed(1) : '0';
            
            return (
              <div key={status.id} className={`${status.bgColor} border ${status.borderColor} rounded-lg p-4 hover:shadow-md transition-shadow`}>
                <div className={`${status.textColor} font-medium text-sm mb-1`}>{status.name}</div>
                <div className={`text-2xl font-bold ${status.textColorDark} mb-1`}>
                  {count}
                </div>
                <div className={`text-xs ${status.textColor}`}>
                  {percentage}% ของทั้งหมด
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Stats */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mt-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">สถิติรวม</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {claims.length}
              </div>
              <div className="text-sm text-blue-600 dark:text-blue-400">รายการทั้งหมด</div>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-sm text-green-600 dark:text-green-400">เสร็จสิ้น/อนุมัติ</div>
            </div>
            <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {getClaimsByStatus(STATUS_CONFIG.PENDING.id).length + getClaimsByStatus(STATUS_CONFIG.IN_PROGRESS.id).length}
              </div>
              <div className="text-sm text-orange-600 dark:text-orange-400">อยู่ระหว่างดำเนินการ</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
 