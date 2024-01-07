import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React, { FC } from 'react'
import { TypeRootrStackParamList } from './navigation.types'
import { useAuth } from '@/hooks/useAuth'
import { routes } from './routes'
import Auth from '@/components/screens/Auth/Auth'

const Stack = createNativeStackNavigator<TypeRootrStackParamList>()

const PrivateNavigation: FC = () => {
	const { user } = useAuth()

	const initialRouteName = user.token ? 'Home' : 'Onboarding'

	return (
		<Stack.Navigator
			initialRouteName={initialRouteName}
			screenOptions={{ headerTitle: '', headerShown: false }}
		>
			{routes.map(route => (
				<Stack.Screen key={route.name} {...route} />
			))}
		</Stack.Navigator>
	)
}

export default PrivateNavigation
