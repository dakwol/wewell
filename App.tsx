import { StatusBar } from 'expo-status-bar'
import { Text, View } from 'react-native'
import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import Navigation from '@/navigation/Navigation'
import AuthProvider from '@/providers/AuthProvider'
import { Provider } from 'react-redux'
import { store } from '@/store/store'

const queryClient = new QueryClient()

export default function App() {
	return (
		<Provider store={store}>
			<QueryClientProvider client={queryClient}>
				<AuthProvider>
					<SafeAreaProvider>
						<Navigation />
					</SafeAreaProvider>
				</AuthProvider>

				<StatusBar style='light' />
			</QueryClientProvider>
		</Provider>
	)
}
