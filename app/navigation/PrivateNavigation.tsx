import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React, { FC } from 'react'
import { TypeRootrStackParamList } from './navigation.types'
import { useAuth } from '@/hooks/useAuth'
import { routes } from './routes'
import Auth from '@/components/screens/Auth/Auth'

const Stack = createNativeStackNavigator<TypeRootrStackParamList>()

const PrivateNavigation: FC = () => {
	const { user } = useAuth()
	return (
		<Stack.Navigator screenOptions={{}}>
			{user ? (
				routes.map(route => <Stack.Screen key={route.name} {...route} />)
			) : (
				<Stack.Screen name='Auth' component={Auth} />
			)}
		</Stack.Navigator>
	)
}

export default PrivateNavigation
