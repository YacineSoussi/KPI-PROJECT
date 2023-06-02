import { useQueryClient, useMutation, useQuery } from "react-query";

const useAuth = () => {
  const queryClient = useQueryClient();

  const loginRequest = async (body) => {
    const response = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();

    return data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    queryClient.removeQueries("user");
  };

  const registerRequest = async (body) => {
    const response = await fetch("http://localhost:3000/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();

    return data;
  };

  const onLogin = async (body) => {
    try {
      const data = await loginRequest(body);
      localStorage.setItem("token", data.token);
      queryClient.invalidateQueries("user");
    } catch (error) {
      console.log(error);
    }
  };

  const onRegister = async (body) => {
    try {
      await registerRequest(body);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUser = async () => {
    try {
      const response = await fetch("http://localhost:3000/auth/user", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const mutationFetchUser = useMutation(fetchUser);

  const getUser = async () => {
    try {
      const data = await mutationFetchUser.mutateAsync();
      queryClient.invalidateQueries("user");
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const {
    data: user,
    isLoading: userLoading,
    error: userError,
    refetch: refetchUser,
  } = useQuery("user", getUser);

  return {
    user,
    userLoading,
    userError,
    onLogin,
    onRegister,
    logout,
    refetchUser,
  };
};

export default useAuth;