import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{
          headerTitle: '',
          headerStyle: {
            // backgroundColor: '#f4511e',
            backgroundColor: '#FAFFA410',
            
          },
          headerTintColor: '#000',
          // headerTitleStyle: {
          //   alignSelf:'center'
          // },
          }} />
    </Stack>
  );
}
