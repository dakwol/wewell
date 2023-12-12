import React, { FC, useRef, useState } from 'react'
import { View, Text, TouchableOpacity, Animated } from 'react-native'
import { AntDesign } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import ContactPicker, {
	ContactPickerRef
} from '@/components/blocks/ContactPicker/ContactPicker'
import HomeFirsScreen from '@/components/blocks/homeFirsScreen/homeFirsScreen'
import HomeScreenHistoryComponent from '@/components/blocks/homeScreenHistoryComponent/HomeScreenHistoryComponent'

const Home: FC = () => {
	const scrollY = useRef(new Animated.Value(0)).current
	const contactPickerRef = useRef<ContactPickerRef>(null)

	const [showContactPicker, setShowContactPicker] = useState(false) // Manage the visibility of the ContactPicker

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

	const dataHistory = [
		{
			id: 1,
			name: 'ХУЙ',
			image: require('../../../images/AvatarUser1.png')
		},
		{
			id: 1,
			name: 'ХУЙ',
			image: require('../../../images/AvatarUser1.png')
		},
		{
			id: 1,
			name: 'ХУЙ',
			image: require('../../../images/AvatarUser1.png')
		},
		{
			id: 1,
			name: 'ХУЙ',
			image: require('../../../images/AvatarUser1.png')
		},
		{
			id: 1,
			name: 'ХУЙ',
			image: require('../../../images/AvatarUser1.png')
		},
		{
			id: 1,
			name: 'ХУЙ',
			image: require('../../../images/AvatarUser1.png')
		},
		{
			id: 1,
			name: 'ХУЙ',
			image: require('../../../images/AvatarUser1.png')
		},
		{
			id: 1,
			name: 'ХУЙ',
			image: require('../../../images/AvatarUser1.png')
		},
		{
			id: 1,
			name: 'ХУЙ',
			image: require('../../../images/AvatarUser1.png')
		},
		{
			id: 1,
			name: 'ХУЙ',
			image: require('../../../images/AvatarUser1.png')
		},
		{
			id: 1,
			name: 'ХУЙ',
			image: require('../../../images/AvatarUser1.png')
		},
		{
			id: 1,
			name: 'ХУЙ',
			image: require('../../../images/AvatarUser1.png')
		},
		{
			id: 1,
			name: 'ХУЙ',
			image: require('../../../images/AvatarUser1.png')
		},
		{
			id: 1,
			name: 'ХУЙ',
			image: require('../../../images/AvatarUser1.png')
		},
		{
			id: 1,
			name: 'ХУЙ',
			image: require('../../../images/AvatarUser1.png')
		},
		{
			id: 1,
			name: 'ХУЙ',
			image: require('../../../images/AvatarUser1.png')
		},
		{
			id: 1,
			name: 'ХУЙ',
			image: require('../../../images/AvatarUser1.png')
		},
		{
			id: 1,
			name: 'ХУЙ',
			image: require('../../../images/AvatarUser1.png')
		},
		{
			id: 1,
			name: 'ХУЙ',
			image: require('../../../images/AvatarUser1.png')
		},
		{
			id: 1,
			name: 'ХУЙ',
			image: require('../../../images/AvatarUser1.png')
		},
		{
			id: 1,
			name: 'ХУЙ',
			image: require('../../../images/AvatarUser1.png')
		},
		{
			id: 1,
			name: 'ХУЙ',
			image: require('../../../images/AvatarUser1.png')
		},
		{
			id: 1,
			name: 'ХУЙ',
			image: require('../../../images/AvatarUser1.png')
		},
		{
			id: 1,
			name: 'ХУЙ',
			image: require('../../../images/AvatarUser1.png')
		},
		{
			id: 1,
			name: 'ХУЙ',
			image: require('../../../images/AvatarUser1.png')
		},
		{
			id: 1,
			name: 'ХУЙ',
			image: require('../../../images/AvatarUser1.png')
		},
		{
			id: 1,
			name: 'ХУЙ',
			image: require('../../../images/AvatarUser1.png')
		},
		{
			id: 1,
			name: 'ХУЙ',
			image: require('../../../images/AvatarUser1.png')
		},
		{
			id: 1,
			name: 'ХУЙ',
			image: require('../../../images/AvatarUser1.png')
		},
		{
			id: 1,
			name: 'ХУЙ',
			image: require('../../../images/AvatarUser1.png')
		},
		{
			id: 1,
			name: 'ХУЙ',
			image: require('../../../images/AvatarUser1.png')
		},
		{
			id: 1,
			name: 'ХУЙ',
			image: require('../../../images/AvatarUser1.png')
		},
		{
			id: 1,
			name: 'ХУЙ',
			image: require('../../../images/AvatarUser1.png')
		},
		{
			id: 1,
			name: 'ХУЙ',
			image: require('../../../images/AvatarUser1.png')
		},
		{
			id: 1,
			name: 'ХУЙ',
			image: require('../../../images/AvatarUser1.png')
		},
		{
			id: 1,
			name: 'ХУЙ',
			image: require('../../../images/AvatarUser1.png')
		},
		{
			id: 1,
			name: 'ХУЙ',
			image: require('../../../images/AvatarUser1.png')
		},
		{
			id: 1,
			name: 'ХУЙ',
			image: require('../../../images/AvatarUser1.png')
		},
		{
			id: 1,
			name: 'ХУЙ',
			image: require('../../../images/AvatarUser1.png')
		},
		{
			id: 1,
			name: 'ХУЙ',
			image: require('../../../images/AvatarUser1.png')
		},
		{
			id: 1,
			name: 'ХУЙ',
			image: require('../../../images/AvatarUser1.png')
		},
		{
			id: 1,
			name: 'ХУЙ',
			image: require('../../../images/AvatarUser1.png')
		},
		{
			id: 1,
			name: 'ХУЙ',
			image: require('../../../images/AvatarUser1.png')
		},
		{
			id: 1,
			name: 'ХУЙ',
			image: require('../../../images/AvatarUser1.png')
		},
		{
			id: 1,
			name: 'ХУЙ',
			image: require('../../../images/AvatarUser1.png')
		},
		{
			id: 1,
			name: 'ХУЙ',
			image: require('../../../images/AvatarUser1.png')
		},
		{
			id: 1,
			name: 'ХУЙ',
			image: require('../../../images/AvatarUser1.png')
		}
	]

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
			>
				<Animated.View
					style={{
						justifyContent: 'center',
						alignItems: 'center',
						marginTop: 20
					}}
				>
					<TouchableOpacity
						className='items-center'
						onPress={() => {
							navigateToProfile()
						}}
					>
						<Animated.Image
							source={require('../../../images/AvatarUser1.png')}
							style={{ width: avatarSize, height: avatarSize }}
						/>
						<Text style={{ marginTop: 2 }}>User</Text>
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
					<AntDesign name='plus' size={24} color='white' />
				</TouchableOpacity>
			</View>
		</View>
	)
}

export default Home
