import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Keyboard,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather, Ionicons } from '@expo/vector-icons';
import { EmployeeService } from '../services/employeeService';
import { EmployeeData } from '../types/employee';
import { EmployeeCard } from '../components/EmployeeCard';

export default function EmployeeLookupScreen() {
  const router = useRouter();
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

    Keyboard.dismiss();
    setLoading(true);
    setError(null);
    setEmployee(null);

    try {
      const data = await EmployeeService.getEmployeeById(targetId);
      setEmployee(data);

      // Add to recent lookups if not already present
      setRecentLookups(prev => {
        const filtered = prev.filter(item => item.employeeId !== data.employeeId);
        return [data, ...filtered.slice(0, 4)];
      });
    } catch (err: any) {
      setError(err.message || 'Failed to fetch employee details.');
    } finally {
      setLoading(false);
    }
  };

  const sampleIds = ['EMP001', 'EMP002', '101', '102'];

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={['top']}>
      {/* Screen Header */}
      <View className="bg-white px-5 pt-3 pb-4 border-b border-slate-200">
        <View className="flex-row items-center justify-between">
          <View>
            <View className="flex-row items-center gap-2">
              <View className="w-8 h-8 rounded-lg bg-indigo-600 items-center justify-center">
                <Ionicons name="briefcase-outline" size={18} color="#ffffff" />
              </View>
              <Text className="text-xl font-extrabold text-slate-900">
                Staff Directory
              </Text>
            </View>
            <Text className="text-xs text-slate-500 mt-1">
              Direct API integration with ERM System
            </Text>
          </View>

          <View className="bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full flex-row items-center gap-1.5">
            <View className="w-2 h-2 rounded-full bg-emerald-500" />
            <Text className="text-[11px] font-bold text-emerald-700">API Live</Text>
          </View>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Search Card */}
        <View className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm mb-5">
          <Text className="text-sm font-bold text-slate-900 mb-1.5">
            Search Employee by ID
          </Text>
          <Text className="text-xs text-slate-500 mb-4">
            Enter the employee code assigned in the ERM portal.
          </Text>

          <View className="flex-row items-center bg-slate-100 rounded-xl px-3.5 py-3 border border-slate-200 mb-3">
            <Feather name="search" size={18} color="#64748b" />
            <TextInput
              placeholder="e.g. EMP001 or 101"
              placeholderTextColor="#94a3b8"
              value={employeeId}
              onChangeText={(text) => {
                setEmployeeId(text);
                if (error) setError(null);
              }}
              onSubmitEditing={() => handleSearch()}
              autoCapitalize="characters"
              autoCorrect={false}
              className="flex-1 ml-3 text-slate-900 text-sm font-medium"
            />
            {employeeId.length > 0 && (
              <TouchableOpacity onPress={() => setEmployeeId('')} className="p-1">
                <Ionicons name="close-circle" size={18} color="#94a3b8" />
              </TouchableOpacity>
            )}
          </View>

          {/* Quick ID Pills */}
          <View className="flex-row items-center flex-wrap gap-2 mb-4">
            <Text className="text-xs text-slate-400 font-medium mr-1">Try:</Text>
            {sampleIds.map(id => (
              <TouchableOpacity
                key={id}
                onPress={() => {
                  setEmployeeId(id);
                  handleSearch(id);
                }}
                className="bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200"
              >
                <Text className="text-xs font-semibold text-slate-600">{id}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Search Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => handleSearch()}
            disabled={loading}
            className="bg-indigo-600 py-3.5 rounded-xl items-center justify-center flex-row gap-2 active:bg-indigo-700"
          >
            {loading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <>
                <Feather name="search" size={16} color="#ffffff" />
                <Text className="text-white font-bold text-sm">Fetch Details</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Loading State */}
        {loading && (
          <View className="bg-white p-8 rounded-2xl border border-slate-200 items-center justify-center mb-5">
            <ActivityIndicator size="large" color="#4f46e5" />
            <Text className="text-slate-700 font-bold text-sm mt-3">Connecting to ERM API...</Text>
            <Text className="text-slate-400 text-xs mt-1">Fetching employee record</Text>
          </View>
        )}

        {/* Error State */}
        {error && !loading && (
          <View className="bg-rose-50 border border-rose-200 p-4 rounded-2xl mb-5 flex-row items-start gap-3">
            <View className="w-8 h-8 rounded-full bg-rose-100 items-center justify-center">
              <Ionicons name="alert-circle" size={20} color="#e11d48" />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-bold text-rose-900">Lookup Failed</Text>
              <Text className="text-xs text-rose-700 mt-0.5">{error}</Text>
            </View>
          </View>
        )}

        {/* Result Employee Card */}
        {employee && !loading && (
          <View className="mb-5">
            <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Employee Found
            </Text>
            <EmployeeCard
              employee={employee}
              onPress={() => {
                if (employee.employeeId) {
                  router.push(`/employee/${employee.employeeId}`);
                }
              }}
            />

            <TouchableOpacity
              onPress={() => {
                if (employee.employeeId) {
                  router.push(`/employee/${employee.employeeId}`);
                }
              }}
              className="mt-3 bg-white py-3 rounded-xl border border-indigo-200 items-center justify-center flex-row gap-2 active:bg-indigo-50"
            >
              <Text className="text-xs font-bold text-indigo-700">View Full Profile</Text>
              <Feather name="arrow-right" size={14} color="#4338ca" />
            </TouchableOpacity>
          </View>
        )}

        {/* Recent Lookups */}
        {recentLookups.length > 0 && (
          <View>
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Recent Lookups ({recentLookups.length})
              </Text>
              <TouchableOpacity onPress={() => setRecentLookups([])}>
                <Text className="text-xs font-semibold text-rose-600">Clear</Text>
              </TouchableOpacity>
            </View>

            <View className="gap-3">
              {recentLookups.map(item => (
                <EmployeeCard
                  key={item.employeeId}
                  employee={item}
                  onPress={() => {
                    setEmployee(item);
                    setEmployeeId(item.employeeId || '');
                  }}
                />
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
