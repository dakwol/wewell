import { updateField } from '@/redux/actions/userActions'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import React, { FC, useState, useRef, useEffect } from 'react'
import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

//@ts-ignore
type AuthSmsRouteProp = RouteProp<RootStackParamList, 'AuthName'>

const AuthName: FC = () => {
	const route = useRoute<AuthSmsRouteProp>()
	// const { phone } = route.params
	const navigation = useNavigation()
	const dispatch = useDispatch()

	const userName = useSelector((state: any) => state.user.name)

	const handleFieldChange = (key: string, value: string) => {
		dispatch(updateField(key, value))
	}
	const checkName = () => {
		if (userName != '') {
			//@ts-ignore
			navigation.navigate('AuthCategory')
		}
	}
	return (
		<View className='flex-1 justify-between content-center p-6'>
			<View className='w-full mt-11'>
				<Text className='text-center font-bold text-2xl mb-1'>Введите имя</Text>
				<Text className='text-center text-base'>Как тебя зовут?</Text>
			</View>

			<View className='flex-row justify-center mb-20'>
				<TextInput
					className='w-full h-11 bg-gray-200 text-center rounded-lg font-bold text-2xl'
					onChangeText={value => {
						handleFieldChange('name', value)
					}}
					placeholder='Имя'
				/>
			</View>

			<TouchableOpacity
				className='p-3 bg-blue-700 rounded-3xl w-full'
				onPress={() => {
					checkName()
				}}
			>
				<Text className='color-white text-center'>Зовите меня так</Text>
			</TouchableOpacity>
		</View>
	)
}

export default AuthName
