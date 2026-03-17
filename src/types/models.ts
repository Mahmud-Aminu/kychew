import type { IconType } from "react-icons";

export interface Member {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    state: string;
    lga: string;
    role: string;
    avatarUrl: string;
    joinedDate: string;
}

export interface RegistrationFormData {
    fullName: string;
    email: string;
    phone: string;
    state: string;
    lga: string;
    password: string;
    confirmPassword: string;
}

export interface RegistrationFormErrors {
    fullName?: string;
    email?: string;
    phone?: string;
    state?: string;
    lga?: string;
    password?: string;
    confirmPassword?: string;
}

export interface Job {
    id: string;
    title: string;
    organization: string;
    location: string;
    type: 'Full-Time' | 'Part-Time' | 'Contract' | 'Volunteer';
    description: string;
    postedDate: string;
}

export interface Experience {
    id: string;
    title: string;
    organization: string;
    startDate: string;
    endDate: string;
    description: string;
}

export interface ProfileData {
    fullName: string;
    email: string;
    phone: string;
    verified: boolean;
    state: string;
    lga: string;
    role: string;
    avatarUrl: string;
    bio: string;
    experiences: Experience[];
    cvFileName: string | null;
}

export interface IDCardData {
    fullName: string;
    memberId: string;
    role: string;
    state: string;
    lga: string;
    passportUrl: string;
    issueDate: string;
    expiryDate: string;
}

export interface StatsCardData {
    label: string;
    value: string | number;
    icon: string;
    color: 'blue' | 'green' | 'amber';
}

export interface NavItem {
    label: string;
    path: string;
    icon: IconType;
}

export interface UserProfile {
  uid: string;
  fullName: string;
  email: string;
  phone: string;
  state: string;
  lga: string;
  userType: string;
  avatarUrl: string;
  bio: string;
  experiences: Experience[];
  cvFileName: string | null;
  membershipId: string;
}