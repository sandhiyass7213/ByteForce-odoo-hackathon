'use client';

import React, { useState } from 'react';
import { 
  UserCircle, 
  Edit3, 
  Save, 
  X, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  Calendar, 
  PhoneCall, 
  Sparkles,
  Check
} from 'lucide-react';
import { EmployeeProfile } from '../types/hrms';

interface ProfileCardProps {
  user: EmployeeProfile;
  onUpdateProfile: (updatedProfile: EmployeeProfile) => void;
}

export default function ProfileCard({ user, onUpdateProfile }: ProfileCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<EmployeeProfile>(user);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleChange = (field: keyof EmployeeProfile, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleEmergencyChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      emergencyContact: { ...prev.emergencyContact, [field]: value },
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(formData);
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 space-y-6 relative overflow-hidden">
      
      {/* Save Toast Notification */}
      {savedSuccess && (
        <div className="absolute top-4 right-4 z-20 bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg animate-in fade-in slide-in-from-top-2">
          <Check className="w-4 h-4" />
          <span>Profile updated successfully!</span>
        </div>
      )}

      {/* Header Banner & Avatar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={formData.avatar}
              alt={formData.fullName}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-indigo-500/20 shadow-md"
            />
            <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              {formData.fullName}
            </h2>
            <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5">
              {formData.designation} • {formData.department}
            </p>
            <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              <span className="font-mono">ID: {formData.employeeCode}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400" />
                {formData.location}
              </span>
            </div>
          </div>
        </div>

        {/* Edit / Save Action Toggle */}
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 font-bold text-xs border border-indigo-200 dark:border-indigo-800 transition-all"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setFormData(user);
                setIsEditing(false);
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
              <span>Cancel</span>
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/25"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Details Grid */}
      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Personal & Work Information */}
        <div className="space-y-4 bg-slate-50/70 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
          <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
            <UserCircle className="w-4 h-4" />
            Personal & Work Details
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-500 dark:text-slate-400 mb-1">Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              ) : (
                <p className="font-semibold text-slate-800 dark:text-slate-200">{formData.fullName}</p>
              )}
            </div>

            <div>
              <label className="block text-slate-500 dark:text-slate-400 mb-1">Email Address</label>
              {isEditing ? (
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              ) : (
                <p className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-indigo-500" />
                  {formData.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-slate-500 dark:text-slate-400 mb-1">Phone Number</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              ) : (
                <p className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-indigo-500" />
                  {formData.phone}
                </p>
              )}
            </div>

            <div>
              <label className="block text-slate-500 dark:text-slate-400 mb-1">Office Location</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              ) : (
                <p className="font-semibold text-slate-800 dark:text-slate-200">{formData.location}</p>
              )}
            </div>
          </div>
        </div>

        {/* Emergency Contact & Skills */}
        <div className="space-y-4 bg-slate-50/70 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-2">
            <PhoneCall className="w-4 h-4" />
            Emergency Contact & Skills
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-500 dark:text-slate-400 mb-1">Contact Person Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.emergencyContact.name}
                  onChange={(e) => handleEmergencyChange('name', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              ) : (
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  {formData.emergencyContact.name} ({formData.emergencyContact.relationship})
                </p>
              )}
            </div>

            <div>
              <label className="block text-slate-500 dark:text-slate-400 mb-1">Emergency Phone</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.emergencyContact.phone}
                  onChange={(e) => handleEmergencyChange('phone', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              ) : (
                <p className="font-semibold text-slate-800 dark:text-slate-200">{formData.emergencyContact.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-slate-500 dark:text-slate-400 mb-1">Date Joined</label>
              <p className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                {formData.joinDate}
              </p>
            </div>

            {/* Skills Badges */}
            <div className="pt-2">
              <label className="block text-slate-500 dark:text-slate-400 mb-2">Technical Competencies</label>
              <div className="flex flex-wrap gap-1.5">
                {formData.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

      </form>
    </div>
  );
}
