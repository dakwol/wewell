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
import type { IUser } from '../types/user.interface'

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
		let isMounted = false

		const getUSerFromStorage = async () => {
			if (isMounted) {
			}
			await Splash.hideAsync()
		}

		let ignore = getUSerFromStorage()
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
