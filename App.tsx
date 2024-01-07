import { StatusBar } from 'expo-status-bar'
import { Platform, Text, View } from 'react-native'
import React, { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import Navigation from '@/navigation/Navigation'
import AuthProvider from '@/providers/AuthProvider'
import { Provider } from 'react-redux'
import store from '@/redux/store'
import AppLoading from 'expo-app-loading'

const queryClient = new QueryClient()

export default function App() {
	const [isReady, setIsReady] = useState(false)

	// Ваша логика предварительной загрузки
	const _loadAssetsAsync = async () => {
		// Здесь вы можете загружать ресурсы, данные и т. д.
		// Например, используйте AsyncStorage, чтобы проверить, выполнен ли какой-то этап загрузки

		// Временная задержка (может быть заменена на реальную логику загрузки)
		await new Promise(resolve => setTimeout(resolve, 2000))

		// Установите isReady в true, когда ресурсы загружены
		setIsReady(true)
	}

	if (!isReady) {
		return (
			<AppLoading
				startAsync={_loadAssetsAsync}
				onFinish={() => console.log('Завершено')}
				onError={console.warn}
			></AppLoading>
		)
	}
	return (
		<QueryClientProvider client={queryClient}>
			<Provider store={store}>
				<AuthProvider>
					<SafeAreaProvider>
						<Navigation />
					</SafeAreaProvider>
				</AuthProvider>
			</Provider>
			{Platform.OS === 'ios' ? (
				<StatusBar style='dark' animated={true} />
			) : (
				<StatusBar
					style='dark'
					animated={true}
					translucent
					backgroundColor={'#fff'}
				/>
			)}
		</QueryClientProvider>
	)
}
