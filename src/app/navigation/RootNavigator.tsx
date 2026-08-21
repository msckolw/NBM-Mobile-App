import { NavigationContainer } from "@react-navigation/native";
import useAuthStore from "../../store/AuthStore";
import AuthStack from "./AuthStack";
import AppStack from "./AppStack";
   import { useAppSelector } from "../../store/hooks";


export default function RootNavigator()
{
    // const token = true;
    // const token = useAuthStore((s)=>s.token)

 const auth = useAppSelector((state) => state.auth);
console.log("RootNavigatorAuth:", auth);

const token = useAppSelector((state) => state.auth.token);
console.log("RootNavigator token:", token);

    return (
        <NavigationContainer>
            {/* {token ? <AppStack /> : <AuthStack />} */}
            <AppStack />
        </NavigationContainer>
    )
}