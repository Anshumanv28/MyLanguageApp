import { useRouter, Slot } from "expo-router";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import { Provider as PaperProvider } from "react-native-paper";
import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import BottomTabNavigator from "./components/BottomTabs";

const AuthWrapper = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !loading) {
      if (!user) {
        // router.replace("/welcome");
        // router.replace("/home");
        router.replace("/games");
      }
    }
  }, [user, loading, router, isMounted]);

  if (loading || !isMounted) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <>{user ? <BottomTabNavigator /> : <Slot />}</>;
};

export default function Layout() {
  console.log("Rendering Layout 💥💥💥💥💥💥💥💥💥💥💥💥💥");
  return (
    <AuthProvider>
      <PaperProvider>
        <AuthWrapper />
      </PaperProvider>
    </AuthProvider>
  );
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// import React from "react";
// import TestScreen from "./test";
// import { Provider as PaperProvider } from "react-native-paper";

// export default function Layout() {
//   //   return <TestScreen />;
//   // return (
//   //   <AuthProvider>
//   //     <NativeBaseProvider>
//   //       <TestScreen />;
//   //     </NativeBaseProvider>
//   //   </AuthProvider>
//   // );
//   return (
//     <PaperProvider>
//       <TestScreen />
//     </PaperProvider>
//   );
// }

// import React from "react";
// import HomeScreen from "./home";
// import { AuthProvider, useAuth } from "../contexts/AuthContext";

// export default function Layout() {
//   return (
//     <AuthProvider>
//       <HomeScreen />;
//     </AuthProvider>
//   );
// }
