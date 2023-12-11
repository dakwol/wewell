import React, { FC, useEffect, useRef, useState } from 'react'
import { View, Image, Text, Button, TouchableOpacity } from 'react-native'
import Swiper from 'react-native-swiper'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'

const Onboarding: FC = () => {
	const swiperRef = useRef(null)
	const [currentIndex, setCurrentIndex] = useState(0)
	const [onboardingShown, setOnboardingShown] = useState(false)
	const navigation = useNavigation()
	const dataSlide = [
		{
			id: 1,
			image: require('../../../images/SlideOne.png'),
			title: 'Теперь не нужно выбирать',
			text: 'Больше не придётся переживать о том, куда вместе сходить, и как сделать встречу интересной'
		},
		{
			id: 2,
			image: require('../../../images/SlideTwo.png'),
			title: 'Играйте в WeWell ',
			text: 'Вводите параметры и отправляйтесь в назначенное место'
		},
		{
			id: 3,
			image: require('../../../images/SlideThr.png'),
			title: 'Каждая встреча — это новое',
			text: 'Новое место, новое событие, новые эмоции и впечатления, новый опыт'
		},
		{
			id: 4,
			image: require('../../../images/SlideFor.png'),
			title: 'Создавайте встречи с WeWell',
			text: 'Открывайте новое вместе. Это объединяет'
		}
	]

	useEffect(() => {
		const checkOnboardingStatus = async () => {
			try {
				const value = await AsyncStorage.getItem('@onboarding_shown')
				if (value !== null) {
					// Onboarding has been shown before
					setOnboardingShown(true)

					//@ts-ignore
					navigation.navigate('Auth')
				}
			} catch (error) {
				console.error('Error reading onboarding status:', error)
			}
		}

		checkOnboardingStatus()
	}, [])

	const saveOnboardingStatus = async () => {
		try {
			await AsyncStorage.setItem('@onboarding_shown', 'true')
			setOnboardingShown(true)

			//@ts-ignore
			navigation.navigate('Auth')
		} catch (error) {
			console.error('Error saving onboarding status:', error)
		}
	}

	const handleNext = () => {
		if (currentIndex < dataSlide.length - 1) {
			//@ts-ignore
			swiperRef.current.scrollBy(1)
		} else {
			saveOnboardingStatus()
			//@ts-ignore
			navigation.navigate('Auth')
		}
	}

	if (onboardingShown) {
		return null // Return null or navigate to the next screen if onboarding has been shown
	}

	return (
		<View className='flex-1'>
			<View className='absolute top-0, w-screen z-50 justify-between flex-row'>
				{dataSlide.map((_, index) => (
					<View
						key={index}
						className={`bg-gray-400 w-20 h-1 ${
							currentIndex === index && 'bg-white'
						}`}
					/>
				))}
			</View>
			<Swiper
				showsButtons={false}
				scrollEnabled={false}
				style={{ position: 'relative' }}
				paginationStyle={{ display: 'none' }}
				onIndexChanged={index => setCurrentIndex(index)}
				ref={swiperRef}
				loop={false}
			>
				{dataSlide.map((item, index) => (
					<View key={index} className='flex-1 h-screen p-6 relative'>
						<Image
							source={item.image}
							className='top-0 h-screen absolute w-screen -z-40'
						/>
						<View className='flex-1 flex-col justify-end mb-28'>
							<Text className='color-white font-bold text-2xl'>
								{item.title}
							</Text>
							<Text className='color-white text-sm'>{item.text}</Text>
						</View>
					</View>
				))}
			</Swiper>
			<View className='p-6 absolute bottom-12 w-screen'>
				<TouchableOpacity
					className='p-3 bg-blue-700 rounded-3xl  w-full'
					onPress={handleNext}
				>
					<Text className='color-white text-center'>
						{currentIndex < dataSlide.length - 1
							? 'Далее'
							: 'Войти по номеру телефона'}
					</Text>
				</TouchableOpacity>
			</View>
		</View>
	)
}

export default Onboarding
