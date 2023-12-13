import {
	clearDatapress,
	setDatapress
} from '@/store/reducers/dataPressItem/dataPressItemReducer'
import { useNavigation } from '@react-navigation/native'
import React, { FC } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { TextInputMask } from 'react-native-masked-text'
import { useDispatch, useSelector } from 'react-redux'

const Auth: FC = () => {
	const navigation = useNavigation()
	const dispatch = useDispatch()

	//@ts-ignore
	const dataPress = useSelector(state => state.dataPress.dataPress)
	//@ts-ignore
	const authPress = useSelector(state => state.authPress.authPress)

	const handleSetDatapress = (key: string, value: string) => {
		dispatch(setDatapress({ fieldName: key, fieldValue: value }))
	}

	console.log(dataPress)
	console.log(authPress)

	const handleClearDatapress = () => {
		dispatch(clearDatapress())
	}
	const checkPhone = () => {
		if (dataPress.phone != undefined) {
			//@ts-ignore
			navigation.navigate('AuthSms', { phone: dataPress.phone })
		} else {
		}
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
				onChangeText={text => {
					handleSetDatapress('phone', text)
				}}
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
