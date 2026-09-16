export interface EmergencyContact {
  id?: string;
  name: string;
  relationship: string;
  phoneE164: string;
  isWhatsapp: boolean;
}

export interface MedicalRecord {
  id?: string;
  category: 'ALLERGY' | 'CONDITION' | 'MEDICATION' | 'INSURANCE';
  title: string;
  details?: string;
  severity?: 'LOW' | 'MODERATE' | 'SEVERE' | 'LIFE_THREATENING';
  policyNumber?: string;
  assistancePhone?: string;
}

export interface Profile {
  id: string;
  publicSlug: string;
  aliasName: string;
  fullNamePrivate?: string;
  bloodType: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | 'UNKNOWN';
  birthDate?: string;
  photoUrl?: string;
  notes?: string;
  isActive: boolean;
  createdAt: string;
  
  // Relations (often returned joined)
  emergencyContacts?: EmergencyContact[];
  medicalRecords?: MedicalRecord[];
  
  // Role of the current user in this profile (from ProfileMember)
  myRole?: 'OWNER' | 'CO_ADMIN' | 'VIEWER';
}

export interface CreateProfilePayload {
  aliasName: string;
  fullNamePrivate?: string;
  bloodType?: string;
  birthDate?: string;
  notes?: string;
  
  // Custom payload structure matching our frontend form
  emergencyContact?: {
    name: string;
    phone: string;
    hasWhatsapp: boolean;
  };
  allergies?: string;
  conditions?: string;
  insurance?: string;
}
