import ImagePickerExample from '@/components/blocks/ImagePicker/ImagePicker'
import { useNavigation } from '@react-navigation/native'
import React, { FC, useRef, useState } from 'react'
import { Animated, Text, TouchableOpacity, View } from 'react-native'
//@ts-ignore
import Image from 'react-native-remote-svg'

const Profile: FC = () => {
	const scrollY = useRef(new Animated.Value(0)).current
	const [isImagePickerVisible, setIsImagePickerVisible] = useState(false)

	const navigation = useNavigation()

	const avatarSize = scrollY.interpolate({
		inputRange: [0, 150],
		outputRange: [80, 50],
		extrapolate: 'clamp'
	})

	const showImagePicker = () => {
		setIsImagePickerVisible(true)
	}

	const hideImagePicker = () => {
		setIsImagePickerVisible(!isImagePickerVisible)
	}

	return (
		<View className='flex-1'>
			<View className='absolute w-full justify-between flex-row p-4 mt-6 align-middle items-center z-50'>
				<TouchableOpacity
					onPress={() => {
						//@ts-ignore
						navigation.goBack()
					}}
				>
					<Image source={require('../../../images/Icons/Back.svg')} />
				</TouchableOpacity>
				<TouchableOpacity
					onPress={() => {
						//@ts-ignore
						navigation.navigate('Home')
					}}
				>
					<Text className='text-blue-700 text-base'>Готово</Text>
				</TouchableOpacity>
			</View>
			<Animated.ScrollView
				onScroll={Animated.event(
					[{ nativeEvent: { contentOffset: { y: scrollY } } }],
					{ useNativeDriver: false }
				)}
				scrollEventThrottle={16}
			>
				<Animated.View
					style={{
						justifyContent: 'center',
						alignItems: 'center',
						marginTop: 40
					}}
				>
					<Animated.Image
						source={require('../../../images/gradientBg.png')}
						style={{
							width: avatarSize,
							height: avatarSize,
							borderRadius: 50,
							borderWidth: 1,
							borderColor: '#0038FF'
						}}
					/>
					<TouchableOpacity className='items-center' onPress={showImagePicker}>
						<Text style={{ marginTop: 2 }}>Выбрать фотографию</Text>
					</TouchableOpacity>
				</Animated.View>
			</Animated.ScrollView>

			<ImagePickerExample
				isVisible={isImagePickerVisible}
				onClose={hideImagePicker}
			/>
		</View>
	)
}

export default Profile
