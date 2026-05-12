"use client";

import { useState, useEffect } from 'react';
import { getStaff, addStaff, deleteStaff, updateStaffAttendance } from '../../actions/staff';

export default function StaffManagement() {
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [name, setName] = useState('');
  const [role, setRole] = useState('Master Stylist');
  const [phone, setPhone] = useState('');
  const [salary, setSalary] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    setLoading(true);
    const data = await getStaff();
    setStaff(data);
    setLoading(false);
  };

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !role) return;

    setIsSubmitting(true);
    const result = await addStaff({
      name,
      role,
      phone,
      salary: salary ? parseInt(salary) : 0
    });

    if (result.success) {
      // Reset form and refresh list
      setName('');
      setPhone('');
      setSalary('');
      await fetchStaff();
    } else {
      alert("Failed to add staff. " + (result.error || ""));
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this staff member?")) return;
    
    // Optimistic UI update
    setStaff(prev => prev.filter(s => s.id !== id));
    
    await deleteStaff(id);
  };

  const handleAttendanceChange = async (id: string, newStatus: string) => {
    // Optimistic UI update
    setStaff(prev => prev.map(s => s.id === id ? { ...s, attendance_status: newStatus } : s));
    
    const result = await updateStaffAttendance(id, newStatus);
    if (!result.success) {
      alert("Failed to update attendance");
      await fetchStaff(); // Revert on failure
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Present': return 'bg-green-500';
      case 'Absent': return 'bg-red-500';
      case 'On Leave': return 'bg-yellow-500';
      default: return 'bg-gray-500'; // Covers missing or undefined statuses
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8 text-gold">Staff Directory</h1>

      {/* Add New Staff Form */}
      <div className="bg-white/5 border border-white/10 p-6 rounded-xl mb-12">
        <h2 className="text-xl font-bold mb-4 border-b border-white/10 pb-2">Add New Team Member</h2>
        <form onSubmit={handleAddStaff} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-400">Full Name</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. John Doe" 
              className="w-full p-2 bg-black border border-white/20 rounded-md text-white outline-none focus:border-gold"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-400">Role</label>
            <select 
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-2 bg-black border border-white/20 rounded-md text-white outline-none focus:border-gold"
            >
              <option value="Master Stylist">Master Stylist</option>
              <option value="Senior Barber">Senior Barber</option>
              <option value="Color Specialist">Color Specialist</option>
              <option value="Aesthetician">Aesthetician</option>
              <option value="Manager">Manager</option>
              <option value="Receptionist">Receptionist</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-400">Phone</label>
            <input 
              type="tel" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Contact number" 
              className="w-full p-2 bg-black border border-white/20 rounded-md text-white outline-none focus:border-gold"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-400">Monthly Salary (₹)</label>
            <input 
              type="number" 
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              placeholder="e.g. 25000" 
              className="w-full p-2 bg-black border border-white/20 rounded-md text-white outline-none focus:border-gold"
            />
          </div>
          <div>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full py-2 bg-gold text-black font-bold rounded-md uppercase tracking-wider text-sm disabled:opacity-50"
            >
              {isSubmitting ? "Adding..." : "Add Member"}
            </button>
          </div>
        </form>
      </div>

      {/* Staff List */}
      <h2 className="text-xl font-bold mb-4 border-b border-white/10 pb-2">Active Staff Members</h2>
      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-gray-500">Loading staff directory...</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="p-4 text-sm uppercase tracking-wider text-gray-400">Name</th>
                <th className="p-4 text-sm uppercase tracking-wider text-gray-400">Role</th>
                <th className="p-4 text-sm uppercase tracking-wider text-gray-400">Attendance (Today)</th>
                <th className="p-4 text-sm uppercase tracking-wider text-gray-400">Salary (Monthly)</th>
                <th className="p-4 text-sm uppercase tracking-wider text-gray-400">Contact</th>
                <th className="p-4 text-sm uppercase tracking-wider text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((member: any) => (
                <tr key={member.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4 font-bold flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold text-xs">
                      {member.name.charAt(0)}
                    </div>
                    {member.name}
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-white/10 rounded text-xs uppercase tracking-wider text-gray-300 border border-white/5">
                      {member.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(member.attendance_status || 'Present')}`}></div>
                      <select 
                        value={member.attendance_status || 'Present'}
                        onChange={(e) => handleAttendanceChange(member.id, e.target.value)}
                        className="bg-transparent text-sm text-gray-300 outline-none border border-white/10 rounded px-2 py-1 focus:border-gold hover:border-white/30 transition-colors"
                      >
                        <option value="Present" className="bg-black text-white">Present</option>
                        <option value="Absent" className="bg-black text-white">Absent</option>
                        <option value="On Leave" className="bg-black text-white">On Leave</option>
                      </select>
                    </div>
                  </td>
                  <td className="p-4 text-gray-300 text-sm">
                    {member.salary ? `₹${member.salary.toLocaleString('en-IN')}` : '-'}
                  </td>
                  <td className="p-4 text-gold font-mono text-sm">{member.phone || '-'}</td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => handleDelete(member.id)}
                      className="px-3 py-1 bg-red-500/10 text-red-500 border border-red-500/20 rounded hover:bg-red-500 hover:text-white transition-colors text-xs uppercase tracking-wider"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
              {staff.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    No staff members found. Add your team using the form above!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
