import { View, Text, Button, StyleSheet, Alert } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Input from "../../../components/common/Input";
import { loginApi } from "../../../api/auth";
// import { useAuthStore } from "../../../store/AuthStore";
import { devLog } from "../../../utils/devLog";
import {useDispatch} from 'react-redux';
import type {AppDispatch} from '../../../store';
import {setAuth} from '../store/authslice';
import { showToast } from "../../../services/ui/toastService";


const schema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().min(6).required(),
});

export default function LoginScreen({ navigation }) {
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  // const setAuth = useAuthStore((s) => s.setAuth);
  const dispatch = useDispatch<AppDispatch>();

  const onSubmit = async (data) => {
    try {
      const res = await loginApi(data.email, data.password);
      showToast({
        type: 'success',
        title: 'Login successful',
        message: 'Welcome back!',
      });
      devLog("res?.data?.token", res?.data?.token)
      dispatch(
        setAuth({
          user: res?.data?.user,
          token: res?.data?.token,
        }),
      );
      // setAuth(res?.data?.user, res?.data?.token);
    } catch (err) {
      devLog("loginFailed error:", err)
          showToast({
            type: 'error',
            title: "Login failed",
          });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <Controller
        control={control}
        name="email"
        render={({ field: { value, onChange } }) => (
          <Input
            label="Email"
            value={value}
            onChangeText={onChange}
            error={errors.email?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field: { value, onChange } }) => (
          <Input
            label="Password"
            value={value}
            secureTextEntry
            onChangeText={onChange}
            error={errors.password?.message}
          />
        )}
      />

<Button
//   title={isSubmitting ? "Please wait..." : "Login"}
  title={"Login"}
//   disabled={isSubmitting}
  onPress={handleSubmit(onSubmit)}
/>


      <Text
        style={styles.link}
        onPress={() => navigation.navigate("RegisterScreen")}
      >
        Create Account
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  title: { fontSize: 28, marginBottom: 20, fontWeight: "600",color:"#000" },
  link: { textAlign: "center", marginTop: 16, color: "blue" },
});
