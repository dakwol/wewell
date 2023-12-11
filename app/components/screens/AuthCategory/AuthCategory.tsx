import React, { FC, useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'

const AuthCategory: FC = () => {
	const [activeButtons, setActiveButtons] = useState<number[]>([])

	const dataButton = [
		{ id: 1, text: 'Text' },
		{ id: 2, text: 'Text' },
		{ id: 3, text: 'Text' },
		{ id: 4, text: 'Text' },
		{ id: 5, text: 'Text' },
		{ id: 6, text: 'Text' }
	]

	const handleButtonPress = (id: number) => {
		setActiveButtons(prevActiveButtons => {
			if (prevActiveButtons.includes(id)) {
				// Button is already active, remove it from the array
				return prevActiveButtons.filter(buttonId => buttonId !== id)
			} else {
				// Button is not active, add it to the array
				return [...prevActiveButtons, id]
			}
		})
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

			<View className='flex justify-center gap-3 mb-20'>
				{dataButton?.map(item => (
					<TouchableOpacity
						key={item.id}
						onPress={() => handleButtonPress(item.id)}
						className={`pt-1 pb-1 pr-6 pl-6 rounded-3xl border border-gray-200 bg-gray-200 text-center justify-center ${
							activeButtons.includes(item.id) ? 'border-blue-700' : ''
						}`}
					>
						<Text
							className={`text-${
								activeButtons.includes(item.id) ? 'blue-700' : 'gray-500'
							}`}
						>
							{item.text}
						</Text>
					</TouchableOpacity>
				))}
			</View>

			<TouchableOpacity className='p-3 bg-blue-700 rounded-3xl w-full'>
				<Text className='color-white text-center'>Готово</Text>
			</TouchableOpacity>
		</View>
	)
}

export default AuthCategory
