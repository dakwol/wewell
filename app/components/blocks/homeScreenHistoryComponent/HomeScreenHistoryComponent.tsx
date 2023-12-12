import React, { FC } from 'react'
import { Text, View, Image, Animated } from 'react-native'

interface HistoryItem {
	id: number
	name: string
	image: any
}

interface HomeScreenHistoryComponentProps {
	data: HistoryItem[]
	scrollY: Animated.Value
}

const HomeScreenHistoryComponent: FC<HomeScreenHistoryComponentProps> = ({
	data,
	scrollY
}) => {
	return (
		<View className='flex flex-wrap flex-row'>
			{data.map((item, index) => {
				// const avatarSize = scrollY.interpolate({
				// 	inputRange: [(index - 1) * 70, index * 70],
				// 	outputRange: [50, 30],
				// 	extrapolate: 'clamp'
				// })

				return (
					<View key={item.id} className='w-1/3 p-2'>
						<Animated.Image
							source={item.image}
							style={{ width: 50, height: 50 }}
						/>
						<Text className='text-center mt-2'>{item.name}</Text>
					</View>
				)
			})}
		</View>
	)
}

export default HomeScreenHistoryComponent
