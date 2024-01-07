import React, { FC, useEffect, useRef, useState } from 'react'
import { View, Text, TouchableOpacity, Animated } from 'react-native'
import { AntDesign } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import ContactPicker, {
	ContactPickerRef
} from '@/components/blocks/ContactPicker/ContactPicker'
import HomeFirsScreen from '@/components/blocks/homeFirsScreen/homeFirsScreen'
import HomeScreenHistoryComponent from '@/components/blocks/homeScreenHistoryComponent/HomeScreenHistoryComponent'
import { useAuth } from '@/hooks/useAuth'
import MeetingApiRequest from '@/api/Meeting/Meeting'
import { useSelector } from 'react-redux'

const Home: FC = () => {
	const scrollY = useRef(new Animated.Value(0)).current
	const contactPickerRef = useRef<ContactPickerRef>(null)

	const meetingApi = new MeetingApiRequest()

	const { user } = useAuth()
	//@ts-ignore
	const forceUpdate = useSelector(state => state.updateReducer.forceUpdate)

	console.log('isUpdate', forceUpdate)

	const [showContactPicker, setShowContactPicker] = useState(false) // Manage the visibility of the ContactPicker

	const [dataHistory, setDataHistory] = useState([])

	const avatarSize = scrollY.interpolate({
		inputRange: [0, 150],
		outputRange: [50, 30],
		extrapolate: 'clamp'
	})

	const navigation = useNavigation()

	const navigateToProfile = () => {
		//@ts-ignore
		navigation.navigate('Profile')
	}

	const handleAddContactPress = () => {
		setShowContactPicker(true)
	}

	const handleContactPickerClose = () => {
		setShowContactPicker(!showContactPicker)
	}

	useEffect(() => {
		const unsubscribe = navigation.addListener('focus', () => {
			setShowContactPicker(false)
		})

		return unsubscribe
	}, [navigation])

	useEffect(() => {
		const fetchMeetings = async () => {
			try {
				const resp = await meetingApi.getMeetingsUser(user.user.id)
				if (resp.success) {
					//@ts-ignore
					setDataHistory(resp.data)
				}
			} catch (error) {
				console.error('Error fetching meetings:', error)
			}
		}

		fetchMeetings()

		const intervalId = setInterval(fetchMeetings, 10000)

		return () => clearInterval(intervalId)
	}, [user, forceUpdate])

	return (
		<View style={{ flex: 1, backgroundColor: 'white' }}>
			<Animated.ScrollView
				onScroll={Animated.event(
					[{ nativeEvent: { contentOffset: { y: scrollY } } }],
					{
						useNativeDriver: false
					}
				)}
				scrollEventThrottle={16}
				showsVerticalScrollIndicator={false}
			>
				<Animated.View
					style={{
						justifyContent: 'center',
						alignItems: 'center',
						marginTop: 50
					}}
				>
					<TouchableOpacity
						className='items-center'
						onPress={() => {
							navigateToProfile()
						}}
					>
						<Animated.Image
							source={
								user?.user?.url
									? { uri: user?.user?.url }
									: require('../../../images/icon.png')
							}
							style={{ width: avatarSize, height: avatarSize }}
							className={'rounded-full'}
						/>
						<Text style={{ marginTop: 2 }}>{user?.user?.name}</Text>
					</TouchableOpacity>
				</Animated.View>
				{dataHistory.length != 0 ? (
					<HomeScreenHistoryComponent data={dataHistory} scrollY={scrollY} />
				) : (
					<HomeFirsScreen />
				)}
			</Animated.ScrollView>
			{showContactPicker && (
				<ContactPicker
					ref={contactPickerRef}
					onClose={handleContactPickerClose} // Pass a function to handle closing the ContactPicker
				/>
			)}
			<View className='w-full items-center absolute bottom-4'>
				<TouchableOpacity
					onPress={() => {
						handleAddContactPress()
					}}
					className='bg-blue-700 w-11 h-11 rounded-full justify-center items-center'
				>
					<AntDesign name='plus' size={16} color='white' />
				</TouchableOpacity>
			</View>
		</View>
	)
}

export default Home
