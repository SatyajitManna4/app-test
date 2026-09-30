import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';
import { API_CONFIG } from '../constants/api';
import { ContactService } from '../services/contactService';
import { ContactFormData, ContactRecord } from '../types/contact';

const initialFormData: ContactFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  subject: '',
  message: '',
};

export default function ContactUsMainScreen() {
  const [formData, setFormData] = useState<ContactFormData>(initialFormData);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedRecord, setSubmittedRecord] = useState<ContactRecord | null>(null);

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: undefined }));
    }
    if (submitError) {
      setSubmitError(null);
    }
  };

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof ContactFormData, string>> = {};

    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    } else if (formData.firstName.trim().length < 2) {
      errors.firstName = 'First name must be at least 2 characters';
    }

    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!emailRegex.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (formData.phone.trim().length < 7) {
      errors.phone = 'Please enter a valid phone number';
    }

    if (!formData.address.trim()) {
      errors.address = 'Address is required';
    }

    if (!formData.subject.trim()) {
      errors.subject = 'Subject is required';
    } else if (formData.subject.trim().length < 3) {
      errors.subject = 'Subject must be at least 3 characters';
    }

    if (!formData.message.trim()) {
      errors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      errors.message = 'Message must be at least 10 characters long';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      const savedRecord = await ContactService.submitContact(formData);
      setSubmittedRecord(savedRecord);
    } catch (err: any) {
      setSubmitError(err.message || 'Something went wrong while saving to the database.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setFieldErrors({});
    setSubmitError(null);
    setSubmittedRecord(null);
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={['top']}>
      {/* Header */}
      <View className="bg-white px-5 pt-3 pb-4 border-b border-slate-200">
        <View className="flex-row items-center justify-between">
          <View>
            <View className="flex-row items-center gap-2">
              <View className="w-8 h-8 rounded-lg bg-indigo-600 items-center justify-center">
                <Ionicons name="mail-outline" size={18} color="#ffffff" />
              </View>
              <Text className="text-xl font-extrabold text-slate-900">
                Contact Us
              </Text>
            </View>
            <Text className="text-xs text-slate-500 mt-1">
              Submit your inquiry directly into our database
            </Text>
          </View>

          <View className="bg-emerald-50 border border-emerald-200 px-2.5 py-1.5 rounded-full flex-row items-center gap-1.5">
            <View className="w-2 h-2 rounded-full bg-emerald-500" />
            <Text className="text-[11px] font-bold text-emerald-700">DB Ready</Text>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ padding: 20, paddingBottom: 48 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Success Screen */}
          {submittedRecord ? (
            <View className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm items-center mt-2">
              <View className="w-16 h-16 rounded-full bg-emerald-100 items-center justify-center mb-4">
                <Ionicons name="checkmark-circle" size={40} color="#059669" />
              </View>

              <Text className="text-2xl font-extrabold text-slate-900 text-center">
                Saved Successfully!
              </Text>
              <Text className="text-xs text-slate-500 text-center mt-1.5 mb-6">
                Your contact details have been stored in the MongoDB database.
              </Text>

              <View className="w-full bg-slate-50 rounded-2xl p-4 border border-slate-200 gap-3 mb-6">
                <View className="flex-row justify-between pb-2 border-b border-slate-200">
                  <Text className="text-xs text-slate-400 font-medium">Record ID</Text>
                  <Text className="text-xs font-mono font-bold text-slate-700">
                    {submittedRecord._id}
                  </Text>
                </View>

                <View className="flex-row justify-between pb-2 border-b border-slate-200">
                  <Text className="text-xs text-slate-400 font-medium">Name</Text>
                  <Text className="text-xs font-bold text-slate-800">
                    {submittedRecord.firstName} {submittedRecord.lastName}
                  </Text>
                </View>

                <View className="flex-row justify-between pb-2 border-b border-slate-200">
                  <Text className="text-xs text-slate-400 font-medium">Email</Text>
                  <Text className="text-xs font-bold text-slate-800">
                    {submittedRecord.email}
                  </Text>
                </View>

                <View className="flex-row justify-between pb-2 border-b border-slate-200">
                  <Text className="text-xs text-slate-400 font-medium">Phone</Text>
                  <Text className="text-xs font-bold text-slate-800">
                    {submittedRecord.phone}
                  </Text>
                </View>

                <View className="flex-row justify-between pb-2 border-b border-slate-200">
                  <Text className="text-xs text-slate-400 font-medium">Subject</Text>
                  <Text className="text-xs font-bold text-slate-800">
                    {submittedRecord.subject}
                  </Text>
                </View>

                <View className="flex-row justify-between">
                  <Text className="text-xs text-slate-400 font-medium">Saved At</Text>
                  <Text className="text-xs font-bold text-slate-600">
                    {new Date(submittedRecord.createdAt).toLocaleString()}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={handleReset}
                activeOpacity={0.8}
                className="w-full bg-indigo-600 py-3.5 rounded-xl items-center justify-center flex-row gap-2 active:bg-indigo-700"
              >
                <Feather name="plus-circle" size={16} color="#ffffff" />
                <Text className="text-white font-bold text-sm">Submit Another Form</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {/* Intro Banner */}
              <View className="bg-indigo-600 rounded-3xl p-5 mb-5 shadow-sm">
                <Text className="text-lg font-extrabold text-white mb-1">
                  {"We'd love to hear from you"}
                </Text>
                <Text className="text-indigo-100 text-xs leading-4">
                  Please fill out the form below. Once submitted, your contact information is instantly stored in the database.
                </Text>
              </View>

              {/* Error Banner */}
              {submitError && (
                <View className="bg-rose-50 border border-rose-200 p-4 rounded-2xl mb-5 flex-row items-start gap-3">
                  <View className="w-7 h-7 rounded-full bg-rose-100 items-center justify-center mt-0.5">
                    <Ionicons name="alert-circle" size={18} color="#e11d48" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm font-bold text-rose-900">Submission Error</Text>
                    <Text className="text-xs text-rose-700 mt-0.5">{submitError}</Text>
                  </View>
                </View>
              )}

              {/* Form Card */}
              <View className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm gap-4">
                {/* Names Row */}
                <View className="flex-row gap-3">
                  {/* First Name */}
                  <View className="flex-1">
                    <Text className="text-xs font-bold text-slate-700 mb-1.5">
                      First Name <Text className="text-rose-500">*</Text>
                    </Text>
                    <TextInput
                      placeholder="First name"
                      placeholderTextColor="#94a3b8"
                      value={formData.firstName}
                      onChangeText={text => handleInputChange('firstName', text)}
                      autoCapitalize="words"
                      className={`bg-slate-50 border rounded-xl px-3.5 py-2.5 text-sm text-slate-900 font-medium ${
                        fieldErrors.firstName ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                      }`}
                    />
                    {fieldErrors.firstName && (
                      <Text className="text-[11px] text-rose-600 mt-1">{fieldErrors.firstName}</Text>
                    )}
                  </View>

                  {/* Last Name */}
                  <View className="flex-1">
                    <Text className="text-xs font-bold text-slate-700 mb-1.5">
                      Last Name <Text className="text-rose-500">*</Text>
                    </Text>
                    <TextInput
                      placeholder="Last name"
                      placeholderTextColor="#94a3b8"
                      value={formData.lastName}
                      onChangeText={text => handleInputChange('lastName', text)}
                      autoCapitalize="words"
                      className={`bg-slate-50 border rounded-xl px-3.5 py-2.5 text-sm text-slate-900 font-medium ${
                        fieldErrors.lastName ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                      }`}
                    />
                    {fieldErrors.lastName && (
                      <Text className="text-[11px] text-rose-600 mt-1">{fieldErrors.lastName}</Text>
                    )}
                  </View>
                </View>

                {/* Email */}
                <View>
                  <Text className="text-xs font-bold text-slate-700 mb-1.5">
                    Email Address <Text className="text-rose-500">*</Text>
                  </Text>
                  <View
                    className={`flex-row items-center bg-slate-50 border rounded-xl px-3.5 py-2.5 ${
                      fieldErrors.email ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                    }`}
                  >
                    <Feather name="mail" size={16} color="#94a3b8" />
                    <TextInput
                      placeholder="name@example.com"
                      placeholderTextColor="#94a3b8"
                      value={formData.email}
                      onChangeText={text => handleInputChange('email', text)}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      className="flex-1 ml-2.5 text-sm text-slate-900 font-medium"
                    />
                  </View>
                  {fieldErrors.email && (
                    <Text className="text-[11px] text-rose-600 mt-1">{fieldErrors.email}</Text>
                  )}
                </View>

                {/* Phone */}
                <View>
                  <Text className="text-xs font-bold text-slate-700 mb-1.5">
                    Phone Number <Text className="text-rose-500">*</Text>
                  </Text>
                  <View
                    className={`flex-row items-center bg-slate-50 border rounded-xl px-3.5 py-2.5 ${
                      fieldErrors.phone ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                    }`}
                  >
                    <Feather name="phone" size={16} color="#94a3b8" />
                    <TextInput
                      placeholder="+1 (555) 000-0000"
                      placeholderTextColor="#94a3b8"
                      value={formData.phone}
                      onChangeText={text => handleInputChange('phone', text)}
                      keyboardType="phone-pad"
                      className="flex-1 ml-2.5 text-sm text-slate-900 font-medium"
                    />
                  </View>
                  {fieldErrors.phone && (
                    <Text className="text-[11px] text-rose-600 mt-1">{fieldErrors.phone}</Text>
                  )}
                </View>

                {/* Address */}
                <View>
                  <Text className="text-xs font-bold text-slate-700 mb-1.5">
                    Address <Text className="text-rose-500">*</Text>
                  </Text>
                  <View
                    className={`flex-row items-center bg-slate-50 border rounded-xl px-3.5 py-2.5 ${
                      fieldErrors.address ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                    }`}
                  >
                    <Feather name="map-pin" size={16} color="#94a3b8" />
                    <TextInput
                      placeholder="Street address, City, Country"
                      placeholderTextColor="#94a3b8"
                      value={formData.address}
                      onChangeText={text => handleInputChange('address', text)}
                      className="flex-1 ml-2.5 text-sm text-slate-900 font-medium"
                    />
                  </View>
                  {fieldErrors.address && (
                    <Text className="text-[11px] text-rose-600 mt-1">{fieldErrors.address}</Text>
                  )}
                </View>

                {/* Subject */}
                <View>
                  <Text className="text-xs font-bold text-slate-700 mb-1.5">
                    Subject <Text className="text-rose-500">*</Text>
                  </Text>
                  <TextInput
                    placeholder="Topic or reason for contact"
                    placeholderTextColor="#94a3b8"
                    value={formData.subject}
                    onChangeText={text => handleInputChange('subject', text)}
                    className={`bg-slate-50 border rounded-xl px-3.5 py-2.5 text-sm text-slate-900 font-medium ${
                      fieldErrors.subject ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                    }`}
                  />
                  {fieldErrors.subject && (
                    <Text className="text-[11px] text-rose-600 mt-1">{fieldErrors.subject}</Text>
                  )}
                </View>

                {/* Message */}
                <View>
                  <Text className="text-xs font-bold text-slate-700 mb-1.5">
                    Message <Text className="text-rose-500">*</Text>
                  </Text>
                  <TextInput
                    placeholder="Enter your message here..."
                    placeholderTextColor="#94a3b8"
                    value={formData.message}
                    onChangeText={text => handleInputChange('message', text)}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                    className={`bg-slate-50 border rounded-xl px-3.5 py-3 text-sm text-slate-900 font-medium min-h-[100px] ${
                      fieldErrors.message ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                    }`}
                  />
                  {fieldErrors.message && (
                    <Text className="text-[11px] text-rose-600 mt-1">{fieldErrors.message}</Text>
                  )}
                </View>

                {/* Save to DB Button */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={handleSubmit}
                  disabled={submitting}
                  className="mt-2 bg-indigo-600 py-3.5 rounded-xl items-center justify-center flex-row gap-2 active:bg-indigo-700"
                >
                  {submitting ? (
                    <>
                      <ActivityIndicator size="small" color="#ffffff" />
                      <Text className="text-white font-bold text-sm">Saving to Database...</Text>
                    </>
                  ) : (
                    <>
                      <Feather name="check" size={16} color="#ffffff" />
                      <Text className="text-white font-bold text-sm">Save into Database</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>

              {/* Status info box */}
              <View className="mt-5 p-4 bg-slate-100 rounded-2xl border border-slate-200 flex-row items-center gap-3">
                <View className="w-8 h-8 rounded-full bg-slate-200 items-center justify-center">
                  <Ionicons name="server-outline" size={16} color="#475569" />
                </View>
                <View className="flex-1">
                  <Text className="text-xs font-bold text-slate-700">MongoDB Database Persistence</Text>
                  <Text className="text-[11px] text-slate-500 mt-0.5">
                    Target: <Text className="font-mono font-semibold text-indigo-600">{API_CONFIG.BACKEND_BASE_URL}</Text>
                  </Text>
                </View>
              </View>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/*
 =========================================================================
 COMMENTED OUT: OLD EMPLOYEE DIRECTORY API CODE
 The old employee search API code has been commented out below as requested.
 =========================================================================

import { EmployeeService } from '../services/employeeService';
import { EmployeeData } from '../types/employee';
import { EmployeeCard } from '../components/EmployeeCard';

export function CommentedOutEmployeeScreen() {
  const [employeeId, setEmployeeId] = useState('');
  const [employee, setEmployee] = useState<EmployeeData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recentLookups, setRecentLookups] = useState<EmployeeData[]>([]);

  const handleSearch = async (overrideId?: string) => {
    const targetId = (overrideId || employeeId).trim();
    if (!targetId) {
      setError('Please enter an Employee ID to search.');
      return;
    }
    setLoading(true);
    setError(null);
    setEmployee(null);
    try {
      const data = await EmployeeService.getEmployeeById(targetId);
      setEmployee(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch employee details.');
    } finally {
      setLoading(false);
    }
  };

  return null; // Employee API Disabled
}
*/
