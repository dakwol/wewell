import MeetingApiRequest from '@/api/Meeting/Meeting'
import UserApiRequest from '@/api/User/Users'
import BlurImage from '@/components/UI/BlurImage/BlurImage'
import { formatDateAndTime } from '@/components/UI/functions/functions'
import ImagePickerExample from '@/components/blocks/ImagePicker/ImagePicker'
import { useAuth } from '@/hooks/useAuth'
import { updateData } from '@/redux/actions/userActions'
import userData from '@/redux/reducers/userData'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'
import React, { FC, Fragment, useEffect, useRef, useState } from 'react'
import {
	Animated,
	StatusBar,
	Text,
	TouchableOpacity,
	View,
	Image
} from 'react-native'
//@ts-ignore
// import Image from 'react-native-remote-svg'
import SvgImage from 'react-native-remote-svg'

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

const Profile: FC = () => {
	const scrollY = useRef(new Animated.Value(0)).current
	const [isImagePickerVisible, setIsImagePickerVisible] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [dataHistory, setDataHistory] = useState([])
	const [repeatUser, setRepeatUser] = useState<IRepeatUser>()
	const { user, setUser } = useAuth()
	const dispatch = useDispatch()
	const navigation = useNavigation()
	const [showAll, setShowAll] = useState(false)

	// Get the items to display based on the showAll state
	const itemsToDisplay = showAll ? dataHistory : dataHistory.slice(-3)

	const userApi = new UserApiRequest()
	const meetingApi = new MeetingApiRequest()

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

	const avatarUpdate = async (avatars: any) => {
		const formData = new FormData()
		formData.append('ParentModelId', user.user.id)
		//@ts-ignore
		formData.append('ImageFile', {
			uri: avatars,
			type: 'image/jpeg', // Change the type as needed
			name: 'avatar.jpg' // Change the name as needed
		})

		try {
			const resp = await userApi.avatarsUpdate(formData)
			const updatedUser = {
				...user,
				user: { ...user.user, url: resp.data }
			}

			await AsyncStorage.setItem('user', JSON.stringify(updatedUser))
			setUser(updatedUser)
			console.log('user.user.url сохранён в AsyncStorage', updatedUser)
		} catch (error) {
			console.error(
				'Ошибка при сохранении user.user.url в AsyncStorage:',
				error
			)
		}
	}

	useEffect(() => {
		setIsLoading(true)
		meetingApi.getMeetingsUser(user.user.id).then(resp => {
			if (resp.success) {
				resp.data &&
					//@ts-ignore
					resp.data?.map(item => {
						if (item.isArchive) {
							//@ts-ignore
							setDataHistory(prev => [...prev, item])
							setIsLoading(false)
						}
					})
			}
		})
	}, [])

	useEffect(() => {
		if (dataHistory.length !== 0) {
			const currentUserID = user.user.id
			const allIds = dataHistory.flatMap(item => [
				//@ts-ignore
				item.creator.id,
				//@ts-ignore
				item.guest.id
			])

			const idCounts = {}
			allIds.forEach(id => {
				if (id !== currentUserID) {
					//@ts-ignore
					idCounts[id] = (idCounts[id] || 0) + 1
				}
			})

			const mostRepeatedId = Object.keys(idCounts).reduce((a, b) =>
				//@ts-ignore
				idCounts[a] > idCounts[b] ? a : b
			)

			if (mostRepeatedId) {
				userApi.list({ id: mostRepeatedId }).then(resp => {
					if (resp.success) {
						//@ts-ignore
						setRepeatUser(resp.data as IRepeatUser)
					}
				})
			}
		}
	}, [dataHistory, user])

	const logOut = async () => {
		try {
			await AsyncStorage.removeItem('user')
			dispatch(updateData('', ''))
			//@ts-ignore
			navigation.navigate('Auth')
		} catch {}
	}

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
						marginTop: 40
					}}
				>
					<Animated.Image
						source={
							user.user.url
								? { uri: user.user.url }
								: require('../../../images/gradientBg.png')
						}
						style={{
							width: avatarSize,
							height: avatarSize,
							borderRadius: 50,
							borderWidth: 1,
							borderColor: '#0038FF'
						}}
					/>
					<TouchableOpacity
						className='items-center'
						onPress={() => showImagePicker()}
					>
						<Text style={{ marginTop: 2 }} className='text-blue-700 text-base'>
							Выбрать фотографию
						</Text>
					</TouchableOpacity>

					<View className='bg-white justify-between items-center w-full flex-row p-2 rounded-xl mt-2 mb-8'>
						<Text>Имя</Text>
						<Text>{user?.user?.name}</Text>
					</View>
				</Animated.View>
				{isLoading ? (
					<SvgImage
						source={{ uri: 'https://svgshare.com/i/11gW.svg' }}
						className={'w-full justify-center h-16'}
					/>
				) : (
					<Fragment>
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
							{repeatUser ? (
								<View className='bg-white rounded-2xl justify-center items-center relative h-40 w-40'>
									<SvgImage
										source={{ uri: 'https://svgshare.com/i/11iC.svg' }}
										className={'z-50 w-16 h-14 absolute -top-1 right-2'}
										style={{ transform: [{ rotateZ: '17deg' }] }}
									/>
									<Image
										source={{ uri: repeatUser?.url }}
										className={'w-20 h-20 rounded-full mb-2'}
									/>
									<Text>{repeatUser?.name}</Text>
									<Text className='text-xs text-gray-400'>лидер встреч</Text>
								</View>
							) : (
								<View className='bg-white rounded-2xl justify-center items-center h-40 w-40'>
									<SvgImage
										source={{ uri: 'https://svgshare.com/i/11iC.svg' }}
										className={'mb-3 w-14 h-14'}
									/>
									<Text className='text-xs text-gray-400 w-24 text-center'>
										У тебя пока нет лидера встреч
									</Text>
								</View>
							)}
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
														: require('../../../images/iconBlue.png')
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
									{!showAll && dataHistory.length > 3
										? 'Показать все'
										: 'Свернуть'}
								</Text>
							</TouchableOpacity>
						)}
					</Fragment>
				)}

				<View className='w-full items-center mb-8 '>
					<TouchableOpacity
						onPress={() => {
							logOut()
						}}
						className='justify-center items-center'
					>
						<Text className='text-blue-700 text-lg'>Выход</Text>
					</TouchableOpacity>
				</View>
			</Animated.ScrollView>
			<ImagePickerExample
				isVisible={isImagePickerVisible}
				onClose={() => hideImagePicker()}
				onImagePick={e => {
					avatarUpdate(e)
				}}
			/>
		</View>
	)
}

export default Profile
