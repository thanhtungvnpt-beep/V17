import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { VendorRibbon } from './components/VendorRibbon';
import { Sidebar } from './components/Sidebar';
import { ExecutiveDashboard } from './components/modules/ExecutiveDashboard';
import { VendorManagement } from './components/modules/VendorManagement';
import { ProductionModule } from './components/modules/ProductionModule';
import { QualityModule } from './components/modules/QualityModule';
import { EquipmentModule } from './components/modules/EquipmentModule';
import { MaterialModule } from './components/modules/MaterialModule';
import { KPIModule } from './components/modules/KPIModule';
import { AIAssistantModule } from './components/modules/AIAssistantModule';
import { TasksAndApprovalsModule } from './components/modules/TasksAndApprovalsModule';
import { MobileOpsModule } from './components/modules/MobileOpsModule';
import { DeveloperConsole } from './components/modules/DeveloperConsole';
import { operationsService } from './services/operationsService';
import { Language, UserProfile } from './types';

export default function App() {
  const [, setTick] = useState(0);

  // App State
  const [currentLang, setCurrentLang] = useState<Language>('vi');
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [selectedVendorId, setSelectedVendorId] = useState<string | null>(null);
  const [activeShift, setActiveShift] = useState<string>('Ca 1 (08:00 - 16:00)');
  const [selectedDate, setSelectedDate] = useState<string>('2025-06-24');

  // Subscribe to operationsService store updates
  useEffect(() => {
    const unsubscribe = operationsService.subscribe(() => {
      setTick(prev => prev + 1);
    });
    return unsubscribe;
  }, []);

  const vendors = operationsService.vendors;
  const plans = operationsService.plans;
  const qcInspections = operationsService.qcInspections;
  const equipments = operationsService.equipments;
  const materials = operationsService.materials;
  const kpis = operationsService.kpis;
  const tasks = operationsService.tasks;
  const alerts = operationsService.alerts;
  const approvals = operationsService.approvals;
  const integrations = operationsService.integrations;
  const auditLogs = operationsService.auditLogs;
  const currentUser = operationsService.currentUser;

  const unreadAlertsCount = alerts.filter(a => !a.acknowledged).length;

  return (
    <div className="min-h-screen bg-[#060b14] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* 1. Header Zone */}
      <Header
        currentLang={currentLang}
        onSelectLang={setCurrentLang}
        currentUser={currentUser}
        onSelectUser={u => operationsService.setCurrentUser(u)}
        activeShift={activeShift}
        onSelectShift={setActiveShift}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        unreadAlertsCount={unreadAlertsCount}
      />

      {/* 2. Top Vendor Ribbon (7 Facilities matching Reference UI) */}
      <VendorRibbon
        vendors={vendors}
        selectedVendorId={selectedVendorId}
        onSelectVendor={setSelectedVendorId}
        currentLang={currentLang}
      />

      {/* 3. Main Workspace: Sidebar Navigation + Active Operations Viewport */}
      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          currentLang={currentLang}
          vendors={vendors}
          selectedVendorId={selectedVendorId}
          onSelectVendor={setSelectedVendorId}
        />

        {/* Dynamic Operational Content Viewport */}
        <main className="flex-1 overflow-y-auto bg-[#070c18] pb-12">
          {activeTab === 'overview' && (
            <ExecutiveDashboard
              currentLang={currentLang}
              selectedVendorId={selectedVendorId}
              onSelectVendor={setSelectedVendorId}
              vendors={vendors}
              onNavigateToTab={setActiveTab}
            />
          )}

          {activeTab === 'vendors' && (
            <VendorManagement
              vendors={vendors}
              currentLang={currentLang}
              currentUser={currentUser}
              selectedVendorId={selectedVendorId}
              onSelectVendor={setSelectedVendorId}
              onNavigateToTab={setActiveTab}
            />
          )}

          {activeTab === 'production' && (
            <ProductionModule
              plans={plans}
              vendors={vendors}
              currentLang={currentLang}
              currentUser={currentUser}
              selectedVendorId={selectedVendorId}
              onSelectVendor={setSelectedVendorId}
            />
          )}

          {activeTab === 'quality' && (
            <QualityModule
              inspections={qcInspections}
              vendors={vendors}
              currentLang={currentLang}
              currentUser={currentUser}
              selectedVendorId={selectedVendorId}
            />
          )}

          {activeTab === 'equipment' && (
            <EquipmentModule
              equipments={equipments}
              vendors={vendors}
              currentLang={currentLang}
              currentUser={currentUser}
              selectedVendorId={selectedVendorId}
            />
          )}

          {activeTab === 'materials' && (
            <MaterialModule
              materials={materials}
              vendors={vendors}
              currentLang={currentLang}
              currentUser={currentUser}
              selectedVendorId={selectedVendorId}
            />
          )}

          {activeTab === 'kpi' && (
            <KPIModule
              kpis={kpis}
              vendors={vendors}
              currentLang={currentLang}
              currentUser={currentUser}
            />
          )}

          {activeTab === 'ai-assistant' && (
            <AIAssistantModule
              vendors={vendors}
              plans={plans}
              currentLang={currentLang}
              currentUser={currentUser}
            />
          )}

          {activeTab === 'tasks' && (
            <TasksAndApprovalsModule
              tasks={tasks}
              alerts={alerts}
              approvals={approvals}
              vendors={vendors}
              currentLang={currentLang}
              currentUser={currentUser}
            />
          )}

          {activeTab === 'mobile' && (
            <MobileOpsModule
              vendors={vendors}
              currentLang={currentLang}
              currentUser={currentUser}
            />
          )}

          {activeTab === 'developer' && (
            <DeveloperConsole
              integrations={integrations}
              auditLogs={auditLogs}
              currentUser={currentUser}
              currentLang={currentLang}
            />
          )}
        </main>
      </div>
    </div>
  );
}
