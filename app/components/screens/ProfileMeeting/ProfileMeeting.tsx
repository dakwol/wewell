import MeetingApiRequest from '@/api/Meeting/Meeting'
import UserApiRequest from '@/api/User/Users'
import BlurImage from '@/components/UI/BlurImage/BlurImage'
import { formatDateAndTime } from '@/components/UI/functions/functions'
import ImagePickerExample from '@/components/blocks/ImagePicker/ImagePicker'
import { useAuth } from '@/hooks/useAuth'
import { updateData } from '@/redux/actions/userActions'
import userData from '@/redux/reducers/userData'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation, useRoute } from '@react-navigation/native'
import React, { FC, useEffect, useRef, useState } from 'react'
import { Animated, StatusBar, Text, TouchableOpacity, View } from 'react-native'
//@ts-ignore
import Image from 'react-native-remote-svg'
import { useDispatch } from 'react-redux'
import { dateUtils } from '../../UI/functions/functions'
import { MaterialIcons } from '@expo/vector-icons'

interface IRepeatUser {
	avatarPath: string
	id: number
	isAllPreferences: boolean
	name: string
	phoneNumber: string
	preferences: [object]
	url: string
}

const ProfileMeeting: FC = () => {
	const scrollY = useRef(new Animated.Value(0)).current
	const [isImagePickerVisible, setIsImagePickerVisible] = useState(false)
	const [dataHistory, setDataHistory] = useState([])
	const [lastPlace, setLastPlace] = useState<any>()
	const { user } = useAuth()
	const dispatch = useDispatch()
	const navigation = useNavigation()
	const [showAll, setShowAll] = useState(false)

	const route = useRoute()

	// Get the items to display based on the showAll state
	const itemsToDisplay = showAll ? dataHistory : dataHistory.slice(-3)

	const userApi = new UserApiRequest()
	const meetingApi = new MeetingApiRequest()

	const avatarSize = scrollY.interpolate({
		inputRange: [0, 150],
		outputRange: [80, 50],
		extrapolate: 'clamp'
	})

	useEffect(() => {
		meetingApi.getMeetingsUser(user.user.id).then(resp => {
			console.log('meet', resp)
			if (resp.success) {
				//@ts-ignore
				resp.data.map(item => {
					if (
						//@ts-ignore
						(item.guest.id === route.params.dataInvite.guest.id ||
							//@ts-ignore
							item.creator.id === route.params.dataInvite.guest) &&
						item.isArchive
					) {
						//@ts-ignore
						setDataHistory(prev => [...prev, item])
					}
				})
			}
		})
	}, [])

	useEffect(() => {
		setLastPlace(dataHistory[dataHistory.length - 1])
	}, [dataHistory])

	const headerBackgroundColor = scrollY.interpolate({
		inputRange: [0, 150],
		outputRange: ['transparent', 'white'],
		extrapolate: 'clamp'
	})

	return (
		<View className='flex-1'>
			<Animated.View
				className='absolute w-full justify-between flex-row p-4 mt-6 align-middle items-center z-50'
				style={{
					backgroundColor: headerBackgroundColor
				}}
			>
				<TouchableOpacity
					onPress={() => {
						//@ts-ignore
						navigation.goBack()
					}}
				>
					<MaterialIcons name='arrow-back-ios' size={24} color='blue' />
				</TouchableOpacity>
				<TouchableOpacity
					onPress={() => {
						//@ts-ignore
						navigation.navigate('Home')
					}}
				>
					<Text className='text-blue-700 text-base'>Готово</Text>
				</TouchableOpacity>
			</Animated.View>
			<Animated.ScrollView
				onScroll={Animated.event(
					[{ nativeEvent: { contentOffset: { y: scrollY } } }],
					{ useNativeDriver: false }
				)}
				scrollEventThrottle={16}
				className={'p-4'}
				showsVerticalScrollIndicator={false}
			>
				<Animated.View
					style={{
						justifyContent: 'center',
						alignItems: 'center',
						marginTop: 40,
						marginBottom: 36
					}}
				>
					<Animated.Image
						source={
							//@ts-ignore
							route?.params?.dataInvite?.creator.id === user.user.id
								? {
										uri:
											//@ts-ignore
											route.params.dataInvite.guest.url &&
											//@ts-ignore
											route.params.dataInvite.guest.url
								  }
								: {
										//@ts-ignore
										uri:
											//@ts-ignore
											route.params.dataInvite.creator.url &&
											//@ts-ignore
											route.params.dataInvite.creator.url
								  }
						}
						style={{
							width: avatarSize,
							height: avatarSize,
							borderRadius: 50,
							borderWidth: 1,
							borderColor: '#0038FF'
						}}
					/>
					<Text className='mt-2 text-sm'>
						{
							//@ts-ignore
							route?.params?.dataInvite?.creator.id === user.user.id
								? //@ts-ignore
								  route.params.dataInvite.guest.name
								: //@ts-ignore
								  route.params.dataInvite.creator.name
						}
					</Text>
				</Animated.View>

				<View className='flex-row justify-between mb-4'>
					<View className='bg-white rounded-2xl justify-center items-center h-40 w-40'>
						<Text className='font-bold text-7xl'>
							{dataHistory.length != 0 ? dataHistory.length : 0}
						</Text>
						<Text className='mt-3 text-xl'>{`${
							[2, 3, 4].includes(dataHistory.length)
								? dataHistory.length === 1
									? 'встреча'
									: 'встречи'
								: 'встреч'
						}`}</Text>
					</View>
					<View className='bg-white rounded-2xl justify-center items-center relative h-40 w-40'>
						<Image
							source={
								lastPlace?.place?.url
									? { uri: lastPlace?.place?.url }
									: require('../../../images/icon.png')
							}
							className={'w-20 h-20 rounded-full mb-2'}
						/>
						<Text className='text-center'>{lastPlace?.place?.name}</Text>
						<Text className='text-xs text-gray-400'>Последняя встреча</Text>
					</View>
				</View>
				<View className='flex-col-reverse flex'>
					{itemsToDisplay.length !== 0 ? (
						itemsToDisplay.map((item, index) => {
							//@ts-ignore
							const isMy = user.user.id === item.creator.id
							return (
								<TouchableOpacity
									className='h-20 mt-3'
									onPress={() => {
										//@ts-ignore
										navigation.navigate('Invite', { dataInvite: item })
									}}
								>
									<BlurImage
										resizeMode={'cover'}
										resizeMethod={'resize'}
										media={
											//@ts-ignore
											item.place.url != null
												? //@ts-ignore
												  { uri: item.place.url }
												: require('../../../images/icon.png')
										}
										blur={true}
										style={{
											width: '100%',
											height: 80,
											borderRadius: 24,
											position: 'absolute'
										}}
									/>
									<View className='w-full p-4 flex flex-row justify-between items-center '>
										<View className='flex flex-row gap-4'>
											<Image
												source={
													isMy
														? {
																//@ts-ignore
																uri: item.guest && item.guest.url
														  }
														: {
																//@ts-ignore
																uri: item.creator && item.creator.url
														  }
												}
												className={'w-12 h-12 rounded-full mb-2'}
											/>
											<View className='flex flex-col justify-center h-12'>
												<Text className='text-white font-bold text-base'>
													{isMy
														? //@ts-ignore
														  item.guest && item.guest.name
														: //@ts-ignore
														  item.creator && item.creator.name}
												</Text>
												<Text className='text-white text-base'>
													{
														//@ts-ignore
														item.place.name.length > 20
															? //@ts-ignore
															  item.place.name.substring(0, 20) + '...'
															: //@ts-ignore
															  item.place.name
													}
												</Text>
											</View>
										</View>

										<View className=' h-8 flex-col flex justify-between items-end '>
											<Text className='text-xs' style={{ color: '#fff' }}>
												{
													//@ts-ignore
													dateUtils.formatDateWithDayOfWeek(item.date)
												}
											</Text>
											<Text className='text-xs' style={{ color: '#fff' }}>
												{
													//@ts-ignore
													dateUtils.extractTimeFromDateTime(item.date)
												}
											</Text>
										</View>
									</View>
								</TouchableOpacity>
							)
						})
					) : (
						<View className='justify-center items-center mt-9'>
							<Text className='text-xs text-gray-400 w-28 text-center'>
								Здесь будет история твоих встреч
							</Text>
						</View>
					)}
				</View>
				{itemsToDisplay.length != 0 && (
					<TouchableOpacity
						onPress={() => setShowAll(!showAll)}
						className='w-full justify-center items-center mt-4 mb-11'
					>
						<Text className='text-base text-gray-400'>
							{!showAll && dataHistory.length > 3 ? 'Показать все' : 'Свернуть'}
						</Text>
					</TouchableOpacity>
				)}
			</Animated.ScrollView>
		</View>
	)
}

export default ProfileMeeting
