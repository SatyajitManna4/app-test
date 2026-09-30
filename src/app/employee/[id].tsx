import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Feather, Ionicons } from '@expo/vector-icons';
import { EmployeeService } from '../../services/employeeService';
import { EmployeeData } from '../../types/employee';

export default function EmployeeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [employee, setEmployee] = useState<EmployeeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEmployee = (empId: string) => {
    setLoading(true);
    setError(null);
    EmployeeService.getEmployeeById(empId)
      .then(data => {
        setEmployee(data);
        setLoading(false);
      })
      .catch((err: any) => {
        setError(err.message || 'Failed to l  oad employee profile.');
        setLoading(false);
      });
  };

  useEffect(() => {
    let isMounted = true;
    if (id) {
      EmployeeService.getEmployeeById(id)
        .then(data => {
          if (isMounted) {
            setEmployee(data);
            setLoading(false);
          }
        })
        .catch((err: any) => {
          if (isMounted) {
            setError(err.message || 'Failed to load employee profile.');
            setLoading(false);
          }
        });
    }
    return () => {
      isMounted = false;
    };
  }, [id]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const formatSalary = (salary: string | number) => {
    const num = Number(salary);
    if (isNaN(num)) return `₹${salary}`;
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(num);
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50 p-6">
        <ActivityIndicator size="large" color="#4f46e5" />
        <Text className="text-slate-700 font-bold text-sm mt-3">Loading Profile...</Text>
        <Text className="text-slate-400 text-xs mt-1">Connecting to ERM database for ID: {id}</Text>
      </View>
    );
  }

  if (error || !employee) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50 p-6">
        <View className="w-14 h-14 rounded-full bg-rose-100 items-center justify-center mb-3">
          <Ionicons name="alert-circle-outline" size={32} color="#e11d48" />
        </View>
        <Text className="text-lg font-bold text-slate-900 mb-1">Profile Not Found</Text>
        <Text className="text-xs text-slate-500 text-center mb-5">{error || 'Unknown error'}</Text>
        <TouchableOpacity
          onPress={() => id && fetchEmployee(id)}
          className="bg-indigo-600 px-5 py-2.5 rounded-xl flex-row items-center gap-2"
        >
          <Feather name="refresh-cw" size={14} color="#ffffff" />
          <Text className="text-white font-bold text-xs">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const annualSalary = Number(employee.salary) * 12;

  return (
    <ScrollView
      className="flex-1 bg-slate-50"
      contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Profile Card */}
      <View className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm items-center mb-5">
        <View className="w-20 h-20 rounded-full bg-indigo-600 items-center justify-center shadow-md mb-3">
          <Text className="text-white font-extrabold text-2xl">
            {getInitials(employee.employeeName)}
          </Text>
        </View>

        <Text className="text-xl font-extrabold text-slate-900 text-center">
          {employee.employeeName}
        </Text>

        <View className="flex-row items-center gap-2 mt-2">
          <View className="bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full">
            <Text className="text-xs font-bold text-indigo-700">
              ID: {employee.employeeId || id}
            </Text>
          </View>
          <View className="bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full">
            <Text className="text-xs font-bold text-emerald-700">Active Staff</Text>
          </View>
        </View>

        {/* Quick Contact Buttons */}
        <View className="flex-row gap-3 mt-5 w-full">
          <TouchableOpacity
            onPress={() => Linking.openURL(`mailto:${employee.email}`)}
            className="flex-1 bg-indigo-50 border border-indigo-100 py-3 rounded-xl items-center justify-center flex-row gap-2"
          >
            <Feather name="mail" size={16} color="#4f46e5" />
            <Text className="text-xs font-bold text-indigo-700">Send Email</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Employment Details */}
      <View className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm mb-5">
        <Text className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-4">
          Employment Information
        </Text>

        <View className="gap-4">
          <View className="flex-row items-center justify-between pb-3 border-b border-slate-100">
            <View className="flex-row items-center gap-2.5">
              <View className="w-8 h-8 rounded-lg bg-blue-50 items-center justify-center">
                <Ionicons name="location-outline" size={16} color="#2563eb" />
              </View>
              <Text className="text-xs text-slate-500 font-medium">Branch Location</Text>
            </View>
            <Text className="text-sm font-bold text-slate-900">{employee.branch}</Text>
          </View>

          <View className="flex-row items-center justify-between pb-3 border-b border-slate-100">
            <View className="flex-row items-center gap-2.5">
              <View className="w-8 h-8 rounded-lg bg-emerald-50 items-center justify-center">
                <Ionicons name="cash-outline" size={16} color="#059669" />
              </View>
              <Text className="text-xs text-slate-500 font-medium">Monthly Gross</Text>
            </View>
            <Text className="text-sm font-extrabold text-emerald-700">
              {formatSalary(employee.salary)}
            </Text>
          </View>

          {!isNaN(annualSalary) && (
            <View className="flex-row items-center justify-between pb-3 border-b border-slate-100">
              <View className="flex-row items-center gap-2.5">
                <View className="w-8 h-8 rounded-lg bg-purple-50 items-center justify-center">
                  <Feather name="trending-up" size={16} color="#9333ea" />
                </View>
                <Text className="text-xs text-slate-500 font-medium">Annualized CTC</Text>
              </View>
              <Text className="text-sm font-bold text-slate-900">
                {formatSalary(annualSalary)}
              </Text>
            </View>
          )}

          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2.5">
              <View className="w-8 h-8 rounded-lg bg-amber-50 items-center justify-center">
                <Feather name="mail" size={16} color="#d97706" />
              </View>
              <Text className="text-xs text-slate-500 font-medium">Corporate Email</Text>
            </View>
            <Text className="text-xs font-bold text-slate-800" numberOfLines={1}>
              {employee.email}
            </Text>
          </View>
        </View>
      </View>

      {/* ERM Metadata Card */}
      <View className="bg-slate-100 p-4 rounded-2xl border border-slate-200">
        <View className="flex-row items-center gap-2 mb-1">
          <Ionicons name="shield-checkmark-outline" size={16} color="#64748b" />
          <Text className="text-xs font-bold text-slate-700">Verified ERM Record</Text>
        </View>
        <Text className="text-[11px] text-slate-500 leading-4">
          Fetched via direct API integration from suropriyo.in external employee registry service with secure API Key authentication.
        </Text>
      </View>
    </ScrollView>
  );
}
