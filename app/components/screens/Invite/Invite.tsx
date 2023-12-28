import React, { FC, useEffect, useRef, useState } from 'react'
import {
	View,
	Image,
	Text,
	Button,
	TouchableOpacity,
	Animated
} from 'react-native'
import Swiper from 'react-native-swiper'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useAuth } from '@/hooks/useAuth'
import { formatDateAndTime } from '@/components/UI/functions/functions'
// import { YaMap, Marker, Geocoder } from 'react-native-yamap'

const Invite: FC = () => {
	const route = useRoute()
	const { user } = useAuth()
	//@ts-ignore
	const { dataInvite } = route.params
	const isMy = user.user.id === dataInvite.creator.id
	const [mapCoordinates, setMapCoordinates] = useState({ lat: 1, lon: 1 })

	const [isScrollEnabled, setIsScrollEnabled] = useState(true)

	const [numberOfLines, setNumberOfLines] = useState(3)
	const { description } = dataInvite.place

	const handleReadMore = () => {
		//@ts-ignore
		setNumberOfLines(prevLines => (prevLines === null ? 3 : null))
	}

	// useEffect(() => {
	// 	YaMap.init('1f4fe73b-c132-431c-928d-3c95d9448e78')
	// 	Geocoder.init('adbbfab3-2998-46fa-9c77-9e41f50d5ac9')
	// 	if (dataInvite) {
	// 		Geocoder.addressToGeo(dataInvite.place.address)
	// 			.then((resp: any) => {
	// 				const lat = resp.lat
	// 				const lon = resp.lon
	// 				setMapCoordinates({ lat, lon })
	// 			})
	// 			.catch(error => {
	// 				console.error('Error:', error)
	// 			})
	// 	}
	// }, [route.params])

	const scrollY = useRef(new Animated.Value(0)).current

	const handleScroll = Animated.event(
		[{ nativeEvent: { contentOffset: { y: scrollY } } }],
		{
			useNativeDriver: false
		}
	)

	const containerHeight = scrollY.interpolate({
		inputRange: [0, 200], // Adjust this threshold as needed
		outputRange: ['65%', '100%'],
		extrapolate: 'clamp'
	})

	return (
		<View className='flex-1 justify-end'>
			<TouchableOpacity
				onPress={() => {
					//@ts-ignore
					navigation.goBack()
				}}
				className='absolute top-2 left-2 z-50 w-7 h-7'
			>
				<Image source={require('../../../images/Icons/BackIcon.svg')} />
			</TouchableOpacity>
			<Animated.Image
				source={{ uri: dataInvite.place.url }}
				className={'w-full h-3/5 absolute top-0 -z-30'}
			/>

			<View className='bg-white pr-4 pl-4 pt-6 pb-6 rounded-3xl h-2/3'>
				<View className='gap-6 flex flex-row mb-5'>
					<View className='items-center w-20'>
						<Animated.Image
							source={
								isMy
									? {
											//@ts-ignore
											uri: dataInvite.guest && dataInvite.guest.url
									  }
									: {
											//@ts-ignore
											uri: dataInvite.creator && dataInvite.creator.url
									  }
							}
							style={{
								width: 80,
								height: 80,
								borderWidth: 2,
								borderColor: 'blue'
							}}
							className={'rounded-full object-cover mb-2'}
						/>
						<Text>
							{isMy
								? dataInvite.guest && dataInvite.guest.name
								: dataInvite.creator && dataInvite.creator.name}
						</Text>
					</View>
					<View className='flex flex-col'>
						<Text className='pt-2 pb-2 pr-6 pl-6 bg-gray-100 rounded-3xl mb-4 text-center text-blue-600 text-sm'>
							{formatDateAndTime(dataInvite.date)}
						</Text>
						<Text className='pt-2 pb-2 pr-6 pl-6 bg-gray-100 rounded-3xl w-28 text-center  text-blue-600 text-sm'>{`${dataInvite.minDurationHours} - ${dataInvite.maxDurationHours} часа`}</Text>
					</View>
				</View>
				<View>
					<Text className='text-2xl font-bold mb-1'>
						{dataInvite.place.name}
					</Text>
					<Text className='mb-3 text-base text-gray-400'>
						{dataInvite.place.address}
					</Text>
					<Text className='text-base' numberOfLines={numberOfLines}>
						{description}
					</Text>
					{numberOfLines !== null && (
						<TouchableOpacity onPress={handleReadMore}>
							<Text className='text-blue-600 text-sm'>Читать далее</Text>
						</TouchableOpacity>
					)}
				</View>

				<View
					style={{
						borderRadius: 22,
						overflow: 'hidden',
						marginTop: 12,
						marginBottom: 130
					}}
				>
					{/* <YaMap
						style={{
							width: 200,
							height: 190
						}}
						initialRegion={{
							lat: mapCoordinates.lat,
							lon: mapCoordinates.lon,
							zoom: 18,
							azimuth: 0
						}}
						mapType={'vector'}
						showUserPosition={false}
						rotateGesturesEnabled={false}
						onTouchMove={() => setIsScrollEnabled(false)}
						onTouchEnd={() => setIsScrollEnabled(true)}
					>
						{/* <Marker
							children={
								<Image
									source={{ uri: dataInvite.place.url }}
									style={{
										width: 30,
										height: 30,
										borderRadius: 30,
										borderWidth: 2
									}}
								/>
							}
							point={{
								lat: mapCoordinates.lat,
								lon: mapCoordinates.lon
							}}
						/> 
					</YaMap> */}
				</View>
			</View>
		</View>
	)
}

export default Invite
