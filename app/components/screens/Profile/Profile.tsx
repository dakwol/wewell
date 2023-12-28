import MeetingApiRequest from '@/api/Meeting/Meeting'
import UserApiRequest from '@/api/User/Users'
import ImagePickerExample from '@/components/blocks/ImagePicker/ImagePicker'
import { useAuth } from '@/hooks/useAuth'
import { updateData } from '@/redux/actions/userActions'
import userData from '@/redux/reducers/userData'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'
import React, { FC, useEffect, useRef, useState } from 'react'
import { Animated, Text, TouchableOpacity, View } from 'react-native'
//@ts-ignore
import Image from 'react-native-remote-svg'
import { useDispatch } from 'react-redux'

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
	const [dataHistory, setDataHistory] = useState([])
	const [repeatUser, setRepeatUser] = useState<IRepeatUser>()
	const { user } = useAuth()
	const dispatch = useDispatch()
	const navigation = useNavigation()

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

	const avatarsUpdate = (avatars: any) => {
		const dataAvatars = new FormData()
		dataAvatars.append('ParentModelId', String(user.user.id))
		dataAvatars.append('ImageFile', avatars)

		userApi.avatarsUpdate(dataAvatars).then(resp => {
			console.log('resp', resp)
		})
	}

	useEffect(() => {
		meetingApi.getMeetingsUser(user.user.id).then(resp => {
			console.log('meet', resp)
			if (resp.success) {
				//@ts-ignore
				setDataHistory(resp.data)
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
			console.log(
				'Самый часто повторяющийся id (не равный текущему пользователю):',
				mostRepeatedId
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

				<View className='flex-row justify-between'>
					<View className='bg-white rounded-2xl justify-center items-center h-40 w-40'>
						<Text className='text-7xl font-bold'>
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
							<Image
								source={require('../../../images/Icons/Crown.svg')}
								className={'z-50 w-14 h-14 absolute top-0 right-2'}
								style={{ transform: [{ rotateZ: '20deg' }] }}
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
							<Image
								source={require('../../../images/Icons/Crown.svg')}
								className={'mb-3 w-14 h-14'}
							/>
							<Text className='text-xs text-gray-400 w-24 text-center'>
								У тебя пока нет лидера встреч
							</Text>
						</View>
					)}
				</View>
				{dataHistory.length != 0 ? (
					dataHistory.map(item => {
						return (
							<View>
								<Image
									source={{ uri: repeatUser?.url }}
									className={'w-20 h-20 rounded-full mb-2'}
								/>
								<Text>{item.place.name}</Text>
							</View>
						)
					})
				) : (
					<View className='justify-center items-center mt-9'>
						<Text className='text-xs text-gray-400 w-28 text-center'>
							Здесь будет история твоих встреч
						</Text>
					</View>
				)}
			</Animated.ScrollView>

			<ImagePickerExample
				isVisible={isImagePickerVisible}
				onClose={() => hideImagePicker()}
				onImagePick={e => {
					avatarsUpdate(e)
				}}
			/>

			<View className='w-full items-center mb-4'>
				<TouchableOpacity
					onPress={() => {
						logOut()
					}}
					className='justify-center items-center'
				>
					<Text className='text-blue-700 text-lg'>Выход</Text>
				</TouchableOpacity>
			</View>
		</View>
	)
}

export default Profile
