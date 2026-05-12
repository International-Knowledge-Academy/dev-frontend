export interface Contact {
  uid:              string;
  full_name:        string;
  organization:     string;
  email:            string;
  phone_whatsapp:   string;
  program_category: string;
  program_type:     string;
  message:          string;
  status:           string;
  created_at:       string;
}

export interface PaginatedContacts {
  count:    number;
  next:     string | null;
  previous: string | null;
  results:  Contact[];
}

export interface ContactsParams {
  page?:     number;
  search?:   string;
  ordering?: string;
  status?:   string;
}

export interface CreateContactPayload {
  full_name:        string;
  organization:     string;
  email:            string;
  phone_whatsapp:   string;
  program_category: string;
  program_type:     string;
  message:          string;
  status?:          string;
}
