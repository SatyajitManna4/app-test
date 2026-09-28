import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { EmployeeData } from '../types/employee';

interface EmployeeCardProps {
  employee: EmployeeData;
  onPress?: () => void;
}

export function EmployeeCard({ employee, onPress }: EmployeeCardProps) {
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
    if (isNaN(num)) return salary;
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(num);
  };

  return (
    <TouchableOpacity
      activeOpacity={onPress ? 0.7 : 1}
      onPress={onPress}
      className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm"
    >
      {/* Header with Avatar and ID */}
      <View className="flex-row items-center justify-between pb-4 border-b border-slate-100">
        <View className="flex-row items-center gap-3">
          <View className="w-12 h-12 rounded-full bg-indigo-600 items-center justify-center">
            <Text className="text-white font-bold text-base">
              {getInitials(employee.employeeName || 'EM')}
            </Text>
          </View>
          <View>
            <Text className="text-base font-bold text-slate-900">
              {employee.employeeName}
            </Text>
            <View className="flex-row items-center gap-1.5 mt-0.5">
              <Ionicons name="location-outline" size={13} color="#64748b" />
              <Text className="text-xs text-slate-500 font-medium">
                {employee.branch || 'Headquarters'}
              </Text>
            </View>
          </View>
        </View>

        {employee.employeeId && (
          <View className="bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-full">
            <Text className="text-xs font-bold text-indigo-700">
              {employee.employeeId}
            </Text>
          </View>
        )}
      </View>

      {/* Details Row: Email & Salary */}
      <View className="pt-4 gap-3">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <Feather name="mail" size={14} color="#64748b" />
            <Text className="text-xs text-slate-500">Email Address</Text>
          </View>
          <Text className="text-xs font-semibold text-slate-800" numberOfLines={1}>
            {employee.email}
          </Text>
        </View>

        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <Ionicons name="cash-outline" size={15} color="#059669" />
            <Text className="text-xs text-slate-500">Monthly Salary</Text>
          </View>
          <Text className="text-sm font-extrabold text-emerald-700">
            {formatSalary(employee.salary)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
