import axiosInstance from "../Utils/Https";

const userEndpoint = "user/";

export const UpdateProfile = async (payload: {
  first_name?: string;
  last_name?: string;
  profile_url?: string;
  username?: string;
}) => {
  const url = `${userEndpoint}`;
  const res = await axiosInstance.put(url, payload);

  return res.data;
};

export const GetUser = async () => {
  const url = `${userEndpoint}`;
  const res = await axiosInstance.get(url);

  return res.data;
};
