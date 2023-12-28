import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import React, { FC, useState, useRef, useEffect } from 'react'
import { View, Text, TextInput, TouchableOpacity } from 'react-native'

//@ts-ignore
type AuthSmsRouteProp = RouteProp<RootStackParamList, 'AuthSms'>

const AuthSms: FC = () => {
	const [code, setCode] = useState(['', '', '', ''])
	const [timer, setTimer] = useState(60)

	const route = useRoute<AuthSmsRouteProp>()
	const { phone } = route.params

	const handleCodeChange = (index: number, value: string) => {
		const newCode = [...code]
		newCode[index] = value

		if (index < 3 && value !== '') {
			const nextInput = index + 1
			if (nextInput < 4 && refs[nextInput].current) {
				//@ts-ignore
				refs[nextInput].current.focus()
			}
		}

		setCode(newCode)
	}

	const refs = [
		useRef<TextInput>(null),
		useRef<TextInput>(null),
		useRef<TextInput>(null),
		useRef<TextInput>(null)
	]

	// useEffect(() => {
	// 	const intervalId = setInterval(() => {
	// 		setTimer(prevTimer => (prevTimer > 0 ? prevTimer - 1 : 0))
	// 	}, 1000)
	// 	return () => clearInterval(intervalId)
	// }, [])

	// const codeRequest = () => {
	// 	setTimer(60)
	// }

	useEffect(() => {
		// get
	}, [])

	const navigation = useNavigation()
	const checkCode = () => {
		//@ts-ignore
		navigation.navigate('AuthName')
	}

	console.log(phone)

	return (
		<View className='flex-1 justify-between content-center p-6'>
			<View className='w-full mt-11'>
				<Text className='text-center font-bold text-2xl mb-1'>
					Введите код из SMS
				</Text>
				<Text className='text-center text-base'>
					{`Код отправили на номер ${phone ? phone : ''}`}
				</Text>
			</View>

			<View className='flex-row justify-center gap-2 mb-20'>
				{code.map((digit, index) => (
					<TextInput
						key={index}
						className='w-11 h-11 bg-gray-200 text-center rounded-lg font-bold text-2xl'
						value={digit}
						onChangeText={value => handleCodeChange(index, value)}
						keyboardType='numeric'
						maxLength={1}
						ref={refs[index]}
					/>
				))}
			</View>

			<View>
				{timer === 0 ? (
					<Text className='color-white text-center text-base mb-3 text-gray-400'>
						{`Запросить код снова (00:${timer})`}
					</Text>
				) : (
					<TouchableOpacity
						onPress={() => {
							// codeRequest()
						}}
					>
						<Text className='color-white text-center text-base mb-3 text-gray-400'>
							{`Запросить код снова`}
						</Text>
					</TouchableOpacity>
				)}
				<TouchableOpacity
					className='p-3 bg-blue-700 rounded-3xl w-full'
					onPress={() => checkCode()}
				>
					<Text className='color-white text-center'>Отправить</Text>
				</TouchableOpacity>
			</View>
		</View>
	)
}

export default AuthSms
