import { useQueryClient, useMutation, useQuery } from "react-query";
import jwtDecode from "jwt-decode";

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

    if (!response.ok) {
      throw new Error(
        "Échec de la connexion. Veuillez vérifier vos informations."
      );
    }
    const token = await response.text();
    const decodedToken = jwtDecode(token);
    const data = decodedToken; // Use the specific data needed from the decoded token

    return { ...data, token };
  };
  const onLogin = async (body) => {
    try {
      const data = await loginRequest(body);
      localStorage.setItem("token", data.token);
      queryClient.invalidateQueries("user");
    } catch (error) {
      console.log(error, "error");
      throw new Error(
        "Échec de la connexion. Veuillez vérifier vos informations."
      );
    }
  };
  const logout = () => {
    localStorage.removeItem("token");
    queryClient.invalidateQueries("user");
  };

  const registerRequest = async (body) => {
    const response = await fetch("http://localhost:3000/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message);
    }
    const data = await response.json();

    return data;
  };

  const onRegister = async (body) => {
    try {
      await registerRequest(body);
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const fetchUser = async () => {
    if (!localStorage.getItem("token")) {
      return null;
    }
    try {
      const response = await fetch("http://localhost:3000/auth/me", {
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
