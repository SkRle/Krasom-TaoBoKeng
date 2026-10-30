import type { Option } from "@/lib/constants";

export type HelperRow = {
  id: number;
  titleName: string | null;
  firstName: string | null;
  middleName: string | null;
  lastName: string | null;
  nickName: string | null;
  address: string | null;
  phoneNumber: string | null;
  status: string | null;
  sex: string | null;
  mediumId: number | null;
  mediumName: string | null;
  profileId: string | null;
  profilePath: string | null;
  createdAt: Date | null;
  updateAt: Date | null;
};

export type MediumOption = Option;
