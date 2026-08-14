import { NavigationContainer } from "@react-navigation/native";
import useAuthStore from "../store/AuthStore";
import AuthStack from "./AuthStack";
import AppStack from "./AppStack";


export default function RootNavigator()
{
    // const token = true;
    const token = useAuthStore((s)=>s.token)

    console.log("tokenReceived: ", token)

    return (
        <NavigationContainer>
            {/* {token ? <AppStack /> : <AuthStack />} */}
            <AppStack />
        </NavigationContainer>
    )
}