import React, { FC, useEffect, useRef, useState } from 'react'
import {
	View,
	Image,
	Text,
	Button,
	TouchableOpacity,
	Animated,
	ScrollView
} from 'react-native'
import Swiper from 'react-native-swiper'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useAuth } from '@/hooks/useAuth'
import { formatDateAndTime } from '@/components/UI/functions/functions'
import { YaMap, Marker, Geocoder } from 'react-native-yamap'
import { MaterialIcons } from '@expo/vector-icons'
import MeetingApiRequest from '@/api/Meeting/Meeting'
import { AntDesign } from '@expo/vector-icons'
import { useDispatch, useSelector } from 'react-redux'

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
	const navigation = useNavigation()
	const dispatch = useDispatch()
	//@ts-ignore
	const forceUpdate = useSelector(state => state.updateReducer.forceUpdate)

	const meetingApi = new MeetingApiRequest()

	const handleReadMore = () => {
		//@ts-ignore
		setNumberOfLines(prevLines => (prevLines === null ? 3 : null))
	}
	YaMap.init('1f4fe73b-c132-431c-928d-3c95d9448e78')
	Geocoder.init('adbbfab3-2998-46fa-9c77-9e41f50d5ac9')

	useEffect(() => {
		if (dataInvite) {
			Geocoder.addressToGeo(dataInvite.place.address)
				.then((resp: any) => {
					const lat = resp.lat
					const lon = resp.lon
					setMapCoordinates({ lat, lon })
				})
				.catch(error => {
					console.error('Error:', error)
				})
		}
	}, [route.params])

	const completeInvite = (inviteStatus: string) => {
		const dataMeeting = {
			id: dataInvite.id,
			status: inviteStatus,
			isActive: true,
			isShowForCreator: inviteStatus === 'Cancelled' && isMy ? false : true,
			isShowForGuest: inviteStatus === 'Cancelled' ? false : true
		}
		meetingApi
			.update({ urlParams: dataInvite.id, body: dataMeeting })
			.then(resp => {
				if (resp.success) {
					navigation.goBack()
					dispatch({ type: 'SET_FORCE_UPDATE', payload: !forceUpdate })
				}
			})
	}

	return (
		<View className='flex-1 justify-end'>
			<TouchableOpacity
				onPress={() => {
					//@ts-ignore
					navigation.goBack()
				}}
				className='absolute top-12 left-4 z-50 w-7 h-7'
			>
				<MaterialIcons name='arrow-back-ios' size={28} color='white' />
			</TouchableOpacity>
			<Animated.Image
				source={
					dataInvite.place.url && dataInvite.place.url != ''
						? { uri: dataInvite.place.url }
						: require('../../../images/icon.png')
				}
				className={'w-full h-3/5 absolute top-0 -z-30'}
			/>

			<View className='bg-white pr-4 pl-4 rounded-3xl h-2/3'>
				<ScrollView
					showsHorizontalScrollIndicator={false}
					showsVerticalScrollIndicator={false}
					className='pt-6 pb-6 '
					scrollEnabled={isScrollEnabled}
				>
					<View className='gap-6 flex flex-row mb-5'>
						<View className='items-center w-20'>
							<Animated.Image
								source={
									isMy
										? dataInvite.guest && dataInvite.guest.url
											? {
													//@ts-ignore
													uri: dataInvite.guest.url
											  }
											: require('../../../images/icon.png')
										: dataInvite.creator && dataInvite.creator.url
										  ? {
													//@ts-ignore
													uri: dataInvite.creator.url
										    }
										  : require('../../../images/icon.png')
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
					<Text className='text-2xl font-bold mb-3 mt-3'>Локация</Text>
					<View className='rounded-3xl overflow-hidden mb-28'>
						{mapCoordinates && (
							<YaMap
								className='w-full h-48 '
								initialRegion={{
									lat: mapCoordinates?.lat,
									lon: mapCoordinates?.lon,
									zoom: 18,
									azimuth: 0
								}}
								mapType={'vector'}
								showUserPosition={false}
								rotateGesturesEnabled={false}
								onTouchMove={() => setIsScrollEnabled(false)}
								onTouchEnd={() => setIsScrollEnabled(true)}
							>
								<Marker
									children={
										<Image
											source={
												dataInvite?.place?.url
													? { uri: dataInvite?.place?.url }
													: require('../../../images/icon.png')
											}
											style={{
												width: 30,
												height: 30,
												borderRadius: 30,
												borderWidth: 2
											}}
										/>
									}
									point={{
										lat: mapCoordinates?.lat,
										lon: mapCoordinates?.lon
									}}
								/>
							</YaMap>
						)}
					</View>
				</ScrollView>

				{dataInvite.status === 'Invited' && !dataInvite.isArchive && (
					<View
						className={`flex flex-row w-full ${
							isMy ? 'justify-center' : 'justify-between'
						}`}
						style={{
							position: 'absolute',

							alignItems: 'center',
							bottom: 30,
							left: '5%'
						}}
					>
						{!isMy && (
							<TouchableOpacity
								className='bg-blue-600 p-3 rounded-full'
								onPress={() => {
									completeInvite('Cancelled')
								}}
							>
								<AntDesign name='close' size={24} color='white' />
							</TouchableOpacity>
						)}

						<TouchableOpacity
							className={`${
								isMy ? 'w-full' : 'w-4/5'
							} bg-blue-600 justify-center items-center p-3 rounded-3xl`}
							onPress={() => {
								completeInvite(isMy ? 'Cancelled' : 'Waiting')
							}}
						>
							<Text className='text-base text-white'>
								{isMy ? 'Отменить инвайт' : 'Принять инвайт'}
							</Text>
						</TouchableOpacity>
					</View>
				)}
			</View>
		</View>
	)
}

export default Invite
