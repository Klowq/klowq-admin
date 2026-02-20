export type DoctorStatus = "Verified" | "Pending" | "In Review" | "Rejected" | "Suspended";

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  title: string;
  blogCount: number;
  status: DoctorStatus;
}

