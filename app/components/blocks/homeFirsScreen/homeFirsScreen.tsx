import React, { FC } from 'react'
import { Text, View } from 'react-native'
//@ts-ignore
import Image from 'react-native-remote-svg'

const HomeFirsScreen: FC = () => {
	return (
		<View className='flex-1'>
			<View className='w-full mt-11 justify-center items-center'>
				<Text className='text-center font-bold text-2xl '>
					Создай первую встречу
				</Text>
				<Text className='text-center text-base mb-1 w-56'>
					И открывай новое вместе. WeWell объединяет{' '}
				</Text>
			</View>
			<View className='w-full items-end'>
				<Image
					style={{
						width: 140,
						height: 520,
						marginRight: 30,
						resizeMode: 'contain'
					}}
					source={require('../../../images/ArrowHomeStart.svg')}
				/>
			</View>
		</View>
	)
}

export default HomeFirsScreen
