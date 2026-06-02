export interface RecentRegistration {
  uid:          string;
  full_name:    string;
  program_name: string;
  status:       string;
  date:         string;
}

export interface DashboardData {
  summary:                  Record<string, number>;
  registrations_by_status:  Record<string, number>;
  revenue:                  string;
  recent_registrations:     RecentRegistration[];
  users_by_role:            Record<string, number>;
}
