import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import useAuthStore from '../../../store/AuthStore';
import { useThemeStore } from '../../../store/ThemeStore';
import { useNavigation } from '@react-navigation/native';

const Profile = () => {
  const logout = () => {
    
    useAuthStore(s => s.logout);
  }
 
  const navigation = useNavigation()

  return (
    <View style={{ padding: 15, margin:5 }}>
   
      <TouchableOpacity 
      style={{width:'100%', height:50, borderWidth:1, justifyContent:'center', alignItems:"center", marginBottom: 5}}
      onPress={()=>navigation.navigate('Settings')}>
        <Text style={{color:"#000"}}>Settings</Text>
      </TouchableOpacity>
  
      {/* <TouchableOpacity 
       style={{width:'100%', height:50, borderWidth:1, justifyContent:'center', alignItems:"center", marginBottom: 5}}
        onPress={() =>
          navigation.navigate("WebViewScreen", {
            url: "https://www.thenobiasmedia.com/privacy-policy",
          })
        }
        >
        <Text>Privacy Policy</Text>
       </TouchableOpacity>
       <TouchableOpacity 
       style={{width:'100%', height:50, borderWidth:1, justifyContent:'center', alignItems:"center", marginBottom: 5}}
        onPress={() =>
          navigation.navigate("WebViewScreen", {
            url: "https://www.thenobiasmedia.com/terms-conditions",
          })
        }
        >
        <Text>Terms And Conditions</Text>
       </TouchableOpacity>
       <TouchableOpacity 
       style={{width:'100%', height:50, borderWidth:1, justifyContent:'center', alignItems:"center", marginBottom: 5}}
        onPress={() =>
          navigation.navigate("WebViewScreen", {
            url: "https://www.thenobiasmedia.com/about",
          })
        }
        >
        <Text>About Us</Text>
       </TouchableOpacity>
       <TouchableOpacity 
       style={{width:'100%', height:50, borderWidth:1, justifyContent:'center', alignItems:"center", marginBottom: 5}}
        onPress={() =>
          navigation.navigate("WebViewScreen", {
            url: "https://www.thenobiasmedia.com/contact",
          })
        }
        >
        <Text>Contact Us</Text>
       </TouchableOpacity> */}

       <TouchableOpacity 
      style={{width:'100%', height:50, borderWidth:1, justifyContent:'center', alignItems:"center"}}
      onPress={logout}>
        <Text style={{color:"#000"}}>Logout</Text>
      </TouchableOpacity>
      
    </View>
  );
};

export default Profile;
