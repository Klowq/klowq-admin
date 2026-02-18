export interface Preference {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePreferenceDto {
  name: string;
}

export interface UpdatePreferenceDto {
  name?: string;
}

