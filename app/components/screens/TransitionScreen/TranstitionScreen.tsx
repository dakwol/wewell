import React, { FC, useEffect, useRef } from 'react'
import { View, Text, Animated } from 'react-native'

const Transition: FC = ({ navigation }: any) => {
	const opacity = useRef(new Animated.Value(0)).current

	useEffect(() => {
		Animated.timing(opacity, {
			toValue: 1,
			duration: 500,
			useNativeDriver: true
		}).start()
	}, [])

	return (
		<Animated.View
			style={{
				flex: 1,
				justifyContent: 'center',
				alignItems: 'center',
				opacity
			}}
			className={'bg-blue-600'}
		>
			<Text>Transition Screen</Text>
		</Animated.View>
	)
}

export default Transition
