import { useNavigation } from '@react-navigation/native'
import React, { FC } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { TextInputMask } from 'react-native-masked-text'

const Auth: FC = () => {
	console.log('====================================')
	console.log('Auth')
	console.log('====================================')
	const navigation = useNavigation()
	const checkPhone = () => {
		//@ts-ignore
		navigation.navigate('AuthSms', { phone: '333333333' })
	}
	return (
		<View className='flex-1 justify-between content-center p-6'>
			<View className='w-full mt-11'>
				<Text className='text-center font-bold text-2xl mb-1'>
					Введите номер телефона
				</Text>
				<Text className='text-center text-base'>
					Мы отправим на него код для входа
				</Text>
			</View>
			<TextInputMask
				type={'custom'}
				options={{
					mask: '+7 999 999-99-99'
				}}
				keyboardType='phone-pad'
				placeholder='Номер телефона'
				onChangeText={text => {}}
				className='w-full text-center bg-gray-200 h-11 rounded-lg font-bold text-2xl mb-20'
			/>
			<TouchableOpacity
				className='p-3 bg-blue-700 rounded-3xl  w-full'
				onPress={() => checkPhone()}
			>
				<Text className='color-white text-center'>Получить код</Text>
			</TouchableOpacity>
		</View>
	)
}

export default Auth
