import React, { createContext, useContext, useState, useEffect } from 'react';
import { Tenant, TenantId } from '../types';

export const TENANTS_DATA: Record<TenantId, Tenant> = {
  yeti: {
    tenant_id: 'yeti',
    display_name: 'Yeti Airlines',
    subdomain: 'yeti',
    domain: 'yetiairlines.com',
    primary_color: '#107c41',
    secondary_color: '#0b552c',
    logo_text: 'YETI AIRLINES SMS PORTAL',
    fleets: [
      {
        aircraft_type: 'ATR 72-500',
        manufacturer: 'ATR',
        count: 7,
        registrations: ['9N-AMM', '9N-AMN', '9N-ALN', '9N-ANC', '9N-AMY']
      }
    ],
    operating_bases: ['VNKT (Tribhuvan)', 'VNPK (Pokhara)', 'VNBW (Bhairahawa)']
  },
  sita: {
    tenant_id: 'sita',
    display_name: 'Sita Air',
    subdomain: 'sita',
    domain: 'sitaair.com.np',
    primary_color: '#1e3a8a',
    secondary_color: '#3b82f6',
    logo_text: 'SITA AIR SMS PLATFORM',
    fleets: [
      {
        aircraft_type: 'Dornier 228-202',
        manufacturer: 'Dornier',
        count: 4,
        registrations: ['9N-AHR', '9N-AHB', '9N-AJH']
      }
    ],
    operating_bases: ['VNKT (Kathmandu)', 'VNLK (Lukla STOL)', 'VNNC (Nepalgunj)']
  },
  regulator: {
    tenant_id: 'regulator',
    display_name: 'State Aviation Regulator',
    subdomain: 'regulator',
    domain: 'stateregulator.gov',
    primary_color: '#991b1b',
    secondary_color: '#b91c1c',
    logo_text: 'STATE REGULATOR SAFETY OVERSIGHT',
    fleets: [],
    operating_bases: ['State Flight Information Region (FIR)']
  },
  caan: {
    tenant_id: 'regulator',
    display_name: 'State Aviation Regulator',
    subdomain: 'regulator',
    domain: 'stateregulator.gov',
    primary_color: '#991b1b',
    secondary_color: '#b91c1c',
    logo_text: 'STATE REGULATOR SAFETY OVERSIGHT',
    fleets: [],
    operating_bases: ['State Flight Information Region (FIR)']
  },
  default: {
    tenant_id: 'default',
    display_name: 'AviaSafe Systems Core',
    subdomain: 'sms',
    domain: 'aviasafesystems.com',
    primary_color: '#0f172a',
    secondary_color: '#2563eb',
    logo_text: 'AVIASAFE SYSTEMS SAFETY PLATFORM',
    fleets: [],
    operating_bases: ['Global']
  }
};

interface TenantContextType {
  tenant: Tenant;
  setTenantId: (id: TenantId) => void;
  isCustomSubdomain: boolean;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tenantId, setTenantId] = useState<TenantId>('yeti');
  const [isCustomSubdomain, setIsCustomSubdomain] = useState(false);

  useEffect(() => {
    // Resolve tenant from window hostname: e.g. yeti.aviasafesystems.com
    const hostname = window.location.hostname.toLowerCase();
    const parts = hostname.split('.');
    
    if (parts.length >= 3) {
      const sub = parts[0];
      if (sub === 'yeti' || sub === 'sita' || sub === 'regulator' || sub === 'caan') {
        setTenantId((sub === 'caan' ? 'regulator' : sub) as TenantId);
        setIsCustomSubdomain(true);
      }
    }
  }, []);

  const tenant = TENANTS_DATA[tenantId] || TENANTS_DATA.default;

  return (
    <TenantContext.Provider value={{ tenant, setTenantId, isCustomSubdomain }}>
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};
