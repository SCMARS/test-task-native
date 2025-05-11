import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './src/navigation/RootNavigator';
import { AppRegistry } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

function App() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
                <PaperProvider>
                    <NavigationContainer>
                        <RootNavigator />
                    </NavigationContainer>
                </PaperProvider>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
}

AppRegistry.registerComponent('main', () => App);

export default App;