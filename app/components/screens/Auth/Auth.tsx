import UserApiRequest from '@/api/User/Users'
import ErrorMessage from '@/components/blocks/ErrorMessage/ErrorMessage'
import { useAuth } from '@/hooks/useAuth'
import { login } from '@/redux/actions/authActions'
import { updateData, updateField } from '@/redux/actions/userActions'
import userData from '@/redux/reducers/userData'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'
import React, { FC, Fragment, useState } from 'react'
import { View, Text, TouchableOpacity, TextInput } from 'react-native'
import { TextInputMask } from 'react-native-masked-text'
import { useDispatch, useSelector } from 'react-redux'
import { Ionicons } from '@expo/vector-icons'

const Auth: FC = () => {
	const { setUser } = useAuth()
	const userApi = new UserApiRequest()
	const navigation = useNavigation()
	const phoneNumber = useSelector((state: any) => state.user.phoneNumber)
	const password = useSelector((state: any) => state.user.password)

	const [isError, setIsError] = useState<string>('')
	const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(true)
	const [isErrorViseble, setIsErrorVisible] = useState<boolean>(false)
	//@ts-ignore
	const forceUpdate = useSelector(state => state.updateReducer.forceUpdate)

	const dispatch = useDispatch()

	const handleFieldChange = (key: string, value: string) => {
		dispatch(updateField(key, value))
	}
	const checkPhone = () => {
		const dataUser = {
			phoneNumber: phoneNumber,
			password: password
		}
		if (dataUser.phoneNumber !== undefined) {
			userApi.login(dataUser).then(resp => {
				if (resp.success && resp.data) {
					const data = resp.data

					//@ts-ignore
					AsyncStorage.setItem('user', JSON.stringify(resp.data))
						.then(() => {
							console.log('user сохранён в AsyncStorage')
							//@ts-ignore
							Object.entries(data.user).forEach(([key, value]) => {
								//@ts-ignore
								dispatch(updateData({ key, value }))
								dispatch({ type: 'SET_FORCE_UPDATE', payload: !forceUpdate })
								//@ts-ignoreё
								navigation.navigate('Home')
							})
							//@ts-ignore
							setUser(resp.data)
						})
						.catch(error => {
							console.error('Ошибка при сохранении user в AsyncStorage:', error)
						})
				} else {
					//@ts-ignore
					navigation.navigate('AuthRegistration')
				}
			})
		} else {
			setIsErrorVisible(true)
			setIsError('Не заполнены поля')
		}
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
						Это нужно для входа в аккаунт
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
					<View className='relative'>
						<TextInput
							placeholder='Пароль'
							secureTextEntry={isPasswordVisible}
							onChangeText={text => {
								handleFieldChange('password', text)
							}}
							className='w-full text-center bg-gray-200 h-11 rounded-lg font-bold text-2xl mb-20'
						/>
						<TouchableOpacity
							className='absolute right-3 top-2.5'
							onPress={() => {
								setIsPasswordVisible(!isPasswordVisible)
							}}
						>
							{isPasswordVisible ? (
								<Ionicons name='eye' size={24} color='black' />
							) : (
								<Ionicons name='eye-off' size={24} color='black' />
							)}
						</TouchableOpacity>
					</View>
				</View>
				<View className='gap-2'>
					<TouchableOpacity
						className='p-3 bg-blue-700 rounded-3xl  w-full'
						onPress={() => checkPhone()}
					>
						<Text className='color-white text-center'>Вход</Text>
					</TouchableOpacity>
					<TouchableOpacity
						className='p-3 rounded-3xl  w-full'
						onPress={() =>
							//@ts-ignore
							navigation.navigate('AuthRegistration')
						}
					>
						<Text className='color-blue-700 text-center'>Регистрация</Text>
					</TouchableOpacity>
				</View>
			</View>
		</Fragment>
	)
}

export default Auth
