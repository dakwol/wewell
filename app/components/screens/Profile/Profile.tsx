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

	const dataHistory = [
		{
			id: 1
		}
	]

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
				className={'p-4'}
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
						<Text style={{ marginTop: 2 }} className='text-blue-700 text-base'>
							Выбрать фотографию
						</Text>
					</TouchableOpacity>

					<View className='bg-white justify-between items-center w-full flex-row p-2 rounded-xl mt-2 mb-8'>
						<Text>Имя</Text>
						<Text>Алексей</Text>
					</View>
				</Animated.View>

				<View className='flex-row justify-between'>
					<View className='bg-white rounded-2xl justify-center items-center h-40 w-40'>
						<Text className='text-7xl font-bold'>0</Text>
						<Text className='mt-3 text-xl'>встречи</Text>
					</View>
					{/* <View className='bg-white rounded-2xl justify-center items-center relative h-40 w-40'>
						<Image
							source={require('../../../images/Icons/Crown.svg')}
							className={'z-50 w-14 h-14 absolute top-0 right-2'}
							style={{ transform: [{ rotateZ: '20deg' }] }}
						/>
						<Image
							source={require('../../../images/gradientBg.png')}
							className={'w-20 h-20 rounded-full mb-2'}
						/>
						<Text>Ваня Горбунков</Text>
						<Text className='text-xs text-gray-400'>лидер встреч</Text>
					</View> */}
					<View className='bg-white rounded-2xl justify-center items-center h-40 w-40'>
						<Image
							source={require('../../../images/Icons/Crown.svg')}
							className={'mb-3 w-14 h-14'}
						/>
						<Text className='text-xs text-gray-400 w-24 text-center'>
							У тебя пока нет лидера встреч
						</Text>
					</View>
				</View>

				<View className='justify-center items-center mt-9'>
					<Text className='text-xs text-gray-400 w-28 text-center'>
						Здесь будет история твоих встреч
					</Text>
				</View>
			</Animated.ScrollView>

			<ImagePickerExample
				isVisible={isImagePickerVisible}
				onClose={hideImagePicker}
			/>

			<View className='w-full items-center mb-4'>
				<TouchableOpacity
					onPress={() => {}}
					className='justify-center items-center'
				>
					<Text className='text-blue-700 text-lg'>Выход</Text>
				</TouchableOpacity>
			</View>
		</View>
	)
}

export default Profile
