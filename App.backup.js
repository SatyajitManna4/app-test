import "./global.css";
import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';

export default function App() {
  const [activeTab, setActiveTab] = useState('Overview');
  const [tapCount, setTapCount] = useState(0);

  const stats = [
    { label: 'Completed', value: '18', change: '+12%', color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'In Progress', value: '6', change: 'Active', color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Health', value: '100%', change: 'Optimal', color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  const quickActions = [
    { title: 'New Task', desc: 'Create item', icon: 'plus-circle', iconColor: '#4f46e5', bg: 'bg-indigo-50/80', border: 'border-indigo-100' },
    { title: 'Analytics', desc: 'View stats', icon: 'bar-chart-2', iconColor: '#059669', bg: 'bg-emerald-50/80', border: 'border-emerald-100' },
    { title: 'Documents', desc: 'Manage files', icon: 'file-text', iconColor: '#d97706', bg: 'bg-amber-50/80', border: 'border-amber-100' },
    { title: 'Settings', desc: 'Preferences', icon: 'settings', iconColor: '#9333ea', bg: 'bg-purple-50/80', border: 'border-purple-100' },
  ];

  const activities = [
    {
      id: '1',
      title: 'NativeWind v4 & Tailwind',
      subtitle: 'Styles compiled with React Native engine',
      time: 'Just now',
      icon: 'sparkles',
      iconColor: '#ffffff',
      badgeColor: 'bg-indigo-600',
      tag: 'Live',
      tagBg: 'bg-emerald-100 text-emerald-800',
    },
    {
      id: '2',
      title: 'Expo SDK 57 Ready',
      subtitle: 'React Native 0.86 with New Architecture',
      time: '5m ago',
      icon: 'layers',
      iconColor: '#ffffff',
      badgeColor: 'bg-blue-600',
      tag: 'Updated',
      tagBg: 'bg-blue-100 text-blue-800',
    },
    {
      id: '3',
      title: 'Vector Icons & Themes',
      subtitle: 'Smooth responsive mobile layout',
      time: '1h ago',
      icon: 'color-palette',
      iconColor: '#ffffff',
      badgeColor: 'bg-purple-600',
      tag: 'Synced',
      tagBg: 'bg-purple-100 text-purple-800',
    },
  ];

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-slate-50" edges={['top']}>
        <StatusBar style="dark" />

        {/* Top Header Bar */}
        <View className="bg-white px-5 py-4 border-b border-slate-200">
          <View className="flex-row items-center justify-between">
            {/* User Profile */}
            <View className="flex-row items-center gap-3">
              <View className="w-12 h-12 rounded-full bg-indigo-600 items-center justify-center">
                <Text className="text-white font-bold text-base">SM</Text>
              </View>
              <View>
                <View className="flex-row items-center gap-2">
                  <Text className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Welcome back</Text>
                  <View className="px-2 py-0.5 rounded-full bg-indigo-100">
                    <Text className="text-[10px] font-bold text-indigo-700">PRO</Text>
                  </View>
                </View>
                <Text className="text-lg font-bold text-slate-900">Satyajit Manna</Text>
              </View>
            </View>

            {/* Notification Icon */}
            <TouchableOpacity
              activeOpacity={0.7}
              className="w-10 h-10 rounded-full bg-slate-100 items-center justify-center border border-slate-200"
            >
              <Ionicons name="notifications-outline" size={20} color="#334155" />
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View className="mt-4 flex-row items-center bg-slate-100 px-4 py-2.5 rounded-xl border border-slate-200">
            <Feather name="search" size={18} color="#64748b" />
            <TextInput
              placeholder="Search tasks, documents, projects..."
              placeholderTextColor="#94a3b8"
              className="flex-1 ml-3 text-slate-900 text-sm"
            />
          </View>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Main Hero Card */}
          <View className="bg-indigo-600 rounded-2xl p-5 mb-5 shadow-sm">
            <View className="flex-row items-center justify-between mb-2">
              <View className="bg-indigo-500/50 px-3 py-1 rounded-full border border-indigo-400">
                <Text className="text-[11px] font-semibold text-indigo-100">NativeWind Active</Text>
              </View>
              <Text className="text-xs text-indigo-200 font-medium">Expo 57</Text>
            </View>

            <Text className="text-2xl font-extrabold text-white mt-1">
              Mobile Dashboard
            </Text>
            <Text className="text-indigo-100 text-xs mt-1 leading-5">
              Styled entirely with Tailwind CSS utility classes and native performance.
            </Text>

            <View className="flex-row items-center gap-3 mt-4">
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setTapCount(c => c + 1)}
                className="bg-white px-4 py-2 rounded-xl flex-row items-center active:bg-indigo-50"
              >
                <Text className="text-indigo-700 font-bold text-xs mr-1.5">Interactive Tap</Text>
                <Feather name="arrow-right" size={14} color="#4338ca" />
              </TouchableOpacity>

              <View className="bg-indigo-700/60 px-3 py-2 rounded-xl border border-indigo-500">
                <Text className="text-white text-xs font-semibold">
                  Taps: <Text className="font-bold text-amber-300">{tapCount}</Text>
                </Text>
              </View>
            </View>
          </View>

          {/* Stats Section */}
          <View className="mb-5">
            <Text className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wide">Key Metrics</Text>
            <View className="flex-row gap-3">
              {stats.map((item, idx) => (
                <View key={idx} className="flex-1 bg-white p-3.5 rounded-xl border border-slate-200">
                  <View className="flex-row items-center justify-between mb-1">
                    <Text className="text-xs font-medium text-slate-500">{item.label}</Text>
                  </View>
                  <Text className="text-xl font-bold text-slate-900">{item.value}</Text>
                  <View className={`mt-1 self-start px-2 py-0.5 rounded-md ${item.bg}`}>
                    <Text className={`text-[10px] font-bold ${item.color}`}>{item.change}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Quick Shortcuts */}
          <View className="mb-5">
            <Text className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wide">Quick Actions</Text>
            <View className="flex-row flex-wrap gap-3">
              {quickActions.map((action, idx) => (
                <TouchableOpacity
                  key={idx}
                  activeOpacity={0.7}
                  className={`w-[48%] p-3.5 rounded-xl bg-white border ${action.border} flex-row items-center gap-3`}
                >
                  <View className={`w-10 h-10 rounded-lg ${action.bg} items-center justify-center`}>
                    <Feather name={action.icon} size={20} color={action.iconColor} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-xs font-bold text-slate-900">{action.title}</Text>
                    <Text className="text-[10px] text-slate-500">{action.desc}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Segmented Filter */}
          <View className="bg-slate-200/80 p-1 rounded-xl flex-row mb-5">
            {['Overview', 'Components', 'Activity'].map((tab) => {
              const active = activeTab === tab;
              return (
                <TouchableOpacity
                  key={tab}
                  activeOpacity={0.8}
                  onPress={() => setActiveTab(tab)}
                  className={`flex-1 py-2 rounded-lg items-center ${active ? 'bg-white' : ''}`}
                >
                  <Text className={`text-xs font-semibold ${active ? 'text-slate-900 font-bold' : 'text-slate-500'}`}>
                    {tab}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Recent Feed */}
          <View>
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-sm font-bold text-slate-900 uppercase tracking-wide">Recent Activity</Text>
              <TouchableOpacity activeOpacity={0.6}>
                <Text className="text-xs font-semibold text-indigo-600">See All</Text>
              </TouchableOpacity>
            </View>

            <View className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 overflow-hidden">
              {activities.map((item) => (
                <View key={item.id} className="p-3.5 flex-row items-center justify-between">
                  <View className="flex-row items-center gap-3 flex-1 mr-2">
                    <View className={`w-9 h-9 rounded-lg ${item.badgeColor} items-center justify-center`}>
                      <Ionicons name={item.icon} size={18} color="#ffffff" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-xs font-bold text-slate-900">{item.title}</Text>
                      <Text className="text-[11px] text-slate-500" numberOfLines={1}>{item.subtitle}</Text>
                    </View>
                  </View>
                  <View className="items-end">
                    <View className={`px-2 py-0.5 rounded-full ${item.tagBg}`}>
                      <Text className="text-[10px] font-bold">{item.tag}</Text>
                    </View>
                    <Text className="text-[9px] text-slate-400 mt-1">{item.time}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
