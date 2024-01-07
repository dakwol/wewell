import UserApiRequest from '@/api/User/Users'
import ErrorMessage from '@/components/blocks/ErrorMessage/ErrorMessage'
import { login } from '@/redux/actions/authActions'
import { updateData, updateField } from '@/redux/actions/userActions'
import userData from '@/redux/reducers/userData'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'
import React, { FC, Fragment, useState } from 'react'
import { View, Text, TouchableOpacity, TextInput } from 'react-native'
import { TextInputMask } from 'react-native-masked-text'
import { useDispatch, useSelector } from 'react-redux'

const AuthRegistration: FC = () => {
	console.log('====================================')
	console.log('AuthRegistration')
	console.log('====================================')
	const userApi = new UserApiRequest()
	const navigation = useNavigation()
	const phoneNumber = useSelector((state: any) => state.user.phoneNumber)
	const password = useSelector((state: any) => state.user.password)

	const [isError, setIsError] = useState<string>('')
	const [isErrorViseble, setIsErrorVisible] = useState<boolean>(false)

	const dispatch = useDispatch()

	const handleFieldChange = (key: string, value: string) => {
		dispatch(updateField(key, value))
	}
	const checkPhone = () => {
		//@ts-ignore
		navigation.navigate('AuthName', { phoneNumber: phoneNumber })
	}

	return (
		<Fragment>
			<ErrorMessage
				message={isError}
				onClose={() => {
					setIsErrorVisible(false)
				}}
				isVisible={isErrorViseble}
			/>
			<View className='flex-1 justify-between content-center p-6'>
				<View className='w-full mt-11'>
					<Text className='text-center font-bold text-2xl mb-1'>
						Введите телефон и пароль
					</Text>
					<Text className='text-center text-base'>
						Это нужно для создания аккаунта
					</Text>
				</View>
				<View className=''>
					<TextInputMask
						type={'custom'}
						options={{
							mask: '+7 999 999-99-99'
						}}
						keyboardType='phone-pad'
						placeholder='Номер телефона'
						onChangeText={text => {
							handleFieldChange('phoneNumber', text)
						}}
						className='w-full text-center bg-gray-200 h-11 rounded-lg font-bold text-2xl mb-5'
					/>
					<TextInput
						placeholder='Пароль'
						onChangeText={text => {
							handleFieldChange('password', text)
						}}
						className='w-full text-center bg-gray-200 h-11 rounded-lg font-bold text-2xl mb-20'
					/>
				</View>
				<View className='gap-2'>
					<TouchableOpacity
						className='p-3 bg-blue-700 rounded-3xl  w-full'
						onPress={() => checkPhone()}
					>
						<Text className='color-white text-center'>Регистрация</Text>
					</TouchableOpacity>
					<TouchableOpacity
						className='p-3 rounded-3xl  w-full'
						onPress={() =>
							//@ts-ignore
							navigation.navigate('Auth')
						}
					>
						<Text className='color-blue-700 text-center'>Вход</Text>
					</TouchableOpacity>
				</View>
			</View>
		</Fragment>
	)
}

export default AuthRegistration
