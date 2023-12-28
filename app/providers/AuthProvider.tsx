import * as Splash from 'expo-splash-screen'
import React, {
	createContext,
	Dispatch,
	FC,
	PropsWithChildren,
	SetStateAction,
	useEffect,
	useState
} from 'react'
import type { IUser } from '@/types/user.interface'
import store from '@/redux/store'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useSelector } from 'react-redux'

export type TypeUser = IUser | null

interface IContext {
	user: IUser
	setUser: Dispatch<SetStateAction<TypeUser>>
}

export const AuthContext = createContext({} as IContext)

let ignore = Splash.preventAutoHideAsync()

const AuthProvider: FC<PropsWithChildren<unknown>> = ({ children }) => {
	const [user, setUser] = useState<TypeUser>({} as IUser)

	useEffect(() => {
		let isMounted = true

		const getUserFromStorage = async () => {
			try {
				const userFromStorage = await AsyncStorage.getItem('user')
				//@ts-ignore
				const userObject = JSON.parse(userFromStorage)

				if (userObject && isMounted) {
					//@ts-ignore
					setUser(userObject)
					await Splash.hideAsync()
				} else {
					await Splash.hideAsync()
				}
			} catch (error) {
				console.error('Error reading token from AsyncStorage:', error)
				await Splash.hideAsync()
			}
		}
		getUserFromStorage()

		return () => {
			isMounted = false
		}
	}, [])

	return (
		//@ts-ignore
		<AuthContext.Provider value={{ user, setUser }}>
			{children}
		</AuthContext.Provider>
	)
}

export default AuthProvider
