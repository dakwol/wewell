import PreferencesApiRequest from '@/api/Preferences/Preferences'
import UserApiRequest from '@/api/User/Users'
import { updateField } from '@/redux/actions/userActions'
import { useNavigation } from '@react-navigation/native'
import React, { FC, useEffect, useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

interface iDataPreferences {
	id: number
	name: number | string
}

const AuthCategory: FC = () => {
	const [activeButtons, setActiveButtons] = useState<number[]>([])
	const navigation = useNavigation()
	const userApi = new UserApiRequest()
	const [dataButton, setDataButton] = useState<iDataPreferences[]>([])
	const userData = useSelector((state: any) => state.user)
	const preferncesApi = new PreferencesApiRequest()

	const dispatch = useDispatch()

	console.log('====================================')
	console.log('userData', userData)
	console.log('====================================')
	useEffect(() => {
		const lastButtonAll = {
			id: 0,
			name: 'Я готов ко всему!'
		}

		preferncesApi.list().then(resp => {
			if (resp.success) {
				//@ts-ignore
				setDataButton([...resp.data, lastButtonAll])
			}
		})
	}, [])

	const handleButtonPress = (data: iDataPreferences) => {
		//@ts-ignore
		setActiveButtons(prevActiveButtons => {
			let updatedButtons
			//@ts-ignore
			if (prevActiveButtons.some(button => button.id === data.id)) {
				updatedButtons = prevActiveButtons.filter(
					//@ts-ignore
					button => button.id !== data.id
				)
			} else {
				// Button is not active, add it to the array
				updatedButtons = [...prevActiveButtons, data]
			}

			// Dispatch the entire array of active buttons
			dispatch(updateField('preferences', updatedButtons))

			return updatedButtons
		})
	}

	const navigationAuth = () => {
		userApi.register(userData).then(resp => {
			console.log(resp)
		})
		// //@ts-ignore
		// navigation.navigate('Home')
	}

	return (
		<View className='flex-1 justify-between content-center p-6'>
			<View className='w-full mt-11'>
				<Text className='text-center font-bold text-2xl mb-1'>
					Ещё немного уточним
				</Text>
				<Text className='text-center text-base'>
					Так твои встречи станут ещё лучше и точно запомнятся
				</Text>
			</View>

			<View
				style={{
					justifyContent: 'center',
					alignItems: 'center',
					flexDirection: 'row',
					flexWrap: 'wrap',
					gap: 8
				}}
			>
				{dataButton?.map(item => (
					<TouchableOpacity
						key={item.id}
						onPress={() => handleButtonPress(item)}
						className={`pt-1 pb-1 pr-6 pl-6 rounded-3xl border border-gray-200 bg-gray-200 text-center justify-center ${
							//@ts-ignore
							activeButtons.some(button => button.id === item.id)
								? 'border-blue-700'
								: ''
						}`}
					>
						<Text
							style={{
								//@ts-ignore
								color: activeButtons.some(button => button.id === item.id)
									? '#0038FF'
									: '#9F9F9F'
							}}
						>
							{item.name}
						</Text>
					</TouchableOpacity>
				))}
			</View>

			<TouchableOpacity
				className='p-3 bg-blue-700 rounded-3xl w-full'
				onPress={() => {
					navigationAuth()
				}}
			>
				<Text className='color-white text-center'>Готово</Text>
			</TouchableOpacity>
		</View>
	)
}

export default AuthCategory
